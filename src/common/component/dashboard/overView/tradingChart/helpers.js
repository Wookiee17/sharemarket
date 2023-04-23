import { initializeApollo } from "../../../../../gql/apolloClient";
import { GET_STOCK_PRICES_SENTIMENT_INDICATOR } from '../../../../../gql/sentimentIndicators/query.js';
import moment from "moment";

export async function fetchIndexData(params) {
	try {
		const apolloClient = initializeApollo();
		const response = await apolloClient.query({
			query: GET_STOCK_PRICES_SENTIMENT_INDICATOR,
			variables: {
				"start_date": params.from,
				"end_date":params.to,
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