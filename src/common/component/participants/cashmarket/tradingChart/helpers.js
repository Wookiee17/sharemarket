import { initializeApollo } from "../../../../../gql/apolloClient";
import { 
	GET_CASHMARKET_DII, 
	GET_CASHMARKET_FII, 
	GET_CASHMARKET_FII_TIMEBUCKET, 
	GET_CASHMARKET_DII_TIMEBUCKET 
} from '../../../../../gql/queries';
import {GET_STOCK_PRICES_SENTIMENT_INDICATOR} from "../../../../../gql/sentimentIndicators/query";
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

export async function fetchIndicatorData(params) {
	try {
		const apolloClient = initializeApollo();
		const ticker = params.symbolInfo.ticker
		const response = await apolloClient.query({
			query: ticker === "FII" ? GET_CASHMARKET_FII_TIMEBUCKET : GET_CASHMARKET_DII_TIMEBUCKET,
			variables: {
				start_date: params.from,
				end_date: params.to,
				time_gap: params.time_gap,
				order_by: {
					priced_date : "asc"
				}
			}
		})
		return response?.data?.[ticker === "FII" ? "indiacharts_fii_list" : "indiacharts_dii_list"] || [];
	} catch (error) {
		throw new Error(`fetchIndicatorData Error: ${error}`);
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
					'id': 'plot_bar_color',
					'type': 'colorer',
					'target': 'plot_0',
					'palette': 'palette_bar',
				},
			],
			palettes: {
				palette_bar: {
					colors: [{ name: 'Positive Color' }, { name: 'Negative Color' }],
					valToIndex: {
						0: 0,
						1: 1,
					},
				},
			},
			defaults: {
				palettes: {
					palette_bar: {
						colors: [
							{ color: "rgba(82, 196, 26, 1)", width: 1, style: 0 },
							{ color: 'rgba(255, 74, 74, 1)', width: 1, style: 0 },
						],
					},
				},
				styles: {
					plot_0: {
						linestyle: 0,
						visible: true,
						linewidth: 2,
						plottype: 5,
						trackPrice: false,
						color: "#f00",
					},
				},
				precision: 4
			},
			styles: {
				plot_0: {
					title: "price line",
					histogramBase: 0,
				}
			},
			inputs: [],
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
				// switch back to the main symbol (chart's symbol)
				this._context.select_sym(0);
				// save series' time
				var mainSymbolTimeSeries = this._context.new_var(this._context.symbol.time);
				// important part: use adopt to find proper value inside series
				// thus, let's look at firstSeriesCloseSeries.adopt(firstSymbolTimeSeries, mainSymbolTimeSeries)
				// here we trying to find proper close value of the first series, "adopting" it to the main series' time
				const adoptedClosing = firstSeriesCloseSeries.adopt(firstSymbolTimeSeries, mainSymbolTimeSeries)
				return [adoptedClosing, adoptedClosing > 0 ? 0 : 1];
			};
		},
	}
}