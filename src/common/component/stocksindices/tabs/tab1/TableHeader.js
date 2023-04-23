import moment from "moment";
import { capitalizeFirstLetter } from "../../../../utils";

function dateFormatter(params) {
  if (params?.value) {
    return moment(params.value, "YYYY-MM-DD").format("DD-MM-YYYY");
  }
}
function valueFormatter(params, suffix = null, prefix = null) {
  if (params?.value === 0 || params?.value === null) {
    return "-";
  } else {
    if (suffix !== null) {
      return `${params.value}${suffix}`;
    } else if (prefix !== null) {
      return `${prefix}${params.value}`;
    } else {
      return params.value;
    }
  }
}
function ratioFormatter(params, antecedent, consequent) {
  if (params?.value) {
    return `${params?.data?.[antecedent]}:${params?.data?.[consequent]}`;
  }
}
function buySellFormatter(params) {
  if (params?.value === "B") {
    return "Buy";
  } else if (params?.value === "S") {
    return "Sell";
  } else {
    return params?.value;
  }
}
//corporate action
export const dividendTableHeader = [
  {
    headerName: "",
    field: "company.name",
    // maxWidth: 250,
    minWidth: 250,
    suppressMenu: true,
    flex: 1,
    cellStyle: {
      overflow: "hidden",
      // borderRight: 0,
    },
  },
  {
    headerName: "TYPE",
    field: "type",
    // maxWidth: 120,
    // minWidth: 120,
    suppressMenu: true,

    flex: 1,
    cellStyle: {
      // borderRight: 0,
    },
  },
  {
    headerName: "DIV/SHARE",
    field: "dividend_per_share",
    suppressMenu: true,
    // maxWidth: 100,
    // minWidth: 100,
    flex: 1,
    cellStyle: {
      // borderRight: 0,
    },
    valueFormatter: valueFormatter,
  },
  {
    headerName: "EX.DATE",
    field: "execution_date",
    suppressMenu: true,

    valueFormatter: dateFormatter,
    // maxWidth: 100,
    // minWidth: 100,
    flex: 1,
    cellStyle: {
      // borderRight: 0,
    },
  },
];

export const splitBonusTableHeader = [
  {
    headerName: "",
    field: "company.name",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 250,
    minWidth: 250,
    cellStyle: {
      // borderRight: 0,
    },
  },
  {
    headerName: "TYPE",
    field: "type",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 120,
    // minWidth: 120,
    cellStyle: {
      // borderRight: 0,
    },
    valueFormatter: (params) => {
      return capitalizeFirstLetter(params.value);
    },
  },
  {
    headerName: "RATIO",
    field: "new_value",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 100,
    // minWidth: 100,
    cellStyle: {
      // borderRight: 0,
    },
    valueFormatter: (params) =>
      ratioFormatter(params, "existing_value", "new_value"),
  },
  {
    headerName: "EX.DATE",
    field: "execution_date",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 100,
    // minWidth: 100,
    cellStyle: {
      // borderRight: 0,
    },
    valueFormatter: dateFormatter,
  },
];

export const rightsTableHeader = [
  {
    headerName: "",
    field: "company.name",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 250,
    minWidth: 250,
    cellStyle: {
      // borderRight: 0,
    },
  },
  {
    headerName: "RATIO",
    field: "offered_ratio",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 120,
    // minWidth: 120,
    cellStyle: {
      // borderRight: 0,
    },
    valueFormatter: (params) =>
      ratioFormatter(params, "offered_ratio", "existing_ratio"),
  },
  {
    headerName: "ISSUE PRICE",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 100,
    // minWidth: 100,
    cellStyle: {
      // borderRight: 0,
    },
    field: "issue_price",
  },
  {
    headerName: "EX.DATE",
    field: "execution_date",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 100,
    // minWidth: 100,
    cellStyle: {
      borderRight: 0,
    },
    valueFormatter: dateFormatter,
  },
];

