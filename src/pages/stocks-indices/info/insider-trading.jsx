import React, { useEffect } from "react";
import Head from "next/head";

// layout
import Layout from "../../../common/layouts/Layout";

// redux
import { useDispatch } from "react-redux";
import {
  setActiveTab,
  setActiveInfoTab,
} from "../../../store/stockIndices/StockIndicesSlice";

// container
import StocksIndicesLayout from "../../../containers/stocksindices/StocksIndicesLayout";

// component
import TopTab from "../../../common/component/stocksindices/top-tab/TopTab";
import InsiderTrading from "../../../common/component/stocksindices/tabs/tab1/insidertrading/InsiderTrading";

const InsiderTradingPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setActiveTab(0));
    dispatch(setActiveInfoTab(3));
  }, []);

  return (
    <Layout>
      <StocksIndicesLayout>
        <Head>
          <title>Stock Indices | IC Trading</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="tab1">
          <div className="left">
            <TopTab />
            <div className="container">
              <InsiderTrading />
            </div>
          </div>
        </div>
      </StocksIndicesLayout>
    </Layout>
  );
};

export default InsiderTradingPage;
