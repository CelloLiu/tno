import { ReactKeycloakProvider } from '@react-keycloak/web';
import { Layout } from 'components/layout';
import { UserInfo } from 'features/login';
import { NavBar } from 'features/navbar';
import { AppRouter } from 'features/router';
import { KeycloakInstance } from 'keycloak-js';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import {
  createKeycloakInstance,
  LayoutAnonymous,
  Loading,
  useKeycloakEventHandler,
} from 'tno-core';

function App() {
  const [keycloak, setKeycloak] = React.useState<KeycloakInstance>();
  const keycloakEventHandler = useKeycloakEventHandler();
  const name = 'TNO News Service';

  React.useEffect(() => {
    createKeycloakInstance().then((result) => {
      setKeycloak(result);
    });
  }, []);

  return keycloak ? (
    <ReactKeycloakProvider
      authClient={keycloak}
      LoadingComponent={
        <LayoutAnonymous name={name}>
          <Loading />
        </LayoutAnonymous>
      }
      onEvent={keycloakEventHandler(keycloak)}
    >
      <BrowserRouter>
        <UserInfo />
        <Layout name={name}>{{ menu: <NavBar />, router: <AppRouter /> }}</Layout>

        <ReactTooltip id="main-tooltip" effect="float" type="light" place="top" />
        <ReactTooltip id="main-tooltip-right" effect="solid" type="light" place="right" />
      </BrowserRouter>
    </ReactKeycloakProvider>
  ) : (
    <LayoutAnonymous name={name}>
      <Loading />
    </LayoutAnonymous>
  );
}

export default App;
