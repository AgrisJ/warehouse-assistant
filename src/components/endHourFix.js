import React from 'react'
import { manipulateMinutes } from './../helpers';
const EndHourFix = (props) => {

	const { endTime, setEndTimeFn } = props;

	return (
		<div className="settings-tools" style={{ marginTop: '1em' }}>
			<h2>END HOUR FIX</h2>
			<div className="settings-controls">
				<button
					className="settings-prev-button"
					onClick={() => manipulateMinutes(endTime, setEndTimeFn, 'endTime', 'decrease')}
				/>
				<p>{endTime[0] + ':' + endTime[1]}</p>
				<button
					className="settings-next-button"
					onClick={() => manipulateMinutes(endTime, setEndTimeFn, 'endTime', 'increase')}
				/>
			</div>
		</div>
	);
}

export default React.memo(EndHourFix);