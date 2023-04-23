import React from "react";
import Head from "next/head";

// layout
import Layout from "../../common/layouts/Layout";

// redux
import { useSelector } from "react-redux";

// containers
import DiffusionIndicatorsLayout from "../../containers/diffusionIndicators/diffusionIndicatorsLayout/DiffusionIndicatorsLayout";

const DiffusionIndicators = () => {
  const theme = useSelector((state) => state.Common.theme);

  return (
    <Layout>
      <div className={`tabs-body ${theme}`}>
        <Head>
          <title>Diffusion Indicators | IC Trading</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <DiffusionIndicatorsLayout />
      </div>
    </Layout>
  );
};

export default DiffusionIndicators;