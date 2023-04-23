import React from "react";
import { useRouter } from "next/router";

// redux
import { useSelector, useDispatch } from "react-redux";

const StocksBusinessOverview = () => {
  const theme = useSelector((state) => state.Common.theme);

  return (
    <div className="businessOverview">
      <div className="section ">
        <div className="header">
          <span>BUSINESS OVERVIEW</span>
        </div>
        <div className="body">
          <div className="businessOverview-details">
            <div className="businessOverview-details_row">
              <div className="businessOverview-details_row-col">
                <p>Sector</p>
              </div>
              <div className="businessOverview-details_row-col">
                <p>Sector</p>
              </div>
            </div>
            <div className="businessOverview-details_row">
              <div className="businessOverview-details_row-col">
                <p>Mkt Cap</p>
              </div>
              <div className="businessOverview-details_row-col">
                <p>Mkt Cap</p>
              </div>
            </div>
            <div className="businessOverview-details_row">
              <div className="businessOverview-details_row-col">
                <p>Stock P/E,</p>
              </div>
              <div className="businessOverview-details_row-col">
                <p>Stock P/E,</p>
              </div>
            </div>
            <div className="businessOverview-details_row">
              <div className="businessOverview-details_row-col">
                <p>Face Value,</p>
              </div>
              <div className="businessOverview-details_row-col">
                <p>Face Value,</p>
              </div>
            </div>
            <div className="businessOverview-details_row">
              <div className="businessOverview-details_row-col">
                <p>Dividend yield</p>
              </div>
              <div className="businessOverview-details_row-col">
                <p>Dividend yield</p>
              </div>
            </div>
            <div className="businessOverview-details_row">
              <div className="businessOverview-details_row-col">
                <p>PBV</p>
              </div>
              <div className="businessOverview-details_row-col">
                <p>PBV</p>
              </div>
            </div>
            <div className="businessOverview-details_row">
              <div className="businessOverview-details_row-col">
                <p>ROE</p>
              </div>
              <div className="businessOverview-details_row-col">
                <p>ROE</p>
              </div>
            </div>
            <div className="businessOverview-details_row">
              <div className="businessOverview-details_row-col">
                <p>ROCE</p>
              </div>
              <div className="businessOverview-details_row-col">
                <p>ROCE</p>
              </div>
            </div>
            <div className="businessOverview-details_row">
              <div className="businessOverview-details_row-col">
                <p>Debt-Equity Ratio</p>
              </div>
              <div className="businessOverview-details_row-col">
                <p>Debt-Equity Ratio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StocksBusinessOverview;
