import React, { useMemo } from "react";

export default (props) => {
  const data = useMemo(
    () => props.api.getDisplayedRowAtIndex(props.rowIndex).data,
    []
  );
  return (
    <div className="ag-tooltip" style={{ backgroundColor: props.color }}>
      <p>
        <span>{data.ticker}</span>
      </p>
      {/* <p>
        <span>{data.current_price}</span>
      </p> */}
      <p>
        <span>{data.change_percentage}</span>
      </p>
      {/* <p>
        <span>{data.total_trade_quantity}</span>
      </p> */}
    </div>
  );
};
