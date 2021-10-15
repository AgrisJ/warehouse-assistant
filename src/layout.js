// import React, { Component } from 'react'
import React from 'react';
import SettingsPane from './settingsPane';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react';
import { pauseOnChanged } from './Store/slices/pauseTime';
import { connect } from 'react-redux';
const pauseIcon = <FontAwesomeIcon icon={faPause} />

const Layout = (props) => {
	const [{ bigBreakHidden, smallBreakHidden }, setBreakState] = useState({ bigBreakHidden: '', smallBreakHidden: '' })

	const deactivateBreak = (breakName) => {
		const
			BreakName = breakName.charAt(0).toUpperCase() + breakName.slice(1),
			handleBreakFunction = props['handle' + BreakName];

		setBreakState(prevState => { return { ...prevState, [breakName + 'Hidden']: '' } });
		handleBreakFunction();
	}; // End of deactivateBreak

	useEffect(() => {
		if (props.bigBreakLocation !== 0) setBreakState(prevState => { return { ...prevState, bigBreakHidden: 'visuallyhidden' } });
		else setBreakState(prevState => { return { ...prevState, bigBreakHidden: '' } });
	}, [props.bigBreakLocation])

	useEffect(() => {
		if (props.smallBreakLocation !== 0) setBreakState(prevState => { return { ...prevState, smallBreakHidden: 'visuallyhidden' } });
		else setBreakState(prevState => { return { ...prevState, smallBreakHidden: '' } });
	}, [props.smallBreakLocation])



	const { hoursToday, setIncreaseHoursFn, setStartTimeFn, handleReset, settingsOn, startTime,
		handleSmallBreak, bigBreakLocation, smallBreakLocation, dispatch,
		handleBigBreak, endTime, setEndTimeFn, kolliTarget, setKolliTargetFn, handleTimeChangeFn,
		handleFinishTodayFn, handlePauseRecordFn, subMinutes } = props;

	const isActive_bigBreak = bigBreakHidden !== 'visuallyhidden';
	const isActive_smallBreak = smallBreakHidden !== 'visuallyhidden';

	return (
		<>
			<div className="container">
				<div className="left-side">

				</div>
				{props.children}
				<div className="right-side">
					<SettingsPane
						hoursToday={hoursToday}
						setIncreaseHoursFn={setIncreaseHoursFn}
						setStartTimeFn={setStartTimeFn}
						handleReset={handleReset}
						settingsOn={settingsOn}
						startTime={startTime}
						endTime={endTime}
						setEndTimeFn={setEndTimeFn}
						bigBreakLocation={bigBreakLocation}
						smallBreakLocation={smallBreakLocation}
					/>
					<div className="break-time-panel">
						<button
							className="button has-text-grey-lighter record-pause-button"
							onClick={() => {
								props.pauseButtonPressed(true);
								dispatch(pauseOnChanged());
							}}>{pauseIcon}
						</button>
						<AdjustedMinutesDisplay subMinutes={subMinutes} />
						<button
							className={"button adjust-time-button "}
							onClick={() => {
								handleTimeChangeFn(5);
							}}>+5min
                        </button>
						<button
							className={"button adjust-time-button "}
							onClick={() => {
								handleTimeChangeFn(-5);
							}}>-5min
                        </button>


						<button
							className={"button break-button " + bigBreakHidden}
							onClick={() => {
								isActive_bigBreak && handleBigBreak();
								!isActive_bigBreak && deactivateBreak('bigBreak');
							}}>-25min
                        </button>
						<button
							className={"button break-button " + smallBreakHidden}
							onClick={() => {
								isActive_smallBreak && handleSmallBreak();
								!isActive_smallBreak && deactivateBreak('smallBreak');
							}}>-20min
                        </button>
						<button
							className={"finish-today-button "}
							onClick={() => {
								handleFinishTodayFn();
							}}>Finish today
                        </button>
					</div>


				</div>
			</div>
		</>
	);
}


const mapStateToProps = (state) =>
	({ pauseTime: state.entities.pauseTime })

export default connect(mapStateToProps)(React.memo(Layout));

function AdjustedMinutesDisplay(props) {
	const
		minutes = props.subMinutes.toFixed(2),
		plusOrMinus = minutes > 0 ? '+' : '',
		isVisible = minutes !== '0.00',
		styling = {
			marginBottom: '-1em',
			opacity: isVisible ? '1' : '0'
		};

	return (
		<div className='container adjusted-mins' style={styling}>
			{plusOrMinus + minutes + ' min'}
		</div>
	);
}