export const mergerTablesHeader = [
  {
    headerName: "",
    field: "company.name",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 250,
    minWidth: 250,
    cellStyle: {
      // borderRight: 0,
    },
  },
  {
    headerName: "TYPE",
    field: "type",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 170,
    // minWidth: 170,
    cellStyle: {
      // borderRight: 0,
    },
  },
  {
    headerName: "EX.DATE",
    field: "execution_date",
    suppressMenu: true,
    flex: 1,
    valueFormatter: dateFormatter,
    // maxWidth: 150,
    // minWidth: 150,
    cellStyle: {
      // borderRight: 0,
    },
  },
];

//corporate action active

export const dividendTableHeaderActive = [
  {
    headerName: "ANNOUNCEMENT DATE",
    field: "announcement_date",
    suppressMenu: true,
    flex: 1,
    valueFormatter: dateFormatter,
  },
  {
    headerName: "STOCK",
    field: "company.name",
    suppressMenu: true,
  },
  {
    headerName: "CMP",
    field: "",
    suppressMenu: true,
    flex: 1,
    valueFormatter: (params) => {
      const _stock_price = params.data?.company?.view_stock_price;
      if (Array.isArray(_stock_price) && _stock_price?.length) {
        return _stock_price[0]?.current_price;
      } else {
        return "-";
      }
    },
  },
  {
    headerName: "TYPE",
    field: "type",
    suppressMenu: true,
    flex: 1,
  },
  {
    headerName: "DIVIDEND %",
    field: "dividend_percentage",
    suppressMenu: true,
    flex: 1,
    valueFormatter: (params) => valueFormatter(params, "%"),
  },
  {
    headerName: "DIV/SHARE",
    field: "dividend_per_share",
    suppressMenu: true,
    flex: 1,
    valueFormatter: (params) => valueFormatter(params, null, "₹"),
  },
  {
    headerName: "EX.DATE",
    field: "execution_date",
    // maxWidth: 120,
    flex: 1,
    suppressMenu: true,
    valueFormatter: dateFormatter,
  },
];

export const splitBonusTableHeaderActive = [
  {
    headerName: "ANNOUNCEMENT DATE",
    field: "announcement_date",
    suppressMenu: true,
    flex: 1,
    // maxWidth: 130,
    // minWidth: 130,
    // cellStyle: {
    //   borderRight: 0,
    // },
    valueFormatter: dateFormatter,
  },
  {
    headerName: "STOCK",
    field: "company.name",
    suppressMenu: true,
    // flex: 1,
    // maxWidth: 170,
    // minWidth: 170,
    // cellStyle: {
    //   borderRight: 0,
    // },
  },
  {
    headerName: "CMP",
    field: "",
    suppressMenu: true,
    flex: 1,
    valueFormatter: (params) => {
      const _stock_price = params.data?.company?.view_stock_price;
      if (Array.isArray(_stock_price) && _stock_price?.length) {
        return _stock_price[0]?.current_price;
      } else {
        return "-";
      }
    },
    // maxWidth: 70,
    // minWidth: 70,
    // cellStyle: {
    //   borderRight: 0,
    // },
  },
  {
    headerName: "TYPE",
    field: "type",
    suppressMenu: true,
    flex: 1,
    valueFormatter: (params) => {
      return capitalizeFirstLetter(params.value);
    },
    // maxWidth: 60,
    // minWidth: 60,
    // cellStyle: {
    //   borderRight: 0,
    // },
  },
  {
    headerName: "RATIO",
    field: "new_value",
    suppressMenu: true,
    flex: 1,
    // maxWidth: 100,
    // minWidth: 100,
    // cellStyle: {
    //   borderRight: 0,
    // },
    valueFormatter: (params) =>
      ratioFormatter(params, "existing_value", "new_value"),
  },
  {
    headerName: "OLD FACE VALUE",
    field: "existing_value",
    suppressMenu: true,
    flex: 1,
    // maxWidth: 100,
    // minWidth: 100,
    // cellStyle: {
    //   borderRight: 0,
    // },
  },
  {
    headerName: "NEW FACE VALUE",
    field: "new_value",
    suppressMenu: true,
    flex: 1,
    // maxWidth: 100,
    // minWidth: 100,
    // cellStyle: {
    //   borderRight: 0,
    // },
  },
  {
    headerName: "EX.DATE",
    field: "execution_date",
    suppressMenu: true,
    flex: 1,
    // maxWidth: 80,
    // minWidth: 80,
    // cellStyle: {
    //   borderRight: 0,
    // },
    valueFormatter: dateFormatter,
  },
];

