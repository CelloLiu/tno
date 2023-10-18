import { AxiosError } from 'axios';
import { IStream } from 'features/storage/interfaces';
import { FormikHelpers, FormikProps } from 'formik';
import moment from 'moment';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApiHub, useApp, useContent, useLookupOptions, useWorkOrders } from 'store/hooks';
import {
  ContentStatusName,
  ContentTypeName,
  IContentActionMessageModel,
  IContentMessageModel,
  IContentModel,
  IResponseErrorModel,
  IWorkOrderMessageModel,
  MessageTargetName,
  useCombinedView,
  WorkOrderStatusName,
  WorkOrderTypeName,
} from 'tno-core';

import { IContentFormProps } from '..';
import { IFile } from '../components/upload';
import { defaultFormValues } from '../constants';
import { IContentForm } from '../interfaces';
import { getContentPath, toForm, toModel, triggerFormikValidate } from '../utils';

export const useContentForm = ({
  contentType: initContentType = ContentTypeName.AudioVideo,
  combinedPath,
}: IContentFormProps) => {
  const hub = useApiHub();
  const { id } = useParams();
  const [{ userInfo }] = useApp();
  const navigate = useNavigate();
  const [
    ,
    {
      getContent,
      addContent,
      download,
      updateContent,
      deleteContent,
      upload,
      attach,
      stream: getStream,
    },
  ] = useContent();
  const [, { findWorkOrders, transcribe, nlp, ffmpeg }] = useWorkOrders();
  const [{ series }, { getSeries }] = useLookupOptions();

  // TODO: The stream shouldn't be reset every time the users changes the tab.
  const [stream, setStream] = React.useState<IStream>(); // TODO: Remove dependency coupling with storage component.
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { combined, formType } = useCombinedView(initContentType);
  const [contentType, setContentType] = React.useState(formType ?? initContentType);
  const [form, setForm] = React.useState<IContentForm>({
    ...defaultFormValues(contentType),
    id: parseInt(id ?? '0'),
  });

  const userId = userInfo?.id ?? '';
  const fileReference = form.fileReferences.length ? form.fileReferences[0] : undefined;
  const path = fileReference?.path;
  const file = !!fileReference
    ? ({
        name: fileReference.fileName,
        size: fileReference.size,
      } as IFile)
    : undefined;

  const updateForm = React.useCallback(
    async (content: IContentModel | undefined) => {
      if (!!content) {
        setForm(toForm(content));
        const res = await findWorkOrders({ contentId: content.id });
        setForm({ ...toForm(content), workOrders: res.data.items });
        // If the form is loaded from the URL instead of clicking on the list view it defaults to the snippet form.
        setContentType(content.contentType);
      }
    },
    [findWorkOrders],
  );

  const fetchContent = React.useCallback(
    async (id: number) => {
      try {
        const content = await getContent(id);
        await updateForm(content);
      } catch (error) {
        const aError = error as AxiosError;
        if (!!aError && !!aError.response?.data) {
          const data = aError.response.data as IResponseErrorModel;
          if (data.type === 'NoContentException') navigate('/contents');
        }
      }
    },
    [getContent, updateForm, navigate],
  );

  const onWorkOrder = React.useCallback(
    (workOrder: IWorkOrderMessageModel) => {
      if (form.id === workOrder.contentId) {
        if (workOrder.workType === WorkOrderTypeName.FFmpeg) {
          setForm({
            ...form,
            workOrders: [workOrder, ...form.workOrders.filter((wo) => wo.id !== workOrder.id)],
          });
        } else if (
          workOrder.workType === WorkOrderTypeName.Transcription ||
          workOrder.workType === WorkOrderTypeName.NaturalLanguageProcess
        ) {
          // TODO: Don't overwrite the user's edits.
          fetchContent(workOrder.contentId);
        }
      }
    },
    [fetchContent, form],
  );

  hub.useHubEffect(MessageTargetName.WorkOrder, onWorkOrder);

  const onContentAction = React.useCallback(
    (action: IContentActionMessageModel) => {
      if (action.contentId === form.id) {
        setForm({
          ...form,
          actions: form.actions.map((a) =>
            a.id === action.actionId ? { ...a, value: action.value, version: action.version } : a,
          ),
        });
      }
    },
    [form],
  );

  hub.useHubEffect(MessageTargetName.ContentActionUpdated, onContentAction);

  const onContentUpdated = React.useCallback(
    async (message: IContentMessageModel) => {
      if (form.id === message.id) {
        if (form.version !== message.version && !isSubmitting) {
          try {
            // TODO: Don't overwrite the user's edits.
            fetchContent(message.id);
          } catch {}
        } else if (message.reason === 'file') {
          getContent(form.id)
            .then((values) => {
              setForm({ ...form, fileReferences: values?.fileReferences ?? [] });
            })
            .catch(() => {});
        }
      }
    },
    [fetchContent, form, getContent, isSubmitting],
  );

  hub.useHubEffect(MessageTargetName.ContentUpdated, onContentUpdated);

  React.useEffect(() => {
    if (!!id && +id > 0) {
      fetchContent(+id);
    }
  }, [id, fetchContent]);

  const resetForm = React.useCallback((values: IContentForm) => {
    // Reset form for next record.
    const parsedDate = moment(values.publishedOn);
    const updatedDate = parsedDate.add(1, 'second');
    setForm({
      ...defaultFormValues(values.contentType),
      sourceId: values.sourceId,
      productId: values.productId,
      otherSource: values.otherSource,
      publishedOn: updatedDate.toLocaleString(),
    });
  }, []);

  const setAvStream = React.useCallback(() => {
    if (!!path) {
      getStream(path)
        .then((result) => {
          setStream(
            !!result
              ? {
                  url: result,
                  type: fileReference?.contentType,
                }
              : undefined,
          );
        })
        .catch(() => {});
    }
  }, [getStream, fileReference?.contentType, path]);

  React.useEffect(() => {
    setAvStream();
  }, [setAvStream]);

  const handleSubmit = React.useCallback(
    async (
      values: IContentForm,
      formikHelpers: FormikHelpers<IContentForm>,
    ): Promise<IContentForm> => {
      setIsSubmitting(true);
      let contentResult: IContentModel | null = null;
      const originalId = values.id;
      let result = form;
      try {
        if (!values.id) {
          // Only new content is initialized.
          values.contentType = contentType;
          values.ownerId = userId;
        }

        const model = toModel(values);
        contentResult = !form.id ? await addContent(model) : await updateContent(model);

        if (!!values.file) {
          // TODO: Make it possible to upload on the initial save instead of a separate request.
          // Upload the file if one has been added.
          const content = await upload(contentResult, values.file);
          setAvStream();
          result = toForm({ ...content, tonePools: values.tonePools });
        } else if (
          !originalId &&
          !!values.fileReferences.length &&
          !values.fileReferences[0].isUploaded
        ) {
          // TODO: Make it possible to upload on the initial save instead of a separate request.
          // A file was attached but hasn't been uploaded to the API.
          const fileReference = values.fileReferences[0];
          const content = await attach(contentResult.id, 0, fileReference.path);
          result = toForm({ ...content, tonePools: values.tonePools });
        } else {
          result = toForm({ ...contentResult, tonePools: values.tonePools });
        }
        setForm({ ...result, workOrders: form.workOrders });

        toast.success(`"${contentResult.headline}" has successfully been saved.`);

        if (!!contentResult?.seriesId) {
          // A dynamically added series has been added, fetch the latests series.
          const newSeries = series.find((s) => s.id === contentResult?.seriesId);
          if (!newSeries) getSeries();
        }

        if (!originalId) {
          navigate(getContentPath(combined, contentResult.id, contentResult?.contentType));
          // resetForm(result);
        }
      } catch {
        // If the upload fails, we still need to update the form from the original update.
        if (!!contentResult) {
          result = toForm(contentResult);
          setForm({ ...result, workOrders: form.workOrders });
          if (!originalId)
            navigate(getContentPath(combined, contentResult.id, contentResult?.contentType));
        }
      } finally {
        setIsSubmitting(false);
      }
      return result;
    },
    [
      addContent,
      attach,
      combined,
      contentType,
      form,
      getSeries,
      navigate,
      series,
      setAvStream,
      updateContent,
      upload,
      userId,
    ],
  );

  const handlePublish = React.useCallback(
    async (
      values: IContentForm,
      formikHelpers: FormikHelpers<IContentForm>,
    ): Promise<IContentForm> => {
      if (
        [
          ContentStatusName.Draft,
          ContentStatusName.Unpublish,
          ContentStatusName.Unpublished,
        ].includes(values.status)
      )
        values.status = ContentStatusName.Publish;

      return await handleSubmit(values, formikHelpers);
    },
    [handleSubmit],
  );

  const handleUnpublish = React.useCallback(
    async (props: FormikProps<IContentForm>) => {
      if (
        props.values.status === ContentStatusName.Publish ||
        props.values.status === ContentStatusName.Published
      ) {
        triggerFormikValidate(props);
        if (props.isValid) {
          props.values.status = ContentStatusName.Unpublish;
          await handleSubmit(props.values, props);
        }
      }
    },
    [handleSubmit],
  );

  const handleSave = React.useCallback(
    async (props: FormikProps<IContentForm>) => {
      triggerFormikValidate(props);
      props.validateForm(props.values);
      if (props.isValid) {
        await handleSubmit(props.values, props);
      }
    },
    [handleSubmit],
  );

  const handleTranscribe = React.useCallback(
    async (values: IContentForm, formikHelpers: FormikHelpers<IContentForm>) => {
      try {
        // TODO: Only save when required.
        // Save before submitting request.
        const content = await handleSubmit(values, formikHelpers);
        const response = await transcribe(toModel(values));
        setForm({ ...content, workOrders: [response.data, ...form.workOrders] });

        if (response.status === 200) toast.success('A transcript has been requested');
        else if (response.status === 208) {
          if (response.data.status === WorkOrderStatusName.Completed)
            toast.warn('Content has already been transcribed');
          else toast.warn(`An active request for transcription already exists`);
        }
      } catch {
        // Ignore this failure it is handled by our global ajax requests.
      }
    },
    [form.workOrders, handleSubmit, transcribe],
  );

  const handleNLP = React.useCallback(
    async (values: IContentForm, formikHelpers: FormikHelpers<IContentForm>) => {
      try {
        // TODO: Only save when required.
        // Save before submitting request.
        const content = await handleSubmit(values, formikHelpers);
        const response = await nlp(toModel(values));
        setForm({ ...content, workOrders: [response.data, ...form.workOrders] });

        if (response.status === 200) toast.success('An NLP has been requested');
        else if (response.status === 208) {
          if (response.data.status === WorkOrderStatusName.Completed)
            toast.warn('Content has already been processed by NLP');
          else toast.warn(`An active request for NLP already exists`);
        }
      } catch {
        // Ignore this failure it is handled by our global ajax requests.
      }
    },
    [form.workOrders, handleSubmit, nlp],
  );

  const handleFFmpeg = React.useCallback(
    async (values: IContentForm, formikHelpers: FormikHelpers<IContentForm>) => {
      try {
        // Save before submitting request.
        const response = await ffmpeg(toModel(values));
        setForm({ ...values, workOrders: [response.data, ...form.workOrders] });

        if (response.status === 200) toast.success('A FFmpeg process has been requested');
        else if (response.status === 208) {
          if (response.data.status === WorkOrderStatusName.Completed)
            toast.warn('Content has already been processed by FFmpeg');
          else toast.warn(`An active request for FFmpeg already exists`);
        }
      } catch {
        // Ignore this failure it is handled by our global ajax requests.
      }
    },
    [form.workOrders, ffmpeg],
  );

  const goToNext = React.useCallback(
    (form: IContentForm) => {
      navigate(getContentPath(combined, 0, form.contentType));
      resetForm(form);
    },
    [combined, navigate, resetForm],
  );

  return {
    userInfo,
    form,
    setForm,
    isSubmitting,
    setIsSubmitting,
    fetchContent,
    deleteContent,
    handleSubmit,
    handleSave,
    handlePublish,
    handleUnpublish,
    handleTranscribe,
    handleNLP,
    handleFFmpeg,
    goToNext,
    file,
    fileReference,
    stream,
    download,
    setStream,
  };
};
