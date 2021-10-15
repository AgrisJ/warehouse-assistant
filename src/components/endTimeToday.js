import React from 'react'
import { setLocalStorage } from '../helpers';
import { manipulateMinutes } from './../helpers';
const EndTimeToday = (props) => {

	const { setEndTimeFn, endTime } = props;

	const increaseHours = () => {
		const hours = +endTime[0],
			increase = hours + 1,
			timeArr = endTime.slice();

		timeArr.shift();
		timeArr.unshift(increase.toString())

		increase < 24 && setEndTimeFn(timeArr);
		increase < 24 && setLocalStorage("endTime", timeArr);
	}; // End of increaseHours

	const decreaseHours = () => {
		const hours = +endTime[0],
			decrease = hours - 1,
			timeArr = endTime.slice();

		timeArr.shift();
		timeArr.unshift(decrease.toString())

		hours && setEndTimeFn(timeArr);
		hours && setLocalStorage("endTime", timeArr);
	}; // End of decreaseHours 

	return (
		<div className="settings-tools" /* style={{ marginTop: '6em' }} */>
			<h2>END TIME TODAY</h2>
			<div className="settings-controls time-adjustment">
				<div className="time-button-row">
					<button
						className="settings-increase-time-button"
						onClick={increaseHours}
					/>
					<button
						className="settings-increase-time-button"
						onClick={() => manipulateMinutes(endTime, setEndTimeFn, 'endTime', 'increase')}
					/>
				</div>

				<p>{endTime[0] + ':' + endTime[1]}</p>
				<div className="time-button-row">
					<button
						className="settings-decrease-time-button"
						onClick={decreaseHours}
					/>
					<button
						className="settings-decrease-time-button"
						onClick={() => manipulateMinutes(endTime, setEndTimeFn, 'endTime', 'decrease')}
					/>
				</div>

			</div>
		</div>
	);
}

export default React.memo(EndTimeToday);