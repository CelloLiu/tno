import { useFormikContext } from 'formik';
import { Col, FormikText, IConnectionModel, Row } from 'tno-core';

export const SSHConfiguration = () => {
  const { values } = useFormikContext<IConnectionModel>();

  return (
    <div>
      <Row>
        <Col flex="1 1 0">
          <FormikText
            label="Hostname"
            name="configuration.hostname"
            value={values.configuration?.hostname}
          />
        </Col>
        <Col flex="1 1 0">
          <FormikText
            label="Port"
            name="configuration.port"
            value={values.configuration?.port}
            type="number"
            placeholder="22"
          />
        </Col>
        <Col flex="1 1 0">
          <FormikText label="Path" name="configuration.path" value={values.configuration?.path} />
        </Col>
      </Row>
      <Row>
        <Col flex="1 1 0">
          <FormikText
            label="Username"
            name="configuration.username"
            value={values.configuration?.username}
            autoComplete="off"
          />
        </Col>
        <Col flex="1 1 0">
          <FormikText
            label="Password"
            name="configuration.password"
            value={values.configuration?.password}
            type="password"
            autoComplete="new-password"
          />
        </Col>
        <Col flex="1 1 0">
          <FormikText
            label="Key File Name"
            name="configuration.keyFileName"
            value={values.configuration?.keyFileName}
          />
        </Col>
      </Row>
    </div>
  );
};
