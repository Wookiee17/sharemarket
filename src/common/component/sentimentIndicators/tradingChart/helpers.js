import { initializeApollo } from "../../../../gql/apolloClient";
import { GET_STOCK_PRICES_SENTIMENT_INDICATOR, GET_INDICATOR_DATA } from '../../../../gql/sentimentIndicators/query.js';
import moment from "moment";

export async function fetchIndexData(params) {
	try {
		const apolloClient = initializeApollo();
		const response = await apolloClient.query({
			query: GET_STOCK_PRICES_SENTIMENT_INDICATOR,
			variables: {
				"start_date": params.from,
				"end_date": params.to,
				"symbol_v": params.symbolInfo.ticker,
				"time_gap": params.time_gap
			}
		})
		const stockPriceData = response?.data?.stock_prices || [];
		return stockPriceData
	} catch (error) {
		throw new Error(`fetchIndexData Error: ${error}`);
	}
}

export async function fetchMomentumSwingData(params) {
	try {
		const apolloClient = initializeApollo();
		const response = await apolloClient.query({
			query: GET_INDICATOR_DATA,
			variables: {
				indicator_name: params.symbolInfo.ticker,
				start_date: params.from,
				end_date: params.to,
				time_gap: params.time_gap
			}
		})
		const dailySwingData = response?.data?.indiacharts_indicators || [];
		return dailySwingData
	} catch (error) {
		throw new Error(`fetchMomentumSwingData Error: ${error}`);
	}
}

// Generate a symbol ID from a pair of the coins
export function generateSymbol(exchange, fromSymbol, toSymbol) {
	const short = `${fromSymbol}/${toSymbol}`;
	return {
		short,
		full: `${exchange}:${short}`,
	};
}
export function parseFullSymbol(fullSymbol) {
	const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
	if (!match) {
		return null;
	}
	return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] };
}
export const generateIndicatorConfig = ({
	indicatorName, 
	indicatorDesc, 
	indicatorId, 
	PineJS
}) => {
	return {
		name: indicatorName,
		metainfo: {
			_metainfoVersion: 51,
			id: indicatorId,
			description: indicatorDesc,
			shortDescription: indicatorDesc,
			is_hidden_study: false,
			is_price_study: false,
			isCustomIndicator: true,
			linkedToSeries: false,
			format: {
				type: "price",
				precision: 2,
			},
			plots: [
				{
					id: "plot_0",
					type: "line",
				},
				{
					id: "plot_1",
					type: "line",
				},
				{
					id: "plot_2",
					type: "line",
				},
			],
			defaults: {
				styles: {
					plot_0: {
						linestyle: 0,
						visible: true,
						linewidth: 2,
						plottype: 0,
						trackPrice: false,
						color: "#f00",
					},
					plot_1: {
						linestyle: 2,
						visible: true,
						linewidth: 1.5,
						plottype: 0, //0 means line
						trackPrice: true,
						transparency: 100,
						color: "#ff0",
					},
					plot_2: {
						linestyle: 2,
						visible: true,
						linewidth: 1.5,
						plottype: 0,
						trackPrice: true,
						transparency: 100,
						color: "#ff0",
					},
				},
				precision: 4,
				inputs: {
					plot_1: 0,
					plot_2: 0
				}
			},
			styles: {
				plot_0: {
					title: "price line",
					histogramBase: 0,
				},
				plot_1: {
					title: "overbought line",
					histogramBase: 0,
				},
				plot_2: {
					title: "oversold line",
					histogramBase: 0,
				},
			},
			inputs: [
				{id : 'plot_1', name :'Overbought line', type : 'integer', isHidden : true, defval : 0},
				{id : 'plot_2', name :'Oversold line', type : 'integer', isHidden : true, defval : 0},
			],
		},
		constructor: function () {
			this.init = async function (context, inputCallback) {
				this._context = context;
				this._input = inputCallback;
				var symbol = indicatorName;
				this._context.new_sym(symbol, PineJS.Std.period(this._context));
			};

			this.main = function (context, inputCallback) {
				this._context = context;
				this._input = inputCallback;

				//https://github.com/tradingview/charting_library/issues/4868#issuecomment-611978309
				
				// switch to the first requested symbol
				this._context.select_sym(1);
				// save the first series' time and close value
				const firstSymbolTimeSeries = this._context.new_var(this._context.symbol.time);
				const firstSeriesCloseSeries = this._context.new_var(PineJS.Std.close(this._context));
				const overbought = this._input(0)
				const oversold = this._input(1)
				// switch back to the main symbol (chart's symbol)
				this._context.select_sym(0);
				// save series' time
				var mainSymbolTimeSeries = this._context.new_var(this._context.symbol.time);

				// important part: use adopt to find proper value inside series
				// thus, let's look at firstSeriesCloseSeries.adopt(firstSymbolTimeSeries, mainSymbolTimeSeries)
				// here we trying to find proper close value of the first series, "adopting" it to the main series' time

				// if(overbought > 0 && oversold > 0){
					return [
						firstSeriesCloseSeries.adopt(firstSymbolTimeSeries, mainSymbolTimeSeries),
						overbought,
						oversold
					];
				// }else{
				// 	return [
				// 		firstSeriesCloseSeries.adopt(firstSymbolTimeSeries, mainSymbolTimeSeries),
				// 	];
				// }
			};
		},
	}
}