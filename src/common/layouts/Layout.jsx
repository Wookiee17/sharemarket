import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";


// components
import Header from "./header/Header";
import Footer from "./footer/Footer";
import TopTabs from "../component/topTabs/TopTabs";

// redux
import { useSelector } from "react-redux";

const Layout = ({ children }) => {
  // Redux
  const theme = useSelector((state) => state.Common.theme);

  return (
    <>
      <Head>
        <title>IC Trading</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`Layout ${theme}`}>
        <Header />
        <div className="main_body">
          <TopTabs />
          {children}
        </div>
        <Footer />

        
      </div>
    </>
  );
};

Layout.propTypes = {
  theme: PropTypes.string,
  children: PropTypes.node,
};

export default Layout;