export const rightsTableHeaderActive = [
  {
    headerName: "ANNOUNCEMENT DATE",
    field: "announcement_date",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 130,
    // minWidth: 130,
    // cellStyle: {
    //   borderRight: 0,
    // },
    valueFormatter: dateFormatter,
  },
  {
    headerName: "STOCK",
    field: "company.name",
    suppressMenu: true,
    // flex: 1,

    // maxWidth: 150,
    // minWidth: 200,
    // cellStyle: {
    //   borderRight: 0,
    // },
  },
  {
    headerName: "CMP",
    field: "",
    suppressMenu: true,
    flex: 1,
    valueFormatter: (params) => {
      const _stock_price = params.data?.company?.view_stock_price;
      if (Array.isArray(_stock_price) && _stock_price?.length) {
        return _stock_price[0]?.current_price;
      } else {
        return "-";
      }
    },
    // maxWidth: 60,
    // minWidth: 60,
    // cellStyle: {
    //   borderRight: 0,
    // },
  },
  {
    headerName: "TYPE",
    field: "offered_instrument_type_description",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 110,
    // minWidth: 50,
    // cellStyle: {
    //   borderRight: 0,
    // },
  },
  {
    headerName: "RATIO",
    field: "offered_ratio",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 100,
    // minWidth: 100,
    // cellStyle: {
    //   borderRight: 0,
    // },
    valueFormatter: (params) =>
      ratioFormatter(params, "offered_ratio", "existing_ratio"),
  },
  {
    headerName: "SHARES HELD",
    field: "existing_ratio",
    suppressMenu: true,

    flex: 1,
    // maxWidth: 80,
    // minWidth: 80,
    // cellStyle: {
    //   borderRight: 0,
    // },
  },
  {
    headerName: "SHARES OFFERED",
    field: "offered_ratio",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 100,
    // minWidth: 100,
    // cellStyle: {
    //   borderRight: 0,
    // },
  },
  {
    headerName: "ISSUE PRICE",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 80,
    // minWidth: 80,
    // cellStyle: {
    //   borderRight: 0,
    // },
    field: "issue_price",
  },
  {
    headerName: "EX.DATE",
    field: "execution_date",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 100,
    // minWidth: 100,
    // cellStyle: {
    //   borderRight: 0,
    // },
    valueFormatter: dateFormatter,
  },
];

export const mergerTablesHeaderActive = [
  {
    headerName: "ANNOUNCEMENT DATE",
    field: "announcement_date",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 130,
    // minWidth: 130,
    // cellStyle: {
    //   borderRight: 0,
    // },
    valueFormatter: dateFormatter,
  },
  {
    headerName: "STOCK",
    field: "company.name",
    suppressMenu: true,
    // flex: 1,

    // maxWidth: 150,
    // minWidth: 150,
    // cellStyle: {
    //   borderRight: 0,
    // },
  },
  {
    headerName: "CMP",
    field: "",
    suppressMenu: true,
    flex: 1,
    valueFormatter: (params) => {
      const _stock_price = params.data?.company?.view_stock_price;
      if (Array.isArray(_stock_price) && _stock_price?.length) {
        return _stock_price[0]?.current_price;
      } else {
        return "-";
      }
    },
    // maxWidth: 100,
    // minWidth: 100,
    // cellStyle: {
    //   borderRight: 0,
    // },
  },
  {
    headerName: "TYPE",
    field: "type",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 100,
    // minWidth: 100,
    // cellStyle: {
    //   borderRight: 0,
    // },
  },
  {
    headerName: "RATIO",
    field: "offered_ratio",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 50,
    // minWidth: 50,
    // cellStyle: {
    //   borderRight: 0,
    // },
  },
  {
    headerName: "EXISTING FACE VALUE",
    field: "existing_face_value",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 80,
    // minWidth: 80,
    // cellStyle: {
    //   borderRight: 0,
    // },
    valueFormatter: valueFormatter,
  },
  {
    headerName: "NEW FACE VALUE",
    field: "face_value_after_demerge",
    suppressMenu: true,
    flex: 1,

    // maxWidth: 80,
    // minWidth: 80,
    // cellStyle: {
    //   borderRight: 0,
    // },
    valueFormatter: valueFormatter,
  },
  {
    headerName: "EX.DATE",
    field: "execution_date",
    suppressMenu: true,
    flex: 1,
    // maxWidth: 100,
    // minWidth: 100,
    // cellStyle: {
    //   borderRight: 0,
    // },
    valueFormatter: dateFormatter,
  },
];

