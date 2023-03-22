import { ContentNavigation } from 'features/content/form';
import { IContentForm } from 'features/content/form/interfaces';
import { getStatusText } from 'features/content/list-view/utils';
import { Col, Row, ToolBarSection } from 'tno-core';

export interface IStatusSectionProps {
  /** Form values. */
  values: IContentForm;
  /** Function to fetch content. */
  fetchContent: (id: number) => void;
}

/**
 * A component that displays the content status.
 * @param param0 Component properties.
 * @returns Component.
 */
export const StatusSection: React.FC<IStatusSectionProps> = ({ values, fetchContent }) => {
  return (
    <Col>
      <ToolBarSection>
        <Col>
          <ContentNavigation values={values} fetchContent={fetchContent} />
          <Row className="title-container">Content Details</Row>
          <Row justifyContent="center" className="white-bg">
            {getStatusText(values.status)}
          </Row>
        </Col>
      </ToolBarSection>
    </Col>
  );
};
