import React, { useState } from "react";

// components
import StocksIndicesSidebar from "../../common/component/stocksindices/stocksindicesSidebar/StocksIndicesSidebar";

// redux
import { useSelector, useDispatch } from "react-redux";

const StocksIndicesLayout = ({ children }) => {
  const theme = useSelector((state) => state.Common.theme);

  return (
    <div className={`stocksindices_layout ${theme}`}>
      <StocksIndicesSidebar />
      <div className="indices_stocks_body">{children}</div>
    </div>
  );
};

export default StocksIndicesLayout;
