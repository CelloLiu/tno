import { Wysiwyg } from 'components/wysiwyg';
import React from 'react';
import { Button, ButtonVariant, Modal, useCustomHeight } from 'tno-core';

import * as styled from './styled';

/**
 * The component to be displayed when the transcript tab is selected from the content form.
 * @returns the ContentTranscriptForm
 */
export const ContentTranscriptForm: React.FC = () => {
  const [showExpandModal, setShowExpandModal] = React.useState(false);
  const onCloseOrHide = () => setShowExpandModal(!showExpandModal);
  const { customHeight } = useCustomHeight();
  return (
    <styled.ContentTranscriptForm>
      <Wysiwyg fieldName="body" expandModal={setShowExpandModal} />
      <Modal
        body={<Wysiwyg className="modal-quill" fieldName="body" customHeight={customHeight} />}
        isShowing={showExpandModal}
        hide={onCloseOrHide}
        className="modal-full"
        customButtons={
          <Button variant={ButtonVariant.secondary} onClick={onCloseOrHide}>
            Close
          </Button>
        }
      />
    </styled.ContentTranscriptForm>
  );
};
