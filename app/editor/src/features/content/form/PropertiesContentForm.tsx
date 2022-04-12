import { FieldSize, IOptionItem, OptionItem, RadioGroup } from 'components/form';
import { FormikRadioGroup, FormikSelect, FormikText, FormikTextArea } from 'components/formik';
import { FormikDatePicker } from 'components/formik/datepicker';
import { Modal } from 'components/modal/Modal';
import { Upload } from 'components/upload';
import { useFormikContext } from 'formik';
import { IUserModel } from 'hooks/api-editor';
import { useModal } from 'hooks/modal';
import moment from 'moment';
import React from 'react';
import { useLookup } from 'store/hooks';
import { Button, ButtonVariant, useKeycloakWrapper } from 'tno-core';
import { Col } from 'tno-core/dist/components/flex/col';
import { Row } from 'tno-core/dist/components/flex/row';
import { getSortableOptions } from 'utils';

import { toningOptions } from './constants';
import { IContentForm } from './interfaces';
import { TimeLogTable } from './TimeLogTable';
import { getTotalTime } from './utils';

const tagMatch = /(?<=\[).+?(?=\])/g;
export interface IContentSubForms {
  setContent: (content: IContentForm) => void;
  content: IContentForm;
}

/** The sub form of the ContentForm when the Properties Tab is selected. */
export const PropertiesContentForm: React.FC<IContentSubForms> = ({ setContent, content }) => {
  const keycloak = useKeycloakWrapper();
  const [{ series, categories, licenses, tags, users }] = useLookup();
  const { values, setFieldValue, handleChange } = useFormikContext<IContentForm>();
  const { isShowing, toggle } = useModal();

  const [categoryOptions, setCategoryOptions] = React.useState<IOptionItem[]>([]);
  const [seriesOptions, setSeriesOptions] = React.useState<IOptionItem[]>([]);
  const [licenseOptions, setLicenseOptions] = React.useState<IOptionItem[]>([]);
  const [effort, setEffort] = React.useState(getTotalTime(values.timeTrackings));

  const userId = users.find((u: IUserModel) => u.username === keycloak.getUsername())?.id;
  let timeLog = values.timeTrackings;

  React.useEffect(() => {
    setCategoryOptions(getSortableOptions(categories));
  }, [categories]);

  React.useEffect(() => {
    setSeriesOptions(series.map((m: any) => new OptionItem(m.name, m.id)));
  }, [series]);

  React.useEffect(() => {
    setLicenseOptions(licenses.map((m: any) => new OptionItem(m.name, m.id)));
  }, [licenses]);

  const extractTags = (values: string[]) => {
    return tags
      .filter((tag) => values.some((value: string) => value.toLowerCase() === tag.id.toLowerCase()))
      .map((tag) => ({ ...tag }));
  };

  return (
    <Col style={{ margin: '3%' }}>
      <Row>
        <Col>
          <Row>
            <FormikSelect
              name="seriesId"
              label="Series"
              width={FieldSize.Medium}
              value={seriesOptions.find((s: any) => s.value === values.seriesId) ?? ''}
              options={seriesOptions}
              isDisabled={!!values.otherSeries}
              onChange={(e) => {
                handleChange(e);
                setFieldValue('otherSeries', '');
              }}
            />
            <FormikText
              name="otherSeries"
              label="Other Series"
              width={FieldSize.Medium}
              onChange={(e) => {
                const value = e.currentTarget.value;
                setFieldValue('otherSeries', value);
                if (!!value) setFieldValue('seriesId', undefined);
              }}
              onBlur={() => {
                const found = series.find(
                  (s) => s.name.toLocaleLowerCase() === values.otherSeries.toLocaleLowerCase(),
                );
                if (found) {
                  setFieldValue('seriesId', found.id);
                  setFieldValue('otherSeries', '');
                }
              }}
            />
          </Row>
          <Row alignContent="flex-start" alignItems="flex-start">
            <FormikSelect
              name="categories"
              label="Event of Day Category"
              width={FieldSize.Medium}
              options={categoryOptions}
              clearValue={[]}
              value={
                values.categories.length
                  ? categoryOptions.find((c) => c.value === values.categories[0].id) ?? []
                  : []
              }
              onChange={(e: any) => {
                // only supports one at a time right now
                const value = categories.find((c) => c.id === e.value);
                setFieldValue('categories', !!value ? [value] : []);
              }}
            />
            <FormikText
              name="categories[0].score"
              label="Score"
              type="number"
              width={FieldSize.Stretch}
              disabled={!values.categories.length}
            />
          </Row>
          <Row>
            <FormikDatePicker
              name="publishedOn"
              label="Published On"
              required
              showTimeSelect
              dateFormat="MMMM d, yyyy hh:mm aa"
              width={FieldSize.Medium}
              selectedDate={
                !!values.publishedOn ? moment(values.publishedOn).toString() : undefined
              }
              value={values.publishedOn}
              onChange={(date: any) => {
                setFieldValue('publishedOn', date);
              }}
            />
            <Col grow={1}>
              <FormikText name="page" label="Page" onChange={handleChange} />
            </Col>
          </Row>
        </Col>
        <Row style={{ marginLeft: '10%', marginTop: '1%' }}>
          <Col>
            <RadioGroup
              spaceUnderRadio
              name="expireOptions"
              options={licenseOptions}
              value={licenseOptions.find((e) => e.value === values?.licenseId)}
              onChange={(e) => setFieldValue('licenseId', Number(e.target.value))}
            />
          </Col>
        </Row>
      </Row>
      <Row>
        <FormikTextArea
          name="summary"
          label="Summary"
          required
          value={values.summary}
          onChange={handleChange}
          style={{ width: '1000px', height: '400px' }}
          onBlur={(e) => {
            const value = e.currentTarget.value;
            if (!!value) {
              const values = value.match(tagMatch)?.toString()?.split(', ') ?? [];
              const tags = extractTags(values);
              setFieldValue('tags', tags);
            }
          }}
        />
      </Row>
      <Row>
        <FormikText
          disabled
          name="tags"
          label="Tags"
          value={values.tags.map((t) => t.id).join(', ')}
        />
        <Button
          variant={ButtonVariant.danger}
          style={{ marginTop: '1.16em' }}
          onClick={() => {
            const regex = /\[.*\]/; // TODO: This is far too eager and could remove value content.
            setFieldValue('summary', values.summary.replace(regex, ''));
            setFieldValue('tags', []);
          }}
        >
          Clear Tags
        </Button>
      </Row>
      <Row style={{ marginTop: '2%' }}>
        <FormikRadioGroup
          label="Toning"
          direction="row"
          name="tonePool"
          required
          options={toningOptions}
          onChange={(e, value) => {
            setFieldValue('tonePool', value);
            setFieldValue('tone', value?.value);
          }}
        />
      </Row>
      <Row style={{ marginTop: '2%' }}>
        <Upload />
      </Row>
      <Row style={{ marginTop: '2%' }}>
        <FormikText className="sm" name="prep" label="Prep Time (minutes)" type="number" />
        <Button
          style={{ marginTop: '1.16em', marginRight: '2%' }}
          variant={ButtonVariant.action}
          onClick={() => {
            setEffort(effort!! + Number((values as any).prep));
            timeLog.push({
              userId: userId ?? 0,
              activity: !!values.id ? 'Updated' : 'Created',
              effort: (values as any).prep,
              createdOn: new Date(),
            });
            setFieldValue('timeTrackings', timeLog);
            setFieldValue('prep', '');
          }}
        >
          Add
        </Button>
        <FormikText disabled className="sm" name="total" label="Total" value={effort?.toString()} />
        <Button
          onClick={() => {
            setContent({ ...content, timeTrackings: values.timeTrackings });
            toggle();
          }}
          style={{ marginTop: '1.16em' }}
          variant={ButtonVariant.action}
        >
          View Log
        </Button>
        <Modal
          hide={toggle}
          isShowing={isShowing}
          headerText="Prep Time Log"
          body={<TimeLogTable totalTime={effort} data={timeLog} />}
          customButtons={
            <Button variant={ButtonVariant.action} onClick={toggle}>
              Close
            </Button>
          }
        />
      </Row>
    </Col>
  );
};
