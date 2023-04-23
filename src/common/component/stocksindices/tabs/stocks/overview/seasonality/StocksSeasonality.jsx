import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useScreenshot, createFileName } from "use-react-screenshot";
import { AgGridReact, AgGridColumn } from "ag-grid-react";

// redux
import { useSelector, useDispatch } from "react-redux";

// component
import TabSection from "../../../../../tabSections/TabSections";
import Button from "../../../../../button/Button";

const StocksSeasonality = () => {
  const theme = useSelector((state) => state.Common.theme);

  // screenshot
  const [image, takeScreenShot] = useScreenshot({
    type: "image/png",
    quality: 1.0,
  });
  const download = (
    image,
    { name = "future activity", extension = "png" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };
  const _downloadScreenshot = () => takeScreenShot(ref.current).then(download);

  // maximize screen
  const _maximize = () => {};

  const _minimize = () => {};

  //
  const [tableData, setTableData] = useState([]);

  const tableHeader = [
    {
      headerName: "Period (Yr)",
      field: "years",
    },
    {
      headerName: "JAN",
      field: "jan",
    },
    {
      headerName: "FEB",
      field: "feb",
    },
    {
      headerName: "MAR",
      field: "mar",
    },
    {
      headerName: "APR",
      field: "apr",
    },
    {
      headerName: "MAY",
      field: "may",
    },
    {
      headerName: "JUN",
      field: "jun",
    },
    {
      headerName: "JUL",
      field: "jul",
    },
    {
      headerName: "AUG",
      field: "aug",
    },
    {
      headerName: "SEP",
      field: "sep",
    },
    {
      headerName: "OCT",
      field: "oct",
    },
    {
      headerName: "NOV",
      field: "nov",
    },
    {
      headerName: "DEC",
      field: "dec",
    },
    {
      headerName: "Yearly Returns",
      field: "yearly-returns",
    },
  ];

  const defaultColDef = useMemo(() => {
    return {
      sortable: false,
      resizable: false,
      filter: false,
      sortIcon: false,
      unSortIcon: false,
      suppressMenu: true,
    };
  }, []);

  return (
    <div className="seasonality">
      <TabSection
        headerLable={`seasonality`}
        maximizeFun={_maximize}
        minimizeFun={_minimize}
        isMaximized={false}
        downloadFun={_downloadScreenshot}
      >
        <div className="seasonality-body">
          <div className="seasonality-body_top">
            <p>Data in percentages</p>
            <div className="btns">
              <Button type={"primary"} size={"md"}>
                CHART
              </Button>
              <Button type={"primary"} size={"md"}>
                VIEW MORE
              </Button>
            </div>
          </div>
          {/* <div
                      className={`seasonality_table ${
                        theme == "dark"
                          ? "ag-theme-alpine-dark"
                          : "ag-theme-alpine"
                      }`}
                    >
                      <AgGridReact
                        ref={gridRef}
                        columnDefs={tableHeader}
                        rowData={[1,2,3,4,5,6,7,8,9]}
                        defaultColDef={defaultColDef}
                        onRowDataUpdated={(e) => {
                          e.api.forEachNode((row, imdex) => {
                            if (row.rowIndex === 0) row.setSelected(true);
                          });
                        }}
                        onGridReady={(e) => {
                          gridRef.current.api.sizeColumnsToFit();
                          e.api.forEachNode((row, imdex) => {
                            if (row.rowIndex === 0) row.setSelected(true);
                          });
                        }}
                        rowSelection="single"
                        suppressCellFocus
                      ></AgGridReact>
                    </div> */}
          <div className="seasonality-chart">
            <div className="seasonality-chart_header">
              <div className="seasonality-chart_header-left">
                <p>Period (Yr)</p>
              </div>
              <div className="seasonality-chart_header-right">
                <div className="seasonality-chart_header-right_item">jan</div>
                <div className="seasonality-chart_header-right_item">feb</div>
                <div className="seasonality-chart_header-right_item">mar</div>
                <div className="seasonality-chart_header-right_item">apr</div>
                <div className="seasonality-chart_header-right_item">may</div>
                <div className="seasonality-chart_header-right_item">jun</div>
                <div className="seasonality-chart_header-right_item">jul</div>
                <div className="seasonality-chart_header-right_item">aug</div>
                <div className="seasonality-chart_header-right_item">sep</div>
                <div className="seasonality-chart_header-right_item">oct</div>
                <div className="seasonality-chart_header-right_item">nov</div>
                <div className="seasonality-chart_header-right_item">dec</div>
                <div className="seasonality-chart_header-right_item">
                  Yearly Returns
                </div>
              </div>
            </div>
            <div className="seasonality-chart_body">
              {[
                "Weighted Avg",
                2022,
                2021,
                2020,
                2019,
                2018,
                2017,
                2016,
                2015,
                2014,
              ].map((item, i) => (
                <div
                  className={`seasonality-chart_body-row ${
                    i % 2 != 0 && "odd"
                  }`}
                  key={i}
                >
                  <div className="seasonality-chart_body-row-left">
                    <p>{item}</p>
                  </div>
                  <div className="seasonality-chart_body-row-right">
                    <div className="seasonality-chart_body-row-right_item g1">
                      00.05
                    </div>
                    <div className="seasonality-chart_body-row-right_item g2">
                      00.05
                    </div>
                    <div className="seasonality-chart_body-row-right_item g3">
                      00.05
                    </div>
                    <div className="seasonality-chart_body-row-right_item n">
                      00.05
                    </div>
                    <div className="seasonality-chart_body-row-right_item d1">
                      00.05
                    </div>
                    <div className="seasonality-chart_body-row-right_item d2">
                      00.05
                    </div>
                    <div className="seasonality-chart_body-row-right_item d3">
                      00.05
                    </div>
                    <div className="seasonality-chart_body-row-right_item g1">
                      00.05
                    </div>
                    <div className="seasonality-chart_body-row-right_item g2">
                      00.05
                    </div>
                    <div className="seasonality-chart_body-row-right_item g3">
                      00.05
                    </div>
                    <div className="seasonality-chart_body-row-right_item n">
                      00.05
                    </div>
                    <div className="seasonality-chart_body-row-right_item d1">
                      00.05
                    </div>
                    <div className="seasonality-chart_body-row-right_item d2">
                      00.05
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabSection>
    </div>
  );
};

export default StocksSeasonality;
