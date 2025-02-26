import { IContentReferenceModel, IPaged, useApiAdminContentReferences } from 'hooks/api-editor';
import { IContentReferenceFilter } from 'hooks/api-editor/interfaces/IContentReferenceFilter';
import React from 'react';
import { useAjaxWrapper } from 'store/hooks';
import { IAdminState, useAdminStore } from 'store/slices';

interface IContentReferenceController {
  /**
   * Make an AJAX GET request to filter a page of content references.
   */
  findContentReferences: (
    filter: IContentReferenceFilter,
  ) => Promise<IPaged<IContentReferenceModel>>;
  /**
   * Make an AJAX GET request to find the content reference for the specified keys.
   */
  getContentReference: (source: string, uid: string) => Promise<IContentReferenceModel>;
  /**
   * Make an AJAX PUT request to update the content reference.
   */
  updateContentReference: (model: IContentReferenceModel) => Promise<IContentReferenceModel>;
  /**
   * Make an AJAX DELETE request to delete the content reference.
   */
  deleteContentReference: (model: IContentReferenceModel) => Promise<IContentReferenceModel>;
}

/**
 * Content Reference hook to communicate with the api.
 * @returns Array with admin state and a content reference controller.
 */
export const useContentReferences = (): [IAdminState, IContentReferenceController] => {
  const api = useApiAdminContentReferences();
  const dispatch = useAjaxWrapper();
  const [state] = useAdminStore();

  const controller = React.useMemo(
    () => ({
      findContentReferences: async (filter: IContentReferenceFilter) => {
        const response = await dispatch<IPaged<IContentReferenceModel>>(
          'find-content-references',
          () => api.findContentReferences(filter),
        );
        return response.data;
      },
      getContentReference: async (source: string, uid: string) => {
        const response = await dispatch<IContentReferenceModel>('get-content-reference', () =>
          api.getContentReference(source, uid),
        );
        return response.data;
      },
      updateContentReference: async (model: IContentReferenceModel) => {
        const response = await dispatch<IContentReferenceModel>('update-data-source', () =>
          api.updateContentReference(model),
        );
        return response.data;
      },
      deleteContentReference: async (model: IContentReferenceModel) => {
        const response = await dispatch<IContentReferenceModel>('delete-data-source', () =>
          api.deleteContentReference(model),
        );
        return response.data;
      },
    }),
    [api, dispatch],
  );

  return [state, controller];
};
