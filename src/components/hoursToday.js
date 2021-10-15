import React from 'react'
const HoursToday = (props) => {

	const { hoursToday, bigBreakLocation, smallBreakLocation } = props;


	const displayHoursToday = () => {
		const
			bigBreak = (1 / 60) * 25,
			smallBreak = (1 / 60) * 20,
			bothBreaksTaken = bigBreakLocation !== 0 && smallBreakLocation !== 0,
			smallBreakTaken = smallBreakLocation !== 0,
			bigBreakTaken = bigBreakLocation !== 0,
			variableHoursToday = hoursToday - ((!bothBreaksTaken || !smallBreakTaken || !bigBreakTaken) && (bigBreak + smallBreak));

		return variableHoursToday.toFixed(2);

	}; // End of displayHoursToday

	return (
		<div className="settings-tools">
			<h2>HOURS TODAY</h2>
			<div className="settings-controls d-flex" style={{ justifyContent: 'center' }}>
				<p>{displayHoursToday()}</p>
			</div>
		</div>
	);
}

export default React.memo(HoursToday);