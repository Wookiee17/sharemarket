import moment from "moment"
export const createObjectNameFromIndex = (objectName, index) => {
	let _objectName = objectName
	index.split(".").map((index, i) => {
		if (i === 0) {
			_objectName += `[${index}]`
		} else {
			_objectName += `.options[${index}]`
		}
	})
	return _objectName
}
export const getSelectedSentimentIndicator = (indicators, index, singleObj = true) => {
	let objectName = "indicators"
	let items = []
	index.split(".").map((index, i) => {
		if (i === 0) {
			objectName += `[${index}]`
		} else {
			objectName += `.options[${index}]`
		}
		items.push(eval(objectName))
	})
	return singleObj ? eval(objectName) : items
}
export const camelize = (str) =>{
	// console.log(str)
	return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
	  return index === 0 ? word.toLowerCase() : word.toUpperCase();
	}).replace(/\s+/g, '');
}
export const marketCloseUTC = moment("15:30:01", "HH:mm:ss").utc().format("HH:mm:ss")
export const capitalizeFirstLetter = (string) =>{
	return string.charAt(0).toUpperCase() + string.slice(1);
}
export const round = (value) => {
 return Math.round(value * 100) / 100
}
export const convertLakhs = (value) => {
	const _lacValue = value / 100000;
    return isNaN(_lacValue) || _lacValue === 0 ? "-" : _lacValue.toFixed(2);
}
export const convertCrores = (value) => {
	const _croreValue = value / 10000000;
    return isNaN(_croreValue) || _croreValue === 0 ? "-" : _croreValue.toFixed(2);
}