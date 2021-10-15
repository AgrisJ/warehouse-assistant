import React from 'react'
import { setLocalStorage } from '../helpers';
import { manipulateMinutes } from './../helpers';
const StartTimeToday = (props) => {

	const { setStartTimeFn, startTime } = props;

	const increaseHours = () => {
		const hours = +startTime[0],
			increase = hours + 1,
			timeArr = startTime.slice();

		timeArr.shift();
		timeArr.unshift(increase.toString())

		increase < 24 && setStartTimeFn(timeArr);
		increase < 24 && setLocalStorage("startTime", timeArr);
	}; // End of increaseHours

	const decreaseHours = () => {
		const hours = +startTime[0],
			decrease = hours - 1,
			timeArr = startTime.slice();

		timeArr.shift();
		timeArr.unshift(decrease.toString())

		hours && setStartTimeFn(timeArr);
		hours && setLocalStorage("startTime", timeArr);
	}; // End of decreaseHours 

	return (
		<div className="settings-tools" /* style={{ marginTop: '6em' }} */>
			<h2>START TIME TODAY</h2>
			<div className="settings-controls time-adjustment">
				<div className="time-button-row">
					<button
						className="settings-increase-time-button"
						onClick={increaseHours}
					/>
					<button
						className="settings-increase-time-button"
						onClick={() => manipulateMinutes(startTime, setStartTimeFn, 'startTime', 'increase')}
					/>
				</div>

				<p>{startTime[0] + ':' + startTime[1]}</p>
				<div className="time-button-row">
					<button
						className="settings-decrease-time-button"
						onClick={decreaseHours}
					/>
					<button
						className="settings-decrease-time-button"
						onClick={() => manipulateMinutes(startTime, setStartTimeFn, 'startTime', 'decrease')}
					/>
				</div>

			</div>
		</div>
	);
}

export default React.memo(StartTimeToday);