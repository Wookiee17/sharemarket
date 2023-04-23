import React, { useRef } from "react";
import Head from "next/head";

// layout
import Layout from "../../common/layouts/Layout";

// redux
import { useSelector } from "react-redux";

// containers
import GridLayout from "../../common/component/dashboard/gridLayout/GridLayout";
import { initializeApollo } from "../../gql/apolloClient";
import {
  GET_INDICES,
  GET_INDICES_FOR_AD,
  GET_OVERVIEW_QUERIES,
  GET_STOCK_PRICES,
} from "../../gql/queries";
import { ADV_DECLINE_SECTIONS, OVERVIEW_DATE } from "../../common/constants";

const Dashboard = () => {
  const theme = useSelector((state) => state.Common.theme);
  const ref = useRef();
  return (
    <Layout>
      <div className={`tabs-body ${theme}`} ref={ref}>
        <Head>
          <title>Dashboard | IC Trading</title>
        </Head>
        <GridLayout parent={ref} />
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();
  const [_, indicesRes] = await Promise.all([
    await apolloClient.query({
      query: GET_OVERVIEW_QUERIES,
    }),
    await apolloClient.query({
      query: GET_INDICES,
    }),
    await apolloClient.query({
      query: GET_INDICES_FOR_AD,
      variables: {
        where: {
          ic_active: { _eq: true }
        }
      },
    }),
  ]);

  await apolloClient.query({
    query: GET_STOCK_PRICES,
    variables: {
      limit: 50,
      offset: 0,
      where: {
        _and: [
          {
            stock: { indices_id: { _eq: indicesRes?.data?.indices?.[0]?.id } },
          },
          { change_percentage: { _gt: 0 } },
          OVERVIEW_DATE,
        ],
      },
      order_by: [{ ticker: "asc" }],
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    revalidate: 1,
  };
}

export default Dashboard;
