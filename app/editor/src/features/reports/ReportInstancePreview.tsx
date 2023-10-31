import React from 'react';
import { useParams } from 'react-router-dom';
import { useReportInstances } from 'store/hooks';
import { Col, IReportResultModel, Loading, Show } from 'tno-core';

import * as styled from './styled';

const ReportInstancePreview: React.FC = () => {
  const [{ viewReportInstance }] = useReportInstances();
  const { id } = useParams();
  const reportId = parseInt(id ?? '');

  const [isLoading, setIsLoading] = React.useState(true);
  const [view, setView] = React.useState<IReportResultModel | undefined>();

  const handlePreviewReport = React.useCallback(
    async (reportId: number) => {
      try {
        setIsLoading(true);
        const response = await viewReportInstance(reportId);
        setView(response);
      } catch {
      } finally {
        setIsLoading(false);
      }
    },
    [viewReportInstance],
  );

  React.useEffect(() => {
    handlePreviewReport(reportId);
  }, [handlePreviewReport, reportId]);

  return (
    <styled.ReportPreview>
      <Show visible={isLoading}>
        <Loading />
      </Show>
      <Show visible={!isLoading}>
        <Col className="preview-report">
          <div
            className="preview-subject"
            dangerouslySetInnerHTML={{ __html: view?.subject ?? '' }}
          ></div>
          <div
            className="preview-body"
            dangerouslySetInnerHTML={{ __html: view?.body ?? '' }}
          ></div>
        </Col>
      </Show>
    </styled.ReportPreview>
  );
};

export default ReportInstancePreview;
