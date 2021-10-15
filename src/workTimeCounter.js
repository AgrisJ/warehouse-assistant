import React from 'react'
import { useState, useEffect } from "react";
import { useInterval } from './services/useInterval';
import { getKolliDone } from './Store/slices/kolliDone';
import { getKolliTarget } from './Store/slices/kolliTarget';
import { connect } from 'react-redux';
import { effectivityColorUpdated, getEffectivityColor } from './Store/slices/effectivityColor';
import { getPauseOn } from './Store/slices/pauseTime';
var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");

const WorkTimeCounter = (props) => {
	/**
			* How time functions should work:
			* [+] startTime is set in the state: ["16", "00"];
			* [+] runningCounter() should be always running while telling how much time has passed since startTime;
			* [+] Hours, Minutes and Seconds should be seperated in the state (to make it visually adjustable)
			* [+] timeController() should track the current time and start counting workTime only when it is passed the startTime
			* [+] timeController() should expand isWorkingTime to minutes 
			* [+] effectivityController() should be always running while telling the Effectivity
			* [+] formattedStartTime() subtracts or adds min from the timeController()
			* [+] props.subtractedMinutes should be settled with localStorage
			* [+] pauseTimeFunction() records the length of the pause by user input (pressing the pause button)
			* [+] Subtract pauseTime duration from the total Worktime 
			* [+] Make a pauseScreen
			* [+] Incorporate pauseTime in Ticks too
			*/
	function timeToDecimal(res) {
		res = res / 60;
		res = parseFloat(res).toFixed(4);
		res = parseFloat(res);
		return res;
	}

	const
		[{ currentColor }, setCurrentColor] = useState({ currentColor: '#dedede' }),
		[{ changingClass }, setChangingClass] = useState({ changingClass: '' }),
		[{ behindOrAhead }, setBehindOrAhead] = useState({ behindOrAhead: '' }),
		[{ delay }, setDelay] = useState({ delay: 1000 }),
		[{ isRunning }, setIsRunning] = useState({ isRunning: false }),
		[{ _hours }, set_hours] = useState({ _hours: "0" }),
		[{ _minutes }, set_minutes] = useState({ _minutes: "00" }),
		[{ _seconds }, set_seconds] = useState({ _seconds: "00" }),
		[{ _minutesPassed }, set_minutesPassed] = useState({ _minutesPassed: "00" });

	const { kolliDone, kolliTarget } = props;

	const timeController = () => {
		const now = moment(),
			{ startTime, endTime, pauseOn } = props,
			format = 'H:mm:ss',
			isWorkingTime = moment(now, format)
				.isBetween(moment(`${startTime[0]}:${startTime[1]}:00`, format),
					moment(`${endTime[0]}:${endTime[1]}:01`, format));

		if (isWorkingTime && !pauseOn)
			setIsRunning({ isRunning: true });
		else setIsRunning({ isRunning: false });

	}; // End of timeController

	const runningCounter = () => {
		const formattedStartTime = (minutes = 0) => {
			const format = 'H:mm',
				startTimeMoment = moment(`${+startTime[0]}:${+startTime[1]}`, format),
				formatedMinutes = Number(+minutes /* - +pauseDuration */).toFixed(2),
				timeDuration = moment.duration(formatedMinutes, 'minutes'),
				timeSubtraction = startTimeMoment.subtract(timeDuration);

			return timeSubtraction;
		};


		let now = moment();
		const { startTime, subtractedMinutes, subMinutes } = props,
			startTimeMoment = moment(formattedStartTime(subtractedMinutes + subMinutes), 'Hmmss'),
			countStart = now.diff(startTimeMoment, "milliseconds"),
			countedWorkTime = moment(countStart).utc();


		set_hours({ _hours: countedWorkTime.format('H') });
		set_minutes({ _minutes: countedWorkTime.format('mm') });
		set_seconds({ _seconds: countedWorkTime.format('ss') });
		set_minutesPassed({ _minutesPassed: moment.duration(now.diff(startTimeMoment, "minutes"), "minutes").format('mm') });
	}; //End of runningCounter()


	const colorIndications = () => {
		let
			colorValue = '#000',
			fixedClass = 'effectivity-number';

		const
			effectivityColor = currentColor,
			wonderGoal = kolliTarget + 50, // need to convert this to percentage
			almostWonderGoal = kolliTarget + 30, // this too
			softGoal = kolliTarget - 15, // this too
			timePassed = timeToDecimal(+_minutesPassed),
			effectivity = parseFloat(kolliDone / (timePassed)).toFixed(0);

		if (effectivity >= wonderGoal) {
			setChangingClass({ changingClass: `highestGoal ${fixedClass}` });
			setBehindOrAhead({ behindOrAhead: 'AHEAD' });
			colorValue = 'linear-gradient(0deg, #440c67 0%, #bf8eff 100%)';
			if (effectivityColor !== colorValue)
				setCurrentColor({ currentColor: colorValue });

		} else if (effectivity >= almostWonderGoal) {
			setChangingClass({ changingClass: `almostHighestGoal ${fixedClass}` });
			setBehindOrAhead({ behindOrAhead: 'AHEAD' });
			colorValue = 'linear-gradient(0deg, #84185e 0%, #ff91ec 100%)';
			if (effectivityColor !== colorValue)
				setCurrentColor({ currentColor: colorValue });

		} else if (effectivity >= kolliTarget) {
			setChangingClass({ changingClass: `primaryGoal ${fixedClass}` });
			setBehindOrAhead({ behindOrAhead: 'AHEAD' });
			colorValue = 'linear-gradient(0deg, #127121 0%, #84af3e 100%)';
			if (effectivityColor !== colorValue)
				setCurrentColor({ currentColor: colorValue });

		} else if (effectivity >= softGoal) {
			setChangingClass({ changingClass: `warningGoal ${fixedClass}` });
			setBehindOrAhead({ behindOrAhead: 'BEHIND' });
			colorValue = 'linear-gradient(0deg, #846d1c 0%, #f2c94c 100%)';
			if (effectivityColor !== colorValue)
				setCurrentColor({ currentColor: colorValue });

		} else {
			setChangingClass({ changingClass: `dangerGoal ${fixedClass}` });
			setBehindOrAhead({ behindOrAhead: 'BEHIND' });
			colorValue = 'linear-gradient(0deg, #841c1c 0%, #ff5f5f 100%)';
			if (effectivityColor !== colorValue)
				setCurrentColor({ currentColor: colorValue });
		}

	};//End of colorIndications



	const
		timePassed = timeToDecimal(+_minutesPassed),
		effectivity = parseFloat(kolliDone / (timePassed)).toFixed(0);

	const effectivityController = () => {
		return (
			<div className={changingClass}>{isNaN(effectivity) || effectivity < 0 ? 0 : effectivity}<span style={{ fontSize: '12px', fontWeight: 'normal' }}> KOLLI/H</span></div>
		);
	}; // End of effectivityController


	const aheadOrBehindCalculations = () => {
		const
			timePassed = timeToDecimal(+_minutesPassed),
			hoursPassed = +_minutesPassed / 60,
			effectivity = parseFloat(kolliDone / (timePassed)).toFixed(0),
			kolliHourDiff = effectivity - kolliTarget,
			kolliDifference = Math.abs(+parseFloat(kolliHourDiff * hoursPassed).toFixed(0)),
			minutesDifference = Math.abs(+parseFloat(kolliDifference / kolliTarget * 60).toFixed(0));

		return (function () {
			return {
				kolliDifference,
				minutesDifference
			}
		})();
	};


	useEffect(() => {
		colorIndications();
		props.dispatch(effectivityColorUpdated(currentColor))
	}, [currentColor, effectivity, _minutesPassed])



	/**
	 ******* RealTime runners: intervals running each second *********
	 */

	useInterval(
		() => {
			runningCounter();
		},
		isRunning ? delay : null

	); // End of useInterval()


	useInterval(
		() => {
			aheadOrBehindCalculations()
			timeController();
			effectivityController();
			props.pullTimeData([_hours, _minutes, _seconds]);
		},
		true ? delay : null // always running - to follow the real time

	); // End of useInterval()


	return (
		<>
			<div className="work-time-counter">
				<p>YOUR WORK TIME</p>
				{_hours}:{_minutes}<span style={{ display: 'contents', fontSize: '20px' }}>:{_seconds}</span>
				{effectivityController()}
			</div>
			<div className={"behind-ahead-indicator " + changingClass}>
				<p>YOU ARE</p>
				<p><span>{behindOrAhead}</span></p>
				<p>--------------------</p>
				<p><span>{aheadOrBehindCalculations().minutesDifference + 'min'}</span>{' (' + aheadOrBehindCalculations().kolliDifference + ' kolli)'}</p>
			</div>
		</>
	);
}


const mapStateToProps = (state) =>
	({
		kolliDone: getKolliDone(state),
		kolliTarget: getKolliTarget(state),
		effectivityColor: getEffectivityColor(state),
		pauseOn: getPauseOn(state)
	})

export default connect(mapStateToProps)(React.memo(WorkTimeCounter));

