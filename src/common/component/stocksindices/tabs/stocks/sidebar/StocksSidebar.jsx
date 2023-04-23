import React, { useState, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { AgGridReact, AgGridColumn } from "ag-grid-react";

// icons
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { FiShare2, FiDownload } from "react-icons/fi";
import { FaSortAlphaUp } from "react-icons/fa";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveTab,
  setActiveStocksTab,
  setSidebarOpen,
} from "../../../../../../store/stockIndices/StockIndicesSlice";

// components
import Search from "../../../../search/Search";

const StocksSidebar = () => {
  const theme = useSelector((state) => state.Common.theme);
  const router = useRouter();
  const gridRef = useRef(null);
  const dispatch = useDispatch();
  const globalTabs = useSelector((state) => state.Common.GlobalTabs);
  const Tabs = useSelector((state) => state.StockIndices.tabs);
  const ActiveTab = useSelector((state) => state.StockIndices.activeTab);
  const InnerTabs = useSelector((state) => state.StockIndices.innerTabs);
  const ActiveStocksTab = useSelector(
    (state) => state.StockIndices.activeStocksTab
  );
  const SidebarOpen = useSelector((state) => state.StockIndices.sidebarOpen);

  //
  const [tableData, setTableData] = useState([
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
    {
      symbol: "ICICI Bank",
      last: "CMP",
      change: 70.5,
    },
  ]);

  const tableHeader = [
    {
      headerName: "Symbol",
      field: "symbol",
      maxWidth: 150,
      minWidth: 150,
    },
    {
      headerName: "Last",
      field: "last",
    },
    {
      headerName: "% Change",
      field: "change",
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
    <div className={`stockIndicesStocks_Sidebar ${SidebarOpen && "open"}`}>
      <div className="stockIndicesStocks_Sidebar-header">
        <p>mY wATCHLIST</p>
        <div
          className="close"
          onClick={() => {
            dispatch(setSidebarOpen(false));
          }}
        >
          <AiOutlineClose />
        </div>
      </div>
      <div className="stockIndicesStocks_Sidebar-search">
        <Search placeholderText={"enter keyword"} />
      </div>
      <div className="stockIndicesStocks_Sidebar-visited">
        <h5>tOP 5 MOST VISITED</h5>
        <div className="tags">
          <div className="tag">ICICI Bank</div>
          <div className="tag">Airtel</div>
          <div className="tag">TATA MOTORS</div>
          <div className="tag">Airtel</div>
          <div className="tag">TATA MOTORS</div>
        </div>
      </div>
      <div className="stockIndicesStocks_Sidebar-table">
        <div className="stockIndicesStocks_Sidebar-table_header">
          <p>Symbols</p>
          <div className="right">
            <div className="bt">
              <AiOutlinePlus />
            </div>
            <div className="bt">
              <FaSortAlphaUp />
            </div>
            <div className="bt">
              <FiShare2 />
            </div>
            <div className="bt">
              <FiDownload />
            </div>
          </div>
        </div>
        <div className="stockIndicesStocks_Sidebar-table_body">
          <div
            className={`table ${
              theme == "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"
            }`}
          >
            <AgGridReact
              ref={gridRef}
              columnDefs={tableHeader}
              rowData={tableData}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StocksSidebar;
