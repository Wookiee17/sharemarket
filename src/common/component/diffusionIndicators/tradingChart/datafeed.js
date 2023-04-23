import {
	fetchIndexData,
	fetchDiffusionIndicatorData,
	getIndicatorValue,
	getAllSymbols
} from './helpers.js';
import moment from 'moment';
import { store } from "../../../../store/store"
const configurationData = {
	supported_resolutions: ['1D'],
	// supported_resolutions: ['1D', '1W', '1M', '12M'],
	exchanges: ["NSE"],
	symbols_types: [],
	// weekly_multipliers: ["1"],
	// monthly_multipliers: ["1"],
};

export default {
	onReady: (callback) => {
		// console.log('[onReady]: Method call');
		setTimeout(() => callback(configurationData));
	},
	searchSymbols: async (
		userInput,
		exchange,
		symbolType,
		onResultReadyCallback
	) => {
		const symbols = await getAllSymbols();
		const newSymbols = symbols.filter(symbol => {
			const isExchangeValid = exchange === '' || symbol.exchange === exchange;
			return isExchangeValid;
		});
		onResultReadyCallback(newSymbols);
	},
	resolveSymbol: async (
		symbolName,
		onSymbolResolvedCallback,
		onResolveErrorCallback,
		extension
	) => {
		const holidays = store.getState().Common.holidays
		const {selectedIndex} = store.getState().DiffusionIndicator
		let formattedHolidays = ""
		if (holidays.length) {
			formattedHolidays = holidays.map(hday => hday.holiday_date).map(hday => moment(hday, "YYYY-MM-DD").format("YYYYMMDD")).join(",")
		}
		const symbols = await getAllSymbols();
		const symbolItem = symbols.find(({ symbol }) => symbol === symbolName);
		// if (!symbolItem) {
		// 	console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
		// 	onResolveErrorCallback('cannot resolve symbol');
		// 	return;
		// }
		const symbolInfo = {
			ticker: symbolItem?.symbol || `${symbolName}:${selectedIndex.symbol}`,
			name: symbolItem?.name || symbolName,
			description: symbolItem?.name || symbolName,
			type: symbolItem?.name ? "index" : "indicator",
			session: '0900-1530',
			timezone: 'Asia/Kolkata',
			exchange: "NSE",
			minmov: 1,
			pricescale: 100,
			has_intraday: false,
			visible_plots_set: "c",
			supported_resolutions: configurationData.supported_resolutions,
			volume_precision: 2,
			data_status: 'streaming',
			has_weekly_and_monthly: false,
			session_holidays: formattedHolidays
		};
		console.log('[resolveSymbol]: Symbol resolved', symbolName);
		setTimeout(() => {
			onSymbolResolvedCallback(symbolInfo);
		}, 0)

		// const symbolInfo = {
		// 	ticker: symbolName,
		// 	name: "NSE:NIFTY",
		// 	description: "NIFTY",
		// 	type: "index",
		// 	session: '0900-1530',
		// 	timezone: 'Asia/Kolkata',
		// 	exchange: "NSE",
		// 	minmov: 1,
		// 	pricescale: 100,
		// 	has_intraday: false,
		// 	visible_plots_set: "c",
		// 	supported_resolutions: configurationData.supported_resolutions,
		// 	volume_precision: 2,
		// 	data_status: 'streaming',
		// 	has_weekly_and_monthly: false,
		// 	// has_weekly_and_monthly: true,
		// 	// weekly_multipliers: ["1"],
		// 	// monthly_multipliers: ["1"],
		// 	session_holidays: formattedHolidays
		// };

		// // console.log('[resolveSymbol]: Symbol resolved', symbolName);
		// setTimeout(() => {
		// 	onSymbolResolvedCallback(symbolInfo);
		// }, 0)
	},
	getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
		const holidayState = store.getState().Common.holidays
		let holidays = []
		if (Array.isArray(holidayState) && holidayState.length) {
			holidays = holidayState.map(hday => hday.holiday_date)
		}
		const { from, to, firstDataRequest } = periodParams;
		let _from = moment.unix(from).format("YYYY-MM-DD")
		let _to = moment.unix(to).format("YYYY-MM-DD")
		// console.log('[getBars]: Method call', symbolInfo, resolution, _from, _to);
		try {
			let bars = [];
			//skip saturday and sundays manually
			const from_day = moment.unix(from).format("dddd")
			const to_day = moment.unix(to).format("dddd")
			if (from_day === "Saturday") {
				_from = moment.unix(from).subtract(1, "d").format("YYYY-MM-DD")
			} else if (from_day === "Sunday") {
				_from = moment.unix(from).add(1, "d").format("YYYY-MM-DD")
			}
			if (to_day === "Saturday") {
				_to = moment.unix(to).subtract(1, "d").format("YYYY-MM-DD")
			} else if (to_day === "Sunday") {
				_to = moment.unix(to).add(1, "d").format("YYYY-MM-DD")
			}
			if (_to === _from) { //check if two dates collide
				if (moment.unix(_to).format("dddd") === "Friday") { //change Friday to Monday by adding 3 days. We don't need to change other collide days as it's handled by the function itself
					_to = moment(_from).add(3, "d").format("YYYY-MM-DD")
				} else {
					_to = moment(_from).add(1, "d").format("YYYY-MM-DD")
				}
			}
			//skip holidays
			if (holidays.includes(_to) || holidays.includes(_from)) {
				onHistoryCallback([], { noData: false });
				return;
			}
			let time_gap = "1 day"
			if (resolution === "1M") {
				time_gap = "1 month"
			} else if (resolution === "1W") {
				time_gap = "1 week"
			} else if (resolution === "12M") {
				time_gap = "1 year"
			}
			if (symbolInfo.type === "indicator") {
				const resp = await fetchDiffusionIndicatorData({ symbolInfo, from: _from, to: _to, time_gap });
				if (resp?.length > 0) {
					resp.forEach(bar => {
						const barTime = moment(bar.priced_date).unix();
						let _value = getIndicatorValue(symbolInfo.ticker, bar)
						if (barTime >= from && barTime < to) {
							bars = [...bars, {
								time: barTime * 1000,
								close: _value,
							}];
						}
					});
				} else {
					// "noData" should be set if there is no data in the requested period.
					onHistoryCallback([], { noData: true });
					return;
				}
			} else {
				const data = await fetchIndexData({ symbolInfo, from: _from, to: _to, time_gap });
				if (data.length === 0) {
					// "noData" should be set if there is no data in the requested period.
					onHistoryCallback([], { noData: true });
					return;
				}
				data.forEach(bar => {
					const barTime = bar.unix_timestamp;
					if (barTime >= from && barTime < to) {
						let modifiedBarTime = barTime
            			modifiedBarTime += (24*60*60)
						bars = [...bars, {
							time: modifiedBarTime * 1000,
							low: bar.low_price,
							high: bar.high_price,
							open: bar.open_price,
							close: bar.close_price,
						}];
					}
				});
			}
			// console.log(`[getBars]: returned ${bars.length} bar(s)`, bars);
			onHistoryCallback(bars, { noData: false });
		} catch (error) {
			// console.log('[getBars]: Get error', error);
			onErrorCallback(error);
		}
	},
	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
		// console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
	},
	unsubscribeBars: (subscriberUID) => {
		// console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
	}
};