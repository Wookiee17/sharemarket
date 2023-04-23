import React, { useMemo } from "react";

const Tooltip = (props) => {
  const data = useMemo(
    () => props.api.getDisplayedRowAtIndex(props.rowIndex).data,
    []
  );

  return (
    <div className="ag-tooltip" style={{ backgroundColor: props.color }}>
      <p>{data.name}</p>
      <p> {data.change_percentage?.toFixed(2)}%</p>
    </div>
  );
};

export default Tooltip;
