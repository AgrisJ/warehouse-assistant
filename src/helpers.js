export const getLocalStorage = (key) => { return localStorage.getItem(key) };
export const setLocalStorage = (key, val) => { localStorage.setItem(key, val) };
export const roundDown = (number) => { return Math.floor(number).toFixed(0) };
export const roundUp = (number) => { return Math.ceil(number).toFixed(0) };
export const manipulateMinutes = (startTime, setStartTimeFn, timeLocStor = 'startTime', increaseOrDecrease = 'increase') => {
	const minutes = +startTime[1],
		changeValue = increaseOrDecrease === 'decrease' ? minutes - 15 : minutes + 15,
		timeArr = startTime.slice(),
		doubleZeroes = increaseOrDecrease === 'increase' ?
			timeArr[1] === '45' ? '45' : changeValue.toString() : // on increase
			timeArr[1] === '15' || timeArr[1] === '00' ? '00' : changeValue.toString(); // on decrease

	timeArr.pop();
	timeArr.push(doubleZeroes)

	changeValue < 60 && setStartTimeFn(timeArr); // was '<='
	changeValue < 60 && setLocalStorage(timeLocStor, timeArr); // was '<='
}; // End of manipulateMinutes
export const errorHandlingLocStorage = (keyName, defaultObj) => {
	try {
		JSON.parse(getLocalStorage(keyName))
	} catch (e) {
		console.log(e.message);

		e && setLocalStorage(keyName + '_backup', getLocalStorage(keyName))
		e && setLocalStorage(keyName, JSON.stringify(defaultObj))
	}
}; // End of errorHandlingLocStorage

export default {
	getLocalStorage,
	setLocalStorage,
	roundDown,
	roundUp,
	manipulateMinutes,
	errorHandlingLocStorage
};