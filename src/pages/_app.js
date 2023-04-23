import React from "react";
// import { LicenseManager } from "ag-grid-enterprise";

// styles
import "antd/dist/antd.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine-no-font.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "highcharts/css/highcharts.scss";
// import "highcharts/css/themes/dark-unica.scss";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "react-virtualized/styles.css";
import "../common/assets/styles/main.scss";

// Apollo
// import client from "../gql/client";
import { ApolloProvider } from "@apollo/client";

// redux
import { Provider } from "react-redux";
import { wrapper } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { useApollo } from "../gql/apolloClient";
import { NhostProvider } from "@nhost/react";
import { nhost } from "../utils/nhost";
import { Shield } from "./shield";

// LicenseManager.setLicenseKey(
//   "CompanyName=Indiacharts share tradng Pvt ltd,LicensedApplication=Indiacharts,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-036128,SupportServicesEnd=22_December_2023_[v2]_MTcwMzIwMzIwMDAwMA==70a016c0a890b6f916cabfa97b209e4b"
// );

const App = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const client = useApollo(rest?.pageProps?.initialApolloState);
  const persistor = persistStore(store);

  return (
    <NhostProvider nhost={nhost} initial={props.nhostSession}>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Shield>
              <div className={`App`}>
                <Component {...props.pageProps} />
              </div>
            </Shield>
          </PersistGate>
        </Provider>
      </ApolloProvider>
    </NhostProvider>
  );
};

export default App;
