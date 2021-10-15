import React from 'react';
import HoursToday from './components/hoursToday';
import StartTimeToday from './components/startTimeToday';
import KolliTarget from './components/kolliTarget';
import EndTimeToday from './components/endTimeToday';

const SettingsPane = (props) => {
	return (<>
		<div className={`settings-pane ${!props.settingsOn && 'is-hidden'}`}>
			<StartTimeToday
				setStartTimeFn={props.setStartTimeFn}
				startTime={props.startTime}
			/>
			<EndTimeToday
				endTime={props.endTime}
				setEndTimeFn={props.setEndTimeFn}
			/>
			<HoursToday
				hoursToday={props.hoursToday}
				setIncreaseHoursFn={props.setIncreaseHoursFn}
				startTime={props.startTime}
				endTime={props.endTime}
				bigBreakLocation={props.bigBreakLocation}
				smallBreakLocation={props.smallBreakLocation}
			/>
			<KolliTarget />

			<button
				className="reset-button"
				onClick={() => { props.handleReset() }}
			>
				RESET
      </button>
		</div>
	</>);
}

export default React.memo(SettingsPane);