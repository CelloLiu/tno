import { IOptionItem, OptionItem } from 'components/form';
import { FormikSelect } from 'components/formik';
import { useFormikContext } from 'formik';
import { IDataSourceModel } from 'hooks/api-editor';
import React from 'react';
import { ActionMeta } from 'react-select';
import ReactTooltip from 'react-tooltip';
import { useLookup } from 'store/hooks';
import { Col, Row, Section, Show } from 'tno-core';
import { getDataSourceOptions, getSortableOptions } from 'utils';

import { Connection } from '../connections';
import * as styled from './styled';

interface IServiceIngestSettingsProps {}

/**
 * A UI component form to manage data source ingest settings.
 * @returns Component.
 */
export const ServiceIngestSettings: React.FC<IServiceIngestSettingsProps> = () => {
  const { values, setFieldValue } = useFormikContext<IDataSourceModel>();
  const [lookups] = useLookup();

  const users = [
    new OptionItem('None', 0),
    ...lookups.users.map((u) => new OptionItem(u.username, u.id)),
  ];
  const contentTypes = getSortableOptions(lookups.contentTypes);
  const dataLocations = getSortableOptions(lookups.dataLocations);
  const dataSources = getDataSourceOptions(
    lookups.dataSources.filter((ds) => ds.parentId === undefined),
    [new OptionItem('No Parent', 0)],
  );

  React.useEffect(() => {
    // Ensures the connection settings can display the correct form on initial load.
    const owner = lookups.users.find((mt) => mt.id === values.ownerId);
    setFieldValue('owner', owner);
  }, [lookups.users, setFieldValue, values.ownerId, values.owner]);

  React.useEffect(() => {
    ReactTooltip.rebuild();
  });

  const handleOwnerChange = (newValue: unknown, actionMeta: ActionMeta<unknown>) => {
    // Change so that the connection settings can display the correct form.
    const option = newValue as IOptionItem;
    const owner = lookups.users.find((mt) => mt.id === option.value);
    setFieldValue('owner', owner);
  };

  const handleContentTypeChange = (newValue: unknown, actionMeta: ActionMeta<unknown>) => {
    // Change so that the connection settings can display the correct form.
    const option = newValue as IOptionItem;
    const contentType = lookups.contentTypes.find((mt) => mt.id === option.value);
    setFieldValue('contentType', contentType);
  };

  return (
    <styled.ServiceIngestSettings className="schedule">
      <h2>{values.name}</h2>
      <p>
        Data source connection settings provide the configuration that enables the service to ingest
        content.
      </p>
      <Row colGap="1em" nowrap>
        <Col flex="1 1">
          <h3>Source Settings</h3>
          <Connection />
        </Col>
        <Col flex="1 1">
          <h3>Destination Settings</h3>
          <Section>
            <Show visible={values.connection.serviceType === 'clip'}>
              <FormikSelect
                label="Capture Source"
                name="parentId"
                tooltip="Source of capture files for this clip service"
                options={dataSources}
                placeholder={values.connection.serviceType === 'clip' ? 'required' : 'optional'}
                required={values.connection.serviceType === 'clip'}
              />
            </Show>
            <FormikSelect
              label="Data Location"
              name="dataLocationId"
              tooltip="The physical location that files are stored after ingesting"
              options={dataLocations}
              required
            />
            <FormikSelect
              label="Generated Content Type"
              name="contentTypeId"
              tooltip="The type of content that is created when imported"
              options={contentTypes}
              onChange={handleContentTypeChange}
              required
            />
            <Show visible={values.contentTypeId > 1}>
              <FormikSelect
                label="Owner"
                name="ownerId"
                tooltip="The default user who will own imported content"
                options={users}
                onChange={handleOwnerChange}
              />
            </Show>
          </Section>
        </Col>
      </Row>
    </styled.ServiceIngestSettings>
  );
};
