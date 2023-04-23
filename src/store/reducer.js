import { combineReducers } from "@reduxjs/toolkit";

// all reducers
import Common from "./common/CommonSlice";
import Dashboard from "./dashboard/DashboardSlice";
import MarketOverview from "./dashboard/MarketOverviewSlice";
import FutureActivity from "./dashboard/FutureActivitySlice";
import SentimentIndicator from "./sentimentIndicator/SentimentIndicatorSlice";
import Heatmap from "./heatmap/HeatmapSlice";
import ParticipantsData from "./participantsData/ParticipantsDataSlice";
import Help from "./help/HelpSlice";
import StockIndices from "./stockIndices/StockIndicesSlice";
import Webinar from "./webinar/WebinarSlice";
import Scanners from "./scanners/ScannersSlice";
import DiffusionIndicator from "./diffusionIndicator/DiffusionIndicatorSlice";
import Calendar from "./calendar/CalendarSlice";
import Shield from "./shield/ShieldSlice";
import Account from "./account/AccountSlice";
const rootReducer = combineReducers({
    Common,
    Dashboard,
    MarketOverview,
    FutureActivity,
    SentimentIndicator,
    Heatmap,
    ParticipantsData,
    Help,
    StockIndices,
    Webinar,
    Scanners,
    DiffusionIndicator,
    Calendar,
    Shield,
  Account,
});

export default rootReducer;