//insider training

export const bulkDealsTableHeader = [
  {
    headerName: "",
    field: "stock.company.name",
    filter: false,
    // sortIcon: true,
    // unSortIcon: true,
    suppressMenu: true,
    maxWidth: 110,
    wraptext: false,
    minWidth: 90,
    // flex: 1,

    cellStyle: {
      height: "fit-content",
      // overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "EXCHANGE",
    field: "exchange",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    maxWidth: 80,
    // minWidth: 60,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "TRANSACTION TYPE",
    field: "type",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 90,
    // minWidth: 90,
    flex: 1,
    valueFormatter: buySellFormatter,
    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "INVESTOR",
    field: "client_name",
    filter: false,
    // sortIcon: true,
    // unSortIcon: true,
    suppressMenu: true,
    // wraptext: true,
    cellStyle: {
      height: "fit-content",
    },
    // maxWidth: 200,
    // minWidth: 200,
    // flex: 1,
  },
  {
    headerName: "QTY",
    field: "quantity",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 50,
    // minWidth: 50,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "PRICE",
    field: "price",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 140,
    // minWidth: 140,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
];

export const bulkDealsTableActiveHeader = [
  {
    headerName: "",
    field: "stock.company.name",
    filter: false,
    // sortIcon: true,
    // unSortIcon: true,
    suppressMenu: true,
    maxWidth: 110,
    wraptext: false,
    minWidth: 90,
    // flex: 1,

    cellStyle: {
      height: "fit-content",
      // overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "EXCHANGE",
    field: "exchange",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    maxWidth: 80,
    // minWidth: 60,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "TRANSACTION TYPE",
    field: "type",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 90,
    // minWidth: 90,
    flex: 1,
    valueFormatter: buySellFormatter,
    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "INVESTOR",
    field: "client_name",
    filter: false,
    // sortIcon: true,
    // unSortIcon: true,
    suppressMenu: true,
    // wraptext: true,
    cellStyle: {
      height: "fit-content",
    },
    // maxWidth: 200,
    // minWidth: 200,
    // flex: 1,
  },
  {
    headerName: "QTY",
    field: "quantity",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 50,
    // minWidth: 50,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "PRICE",
    field: "price",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 140,
    // minWidth: 140,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "Deal Date",
    field: "deal_date",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    maxWidth: 80,
    // minWidth: 60,
    flex: 1,
    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
];

export const blokDealsTableHeader = [
  {
    headerName: "",
    field: "stock.company.name",
    filter: false,
    // sortIcon: true,
    // unSortIcon: true,
    suppressMenu: true,
    maxWidth: 110,
    wraptext: false,
    minWidth: 90,
    // flex: 1,

    cellStyle: {
      height: "fit-content",
      // overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "EXCHANGE",
    field: "exchange",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    maxWidth: 80,
    // minWidth: 60,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "TRANSACTION TYPE",
    field: "type",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 90,
    // minWidth: 90,
    flex: 1,
    valueFormatter: buySellFormatter,
    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "INVESTOR",
    field: "client_name",
    filter: false,
    // sortIcon: true,
    // unSortIcon: true,
    suppressMenu: true,
    // wraptext: true,
    cellStyle: {
      height: "fit-content",
    },
    // maxWidth: 200,
    // minWidth: 200,
    // flex: 1,
  },
  {
    headerName: "QTY",
    field: "quantity",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 50,
    // minWidth: 50,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "PRICE",
    field: "price",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 140,
    // minWidth: 140,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "Deal Date",
    field: "deal_date",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    maxWidth: 80,
    // minWidth: 60,
    flex: 1,
    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
];

export const blokDealsTableActiveHeader = [
  {
    headerName: "",
    field: "stock.company.name",
    filter: false,
    // sortIcon: true,
    // unSortIcon: true,
    suppressMenu: true,
    maxWidth: 110,
    wraptext: false,
    minWidth: 90,
    // flex: 1,

    cellStyle: {
      height: "fit-content",
      // overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "EXCHANGE",
    field: "exchange",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    maxWidth: 80,
    // minWidth: 60,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "TRANSACTION TYPE",
    field: "type",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 90,
    // minWidth: 90,
    flex: 1,
    valueFormatter: buySellFormatter,
    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "INVESTOR",
    field: "client_name",
    filter: false,
    // sortIcon: true,
    // unSortIcon: true,
    suppressMenu: true,
    // wraptext: true,
    cellStyle: {
      height: "fit-content",
    },
    // maxWidth: 200,
    // minWidth: 200,
    // flex: 1,
  },
  {
    headerName: "QTY",
    field: "quantity",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 50,
    // minWidth: 50,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "PRICE",
    field: "price",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 140,
    // minWidth: 140,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "Deal Date",
    field: "deal_date",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    maxWidth: 80,
    // minWidth: 60,
    flex: 1,
    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
];

export const insiderTableHeader = [
  {
    headerName: "",
    field: "stock.ticker",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    minWidth: 90,
    // maxWidth: 90,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "NAME",
    field: "person_name",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // minWidth: 140,
    // maxWidth: 140,
    // flex: 1,

    cellStyle: {
      height: "fit-content",
      // overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "TRANSACTION TYPE",
    field: "transaction_type",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 90,
    // minWidth: 90,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "AQUISITION MODE",
    field: "acquisition_mode",
    filter: false,
    // sortIcon: true,
    // unSortIcon: true,
    suppressMenu: true,

    flex: 1,

    cellStyle: {
      height: "fit-content",
      // overflow: "hidden",
    },
  },
  {
    headerName: "QTY",
    field: "security_count",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 80,
    // minWidth: 80,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "VALUE",
    field: "security_value",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 80,
    // minWidth: 80,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
];

//insider tradings active

export const insiderTableHeaderActive = [
  {
    headerName: "",
    field: "stock.ticker",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // minWidth: 120,
    // maxWidth: 120,
    flex: 1,

    cellStyle: {
      height: "fit-content",
      // overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "NAME",
    field: "person_name",
    filter: false,
    // sortIcon: true,
    // unSortIcon: true,
    suppressMenu: true,
    // wraptext: true,
    // minWidth: 90,
    // maxWidth: 90,
    // flex: 1,

    cellStyle: {
      // display: "flex",
      // alignItems: "center",
      paddingTop: "1rem ",
      // paddingBottom: "1rem",
      heigth: "fit-content",
      // overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "TRANSACTION TYPE",
    field: "transaction_type",
    filter: false,
    // sortIcon: true,
    // unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 90,
    // minWidth: 90,
    flex: 1,

    cellStyle: {
      height: "fit-content",
      // overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "AQUISITION MODE",
    field: "acquisition_mode",
    filter: false,
    // sortIcon: true,
    // unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 90,
    // minWidth: 90,
    flex: 1,

    cellStyle: {
      height: "fit-content",
      // overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "QTY",
    field: "security_count",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 60,
    // minWidth: 60,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "VALUE",
    field: "security_value",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 50,
    // minWidth: 50,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "MODE OF TRANSACTION",
    field: "acquisition_mode",
    filter: false,
    // sortIcon: true,
    // unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 100,
    // minWidth: 100,
    flex: 1,

    cellStyle: {
      height: "fit-content",
      // overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "PRE TRANSACTION SHAREHOLDING",
    field: "pretransaction_shareholding_percent",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 100,
    // minWidth: 100,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "POST TRANSACTION SHAREHOLDING",
    field: "posttransaction_shareholding_percent",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    // maxWidth: 80,
    // minWidth: 80,
    flex: 1,

    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
  {
    headerName: "Date",
    field: "acquisition_date",
    filter: false,
    sortIcon: true,
    unSortIcon: true,
    suppressMenu: true,
    maxWidth: 80,
    // minWidth: 60,
    flex: 1,
    cellStyle: {
      overflow: "hidden",
      // borderRight: "none",
    },
  },
];
