import { createSlice } from "@reduxjs/toolkit";
// import { SENTIMENT_INDICATOR_DATA } from "../../common/constants/data";

const initialState = {
	indicators: [],
	selectedIndicator: "0",
	selectedIndicatorObj: {},
	indicatorsFlatten: [],
};

const iterateTreeAndToggleExpand = (indicators, isExpanded, index = null) => {
	indicators.map((indicator) => {
		if(index){
			if(indicator.index === index){
				indicator.expanded = isExpanded
			}
		}else{
			indicator.expanded = isExpanded
		}
		if(Array.isArray(indicator.options)){
			iterateTreeAndToggleExpand(indicator.options, isExpanded, index)
		}
	})
	return indicators
}

export const SentimentIndicatorSlice = createSlice({
	name: "SentimentIndicator",
	initialState,
	reducers: {
		setIndicators: (state, action) => {
			state.indicators = action.payload;
		},
		setIndicatorsFlatten: (state, action) => {
			state.indicatorsFlatten = action.payload;
		},
		setSelectedIndicator: (state, action) => {
			state.selectedIndicator = action.payload.index;
			state.selectedIndicatorObj = action.payload;
		},
		toggleExpand: (state, action) => {
			let data = [...state.indicators]
			const {expanded, index} = action.payload
			state.indicators = iterateTreeAndToggleExpand(data, expanded, index)
		},
		toggleExpandAll: (state, action) => {
			let data = [...state.indicators]
			state.indicators = iterateTreeAndToggleExpand(data, action.payload)
		},
	},
});

export const { 
	setIndicators, 
	setSelectedIndicator, 
	toggleExpand, 
	toggleExpandAll, 
	setIndicatorsFlatten 
} = SentimentIndicatorSlice.actions;
export default SentimentIndicatorSlice.reducer;
