import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from 'store/hooks/admin';
import { Col, FlexboxTable, FormPage, IconButton, IReportModel, Row } from 'tno-core';

import { reportColumns } from './constants';
import { ReportFilter } from './ReportFilter';
import * as styled from './styled';

export const ReportList: React.FC = () => {
  const navigate = useNavigate();
  const [{ reports }, api] = useReports();

  const [items, setItems] = React.useState<IReportModel[]>([]);

  React.useEffect(() => {
    if (!reports.length) {
      api.findAllReports().then((data) => {
        setItems(data);
      });
    } else {
      setItems(reports);
    }
  }, [api, reports]);

  return (
    <styled.ReportList>
      <FormPage>
        <Row className="add-media" justifyContent="flex-end">
          <Col flex="1 1 0">
            Reports provide a way to generate output (i.e. email) based on a filter or manually
            selecting content to be included.
          </Col>
          <IconButton
            iconType="plus"
            label={`Add new report`}
            onClick={() => navigate(`/admin/reports/0`)}
          />
        </Row>
        <ReportFilter
          onFilterChange={(filter) => {
            if (filter && filter.length) {
              const value = filter.toLocaleLowerCase();
              setItems(
                reports.filter(
                  (i) =>
                    i.name.toLocaleLowerCase().includes(value) ||
                    i.description.toLocaleLowerCase().includes(value) ||
                    i.owner?.username.toLocaleLowerCase().includes(value) ||
                    i.owner?.displayName.toLocaleLowerCase().includes(value) ||
                    i.owner?.firstName.toLocaleLowerCase().includes(value) ||
                    i.owner?.lastName.toLocaleLowerCase().includes(value),
                ),
              );
            } else {
              setItems(reports);
            }
          }}
        />
        <FlexboxTable
          rowId="id"
          data={items}
          columns={reportColumns}
          showSort={true}
          onRowClick={(row) => navigate(`${row.original.id}`)}
          pagingEnabled={false}
        />
      </FormPage>
    </styled.ReportList>
  );
};
