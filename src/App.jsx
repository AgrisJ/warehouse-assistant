import "bootstrap/dist/css/bootstrap.min.css";
import React, { PureComponent } from 'react'
import Menu from './menu';
import Layout from './layout';
import 'bulma/css/bulma.css';
import MainInterface from './mainInterface';
import { getLocalStorage, setLocalStorage, roundUp, errorHandlingLocStorage, roundDown } from './helpers';
import Overlay from './components/overlay';
import { kolliAdded, kolliRemoved, getKolliArray, kolliReset, getOrdersToday, getLastOrder } from './Store/slices/kolli'
import { getKolliDone, kolliDoneUpdated } from "./Store/slices/kolliDone";
import { getEffectivityColor } from "./Store/slices/effectivityColor";
import { kolliTodayUpdated, getKolliToday } from "./Store/slices/kolliToday";
import { getLastPauseEntry, pauseTimeReset, getPauseOn, pauseDurationChanged, pauseEntryAdded, pauseEntryUpdated, pauseOnSet } from "./Store/slices/pauseTime";
import { doneProgressUpdated, getDoneProgress } from "./Store/slices/doneProgress";
import { currentOrderSizeUpdated, getCurrentOrderSize, currentOrderSizeReset } from "./Store/slices/currentOrderSize";
import { kolliLeftInOrderUpdated, getKolliLeftInOrder } from "./Store/slices/kolliLeftInOrder";
import { alteredKolliUpdated, getAlteredKolli, alteredKolliReset } from "./Store/slices/alteredKolli";
import { getKolliTarget, kolliTargetUpdated } from "./Store/slices/kolliTarget";
import { connect } from 'react-redux';
import { workHoursTodayUpdated } from "./Store/slices/workHoursToday";
import ReminderModal from "./services/modal";
const mainInputRef = React.createRef();
const instFbRef = React.createRef();
var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");
// const feedbackInputRef = React.createRef();
class App extends PureComponent {


	state = {
		instantBuffer: [],
		mainInput: '',
		instFbInput: '',
		hoursToday: 7,
		modified_hoursToday: 0,
		kolliTargetModifier: 0,
		settingsOn: true,
		startTime: ['15', '00'],
		endTime: ['22', '00'],
		workTime: ['00', '00', '00'],
		bigBreakLocation: 0,
		smallBreakLocation: 0,
		subtractedMinutes: 0,
		subMinutes: 0,
		pauseDurationMins: 0,
		pauseButtonPressed: false,
		showReminderModal: false,
		errors: []
	}; // End of state

	focusOnMainInput = () => {
		const mainInput = mainInputRef.current;
		mainInput.focus();
		mainInput.select();
	}; // End of focusOnMainInput

	focusOnInstantFbInput = () => {
		const instantFbInput = instFbRef.current;
		instantFbInput.focus();
		instantFbInput.select();
	}; // End of focusOnMainInput

	addOrder = () => {
		const { mainInput } = this.state,
			{ kolli } = this.props,
			kolliNotEmpty = kolli[0] === 0;
		this.props.dispatch(kolliAdded({ kolli: +mainInput }));

		if (kolliNotEmpty) {
			this.handleProgressBar();
		}

		this.setState({ instantBuffer: [] });
	}; // End of addOrder  



	handleInstantFeedback = () => {

		const { instFbInput } = this.state,
			{ kolli } = this.props,
			currentOrder = getLastOrder({ entities: this.props }),
			preparingOrder = [],
			kolliNotEmpty = kolli[0] === 0;

		if (+instFbInput < currentOrder)
			preparingOrder.push(+currentOrder - +instFbInput);

		this.setState({ instantBuffer: preparingOrder }); // Number of how many kolli are done already in the current Order

		if (kolliNotEmpty) {
			this.handleProgressBar();
			this.handleKolliDone();
		}

	}; // End of handleInstantFeedback

	handleKolliLeftInOrder = () => {
		const { instantBuffer } = this.state,
			lastOrder = getLastOrder({ entities: this.props }),
			kolliLeft = lastOrder - instantBuffer;
		this.props.dispatch(kolliLeftInOrderUpdated(kolliLeft));
	}; // End of handleKolliLeftInOrder

	handleFinishToday = () => {
		this.handleInstantFeedback();
		this.handleReset(1);

	}; // End of handleFinishToday

	setKolliToday = (input_hours) => {
		const
			{ smallBreakLocation, bigBreakLocation } = this.state,
			kolliTarget = getKolliTarget({ entities: this.props }),
			bigBreak = (1 / 60) * 25,
			smallBreak = (1 / 60) * 20,
			bothBreaksTaken = smallBreakLocation !== 0 && bigBreakLocation !== 0;

		const
			smallBreakTaken = smallBreakLocation !== 0,
			bigBreakTaken = bigBreakLocation !== 0,
			bothBreaksExcluded = () => { return ((bothBreaksTaken) ? 0 : (smallBreak + bigBreak)) },
			oneBreakTaken = smallBreakTaken ? ((input_hours - bigBreak) * kolliTarget) + 1 :
				((input_hours - smallBreak) * kolliTarget) + 1,

			calcKolliToday = (!bothBreaksTaken && (smallBreakTaken || bigBreakTaken)) ? oneBreakTaken : (input_hours - bothBreaksExcluded()) * kolliTarget;
		this.props.dispatch(kolliTodayUpdated(+roundUp(calcKolliToday)));
	}; // End of getKolliToday

	handleChange = (inputName, event) => {
		const input = event.target.value,
			{ settingsOn } = this.state;
		this.setState({ [inputName]: input });

		if (settingsOn) this.handleSettingsToggle(false);

	}; // End of handleChange

	handleClick = (inputName) => {
		// Clear input on click
		this.setState({ [inputName]: '' });
	}; // End of handleClick


	handleKeyPress = (inputName, event) => {
		if (event.key === "Enter") {
			inputName === 'mainInput' ? this.addOrder() : this.handleInstantFeedback();
			this.setState({ [inputName]: '' });
			inputName === 'mainInput' ? this.focusOnMainInput() : this.focusOnInstantFbInput();
		}
	}; // End of handleKeypress


	handleCurrentOrderSize = () => {
		const { instantBuffer } = this.state,
			{ kolli, kolliToday } = this.props,
			currentOrder = kolli[kolli.length - 1],
			realTimeKolli = instantBuffer[0] ? instantBuffer[0] : 0,
			orderSize = 100 / (kolliToday) * (currentOrder - realTimeKolli);

		this.props.dispatch(currentOrderSizeUpdated(isNaN(orderSize) ? 0 : orderSize))
	}; // End of handleCurrentOrderSize


	handleKolliDone = () => {
		const { /* kolli, */ instantBuffer } = this.state,
			{ kolli, lastOrder } = this.props,
			doneKolli = kolli.length > 1 && kolli.reduce((prev, curr) => { return prev + curr }),
			currentOrder = kolli.length > 1 && lastOrder.kolli,
			realTimeKolli = instantBuffer[0];

		if (!realTimeKolli) this.props.dispatch(kolliDoneUpdated(+doneKolli - +currentOrder));
		if (realTimeKolli) this.props.dispatch(kolliDoneUpdated(doneKolli - currentOrder + realTimeKolli));

	}; // End of getKolliDone


	handleProgressBar = () => {
		const
			{ alteredKolli, kolliToday, kolliDone } = this.props,
			doneKolli = kolliDone,
			percentage = 100 / (+kolliToday) * (doneKolli - alteredKolli);

		this.props.dispatch(doneProgressUpdated(percentage))
	};// End of handleProgressBar

	handleAlteredKolli = (minutes) => {
		const
			{ kolliTarget } = this.props,
			alteredKolli = kolliTarget / 60 * minutes;
		this.props.dispatch(alteredKolliUpdated(alteredKolli));
	}

	handleReset = (softReset = 0) => {
		const pauseTimeDefault = { entries: [], totalDuration: 0 };


		const localStorageItems = () => {
			setLocalStorage('endTime', this.state.endTime);
			setLocalStorage('startTime', this.state.startTime);
			setLocalStorage('bigBreakLocation', 0);
			setLocalStorage('smallBreakLocation', 0);
			setLocalStorage('hoursToday', this.state.hoursToday);
			setLocalStorage('subtractedMinutes', 0);
			setLocalStorage('subMinutes', 0);
			setLocalStorage('alteredKolli', 0);
			setLocalStorage('pauseTime', JSON.stringify(pauseTimeDefault));


			this.handleLocalStorageData('');
		}; //End of localStorageItems

		const stateItems = () => {
			// this.setState({ kolli: [] });
			// this.setState({ currentOrderSize: 0 });
			this.setState({ instantBuffer: 0 });
			this.setState({ bigBreakLocation: 0 });
			this.setState({ smallBreakLocation: 0 });
			this.setState({ subtractedMinutes: 0 });
			this.setState({ subMinutes: 0 });
			// this.setState({ alteredKolli: 0 });
			// this.setState({ pauseTime: pauseTimeDefault });
			this.resetEndTime();
		}; // End of stateItems

		const reduxItems = () => {
			this.props.dispatch(kolliReset());
			this.props.dispatch(pauseTimeReset());
			this.props.dispatch(currentOrderSizeReset());
			this.props.dispatch(alteredKolliReset());
		}

		if (softReset) {
			if (window.confirm('Are you FINISHED with packing today?')) {
				localStorageItems();
			}
		} else {
			if (window.confirm('Are you sure you want to RESET all your data?')) {
				localStorageItems();
				stateItems();
				reduxItems();
			}
		}

	}; // End of handleReset


	handleUndo = () => {
		const
			{ lastOrder } = this.props,
			lastKolliId = lastOrder.id;

		this.props.dispatch(kolliRemoved({ id: lastKolliId }));
		this.handleKolliDone();
	}; // End of handleUndo

	handleSettingsToggle = (value) => {
		this.setState({ settingsOn: value })
	}; // End of handleSettingsToggle

	setIncreaseHours = (hours) => {
		this.setState({ hoursToday: hours })
		this.props.dispatch(workHoursTodayUpdated(hours))
	}; // End of setIncreaseHours
	setKolliTarget = (value) => {
		this.props.dispatch(kolliTargetUpdated(value));
		// this.setState({ kolliTarget: value })
	}; // End of setIncreaseHours

	setStartTime = (hours) => {
		this.setState({ startTime: hours })
	}; // End of setStartTime

	resetEndTime = () => {
		const { startTime, hoursToday, endTime } = this.state,
			endTimeArr = endTime.slice();
		let arrayHoursEnd = ((+startTime[0] + hoursToday).toString());

		if (arrayHoursEnd.length > 2) arrayHoursEnd = arrayHoursEnd.slice(0, 2); // taking care of abnormalies

		endTimeArr[0] = arrayHoursEnd;
		endTimeArr[1] = '00';
		this.setState({ endTime: endTimeArr });
	}; // End of resetEndTime

	setEndTime = (timeArr) => {
		const { endTime } = this.state,
			endTimeArr = endTime.slice();

		if (timeArr) {
			endTimeArr[0] = (+endTimeArr[0] - 1).toString();
			endTimeArr[1] = timeArr[1];

			if (endTimeArr[1] === '00') {
				endTimeArr[0] = (+endTimeArr[0] + 1).toString();
			}
			this.setState({ endTime: timeArr });
		}

	}; // End of setStartTime

	pullTimeData = data => {
		this.setState({ workTime: data });
	}; // End of pullTimeData

	handleABreak = (breakName, manualLocation, breakSize) => {
		// PLAN: scan the STATE for all breaks and if workHour === with any Other break = say that the value exists

		const
			{ workTime } = this.state,
			workHour = +workTime[0],
			stateArr = Object.keys(this.state),
			allBreakNames = stateArr.filter(item => item.includes('BreakLocation')),
			existingLocations = (state) => {
				let res = [];
				allBreakNames.forEach(val => res.push(state[val]))
				return res.filter(val => val !== 0);
			},
			breakLocTaken = (currentLocName) => existingLocations(this.state).includes(workHour),
			sameBreakLocationExists = breakLocTaken(breakName),
			timeIsStill = workTime[0] + workTime[1] + workTime[2] === '00000';

		let
			locNr = workHour && (sameBreakLocationExists ? +existingLocations(this.state)[0] + 1 : +workHour);

		!timeIsStill && workHour && this.setState({ subtractedMinutes: this.state.subtractedMinutes - breakSize });
		!timeIsStill && workHour && this.setState({ [breakName]: locNr || manualLocation });
	}; // End of handleABreak

	breakActivation = (breakLocId, breakSize, manualLocation) => {
		const
			{ subtractedMinutes } = this.state,
			secondActivation = this.state[breakLocId] !== 0;

		if (secondActivation) {
			this.setState({ [breakLocId]: 0 });
			this.setState({ subtractedMinutes: subtractedMinutes + breakSize });
		}
		else this.handleABreak(breakLocId, manualLocation, breakSize);
	}; // End of breakActivation

	handleBigBreak = () => {
		this.breakActivation('bigBreakLocation', 25, 3);
	}; // End of handleBigBreak

	handleSmallBreak = () => {
		this.breakActivation('smallBreakLocation', 20, 2);
	}; // End of handleSmallBreak

	handleTimeChange = (minutes) => {

		const { workTime, subMinutes } = this.state,
			timeIsStill = workTime[0] + workTime[1] + workTime[2] === '00000',
			turnedNegative = (+workTime[0] === 0) && ((minutes + +workTime[1]) <= 0);

		if (!timeIsStill && !turnedNegative) {
			this.handleAlteredKolli(subMinutes + minutes);
			this.setState({ subMinutes: subMinutes + minutes });
		}
	}; // End of handleTimeChange

	handlePauseRecord = () => {
		let conslogStyles = [
			"color: #fff",
			"background-color: #444",
			"padding: 2px 4px",
			"border-radius: 2px"
		].join(';'); // TODO use these cool consolelogStyles

		const
			{ pauseTime, dispatch, lastPauseEntry } = this.props,
			pauseOn = pauseTime.pauseOn,
			noEntriesYet = lastPauseEntry.length === 0,
			oneEntryThere = lastPauseEntry.length === 1,
			allEntriesThere = lastPauseEntry.length === 2,
			now = moment().format('HH:mm:ss')

		// console.log("%cApp -> pauseOn", conslogStyles, pauseOn)

		// These have to understand the other way around because it kind of skips the first step otherwise
		if (!pauseOn) { // so normally this would be meant for 'true'
			if (oneEntryThere) dispatch(pauseEntryUpdated(now));
			else dispatch(pauseEntryAdded([now]));
		}
		if (pauseOn) { // and this for 'false'
			if (noEntriesYet || allEntriesThere) dispatch(pauseEntryAdded([now]));
			else dispatch(pauseEntryUpdated(now));
		}
	}; // End of handlePauseRecord

	pauseDurationCounter = () => {
		const
			{ pauseTime, dispatch, lastPauseEntry } = this.props,
			{ pauseButtonPressed } = this.state,
			pauseOn = pauseTime.pauseOn,
			pauseTimeObj = JSON.parse(JSON.stringify(pauseTime)),
			pauseTotDuration = pauseTimeObj.totalDuration,
			anEntry = lastPauseEntry,
			pauseHasBeenRecorded = pauseOn === false;

		let
			pauseStart = anEntry[0],
			pauseEnd = anEntry[1],
			pauseLength = 0;

		if (pauseEnd) {
			pauseStart = moment(pauseStart, 'HH:mm:ss');
			pauseEnd = moment(pauseEnd, 'HH:mm:ss');
			pauseLength = pauseEnd.diff(pauseStart, 'seconds');
		}

		dispatch(pauseDurationChanged(pauseTotDuration + pauseLength));

		const
			pauseLengthInMinutes = pauseLength / 60,/* .toFixed(3) */ // make this more accurate using moment()
			pauseDurationInMinutes = pauseTimeObj.totalDuration / 60;/* .toFixed(3) */; // make this more accurate using moment()

		if (pauseHasBeenRecorded) {
			this.handleAlteredKolli(/* this.state.subMinutes */ - +pauseDurationInMinutes);
			pauseButtonPressed && this.setState((state) => ({ subMinutes: state.subMinutes - pauseLengthInMinutes })); // Instead of totalDuration needs to use LAST Duration
		}
	}; // End of durationCounter


	handleLocalStorageData = (addedOrder = true) => {
		const SetJsonStr = (data) => JSON.stringify(data),
			{ kolli } = this.props,
			// kolli = getKolliArray({ entities: this.props }),
			cookieData = { kolli: addedOrder ? kolli : [] },
			isFirstTime = kolli.length === 0,
			localStorageIsNotThere = !getLocalStorage('cookieData');

		if (localStorageIsNotThere) {
			setLocalStorage('cookieData', SetJsonStr(cookieData));
		}

		if (!isFirstTime) setLocalStorage('cookieData', SetJsonStr(cookieData));

	} // End of handleLocalStorageData


	subtractedHoursToday = () => {
		const
			{ subtractedMinutes, hoursToday } = this.state,
			subtractedDecimalHours = +roundDown((subtractedMinutes) / 0.6) / 100,
			changedHours = +((hoursToday + subtractedDecimalHours).toFixed(2));

		this.setState(({ modified_hoursToday: changedHours }));
		this.setKolliToday(changedHours);
	}; //End of subtractedHoursToday


	useHoursToday = () => {
		const
			{ hoursToday, modified_hoursToday, smallBreakLocation, bigBreakLocation } = this.state,
			bothBreaksTaken = bigBreakLocation !== 0 && smallBreakLocation !== 0,
			smallBreakTaken = smallBreakLocation !== 0,
			bigBreakTaken = bigBreakLocation !== 0,
			choosingHours = ((!bothBreaksTaken || !smallBreakTaken || !bigBreakTaken) ? hoursToday : modified_hoursToday);

		return choosingHours;

	}

	pauseButtonPressed = (value) => {
		this.setState({ pauseButtonPressed: value });
	}

	handleReminderModal = bool => {
		this.setState({ showReminderModal: bool });
	}

	componentDidMount() {
		console.log('%cthis.props', 'font-size:1.6em; color:orange;', { props: this.props, getState: { entities: this.props } })

		this.handleLocalStorageData();
		this.focusOnMainInput();
		this.setKolliToday(this.useHoursToday());
		this.subtractedHoursToday();


		// ErrorHandling for those that use JSON.parse
		errorHandlingLocStorage('cookieData', { kolli: [] });
		errorHandlingLocStorage('pauseTime', { entries: [], totalDuration: 0 });

		const
			isStored = (value) => getLocalStorage(value),
			localStorageData = JSON.parse(getLocalStorage('cookieData')),
			storedStartTime = isStored("startTime") && getLocalStorage("startTime").split(','),
			storedEndTime = isStored("endTime") && getLocalStorage("endTime").split(','),
			storedBigBreakLoc = isStored("bigBreakLocation") && +getLocalStorage("bigBreakLocation"),
			storedSmallBreakLoc = isStored("smallBreakLocation") && +getLocalStorage("smallBreakLocation"),
			storedSubMinutes = isStored("subtractedMinutes") && +getLocalStorage("subtractedMinutes"),
			storedAlteredKolli = isStored("alteredKolli") && +getLocalStorage("alteredKolli"),
			storedSubMin = isStored("subMinutes") && +getLocalStorage("subMinutes"),
			storedKolliTarget = isStored("kolliTarget") && +getLocalStorage("kolliTarget"),
			storedPauseTime = isStored("pauseTime") && JSON.parse(getLocalStorage("pauseTime"));

		isStored("hoursToday") && this.props.dispatch(workHoursTodayUpdated(Number(getLocalStorage("hoursToday"))));
		isStored("hoursToday") && this.setState({ hoursToday: Number(getLocalStorage("hoursToday")) });
		isStored("hoursToday") && this.setState({ modified_hoursToday: Number(getLocalStorage("hoursToday")) });
		isStored("startTime") && this.setState({ startTime: storedStartTime });
		isStored("endTime") && this.setState({ endTime: storedEndTime });
		isStored("bigBreakLocation") && this.setState({ bigBreakLocation: storedBigBreakLoc });
		isStored("smallBreakLocation") && this.setState({ smallBreakLocation: storedSmallBreakLoc });
		isStored("subtractedMinutes") && this.setState({ subtractedMinutes: storedSubMinutes });
		isStored("subMinutes") && this.setState({ subMinutes: storedSubMin });

		isStored("alteredKolli") && this.props.dispatch(alteredKolliUpdated(storedAlteredKolli));
		isStored("kolliTarget") && this.props.dispatch(kolliTargetUpdated(storedKolliTarget));
		isStored("pauseTime") && this.props.dispatch(pauseOnSet(storedPauseTime.pauseOn))

		const mapLocStorToRedux = (localStorageArray, objKey, storeAction, isObj) => {
			const
				actionDispatch = this.props.dispatch,
				localStObjectExist = localStorageArray,
				storedDataInLocalStorage = localStObjectExist && localStorageArray[objKey].length > 0
			if (storedDataInLocalStorage) localStorageArray[objKey].map(
				entry => {
					actionDispatch(
						storeAction(isObj ? { [objKey]: entry } : entry)
					)
				})
		}

		mapLocStorToRedux(localStorageData, 'kolli', kolliAdded, true)
		mapLocStorToRedux(storedPauseTime, 'entries', pauseEntryAdded)
		mapLocStorToRedux(storedPauseTime, 'totalDuration', pauseDurationChanged)




	}; // End of CDM


	componentDidUpdate(prevProps, prevState) {
		const
			pauseOnChanged = prevProps.pauseTime.pauseOn !== this.props.pauseTime.pauseOn,
			pauseDurationChanged = prevProps.pauseTime.totalDuration !== this.props.pauseTime.totalDuration,
			{ pauseButtonPressed } = this.state;

		if (pauseOnChanged) pauseButtonPressed && this.handlePauseRecord()
		if (prevProps.pauseTime.entries !== this.props.pauseTime.entries) {
			this.pauseDurationCounter()
			pauseButtonPressed && setLocalStorage('pauseTime', JSON.stringify(this.props.pauseTime));
		}
		if (pauseDurationChanged) pauseButtonPressed && setLocalStorage('pauseTime', JSON.stringify(this.props.pauseTime));

		if (prevProps.kolli !== this.props.kolli) {
			const currentOrder = getLastOrder({ entities: this.props });
			this.handleKolliDone();
			this.handleCurrentOrderSize();
			this.handleLocalStorageData();
			this.props.dispatch(kolliLeftInOrderUpdated(currentOrder || 0));
		}

		if (prevProps.kolliDone !== this.props.kolliDone) {
			this.handleProgressBar();
		}

		if (prevState.startTime !== this.state.startTime) {
			const { endTime, startTime } = this.state,
				startTimeMinutes = (+startTime[1]) / 60,
				endTimeMinutes = (+endTime[1]) / 60,
				calculatedHoursToday = +endTime[0] - +startTime[0],
				variableHoursToday = calculatedHoursToday - startTimeMinutes + endTimeMinutes;
			this.props.dispatch(workHoursTodayUpdated(variableHoursToday))
			this.setState({ hoursToday: variableHoursToday });
			this.setEndTime();
		}
		if (prevState.endTime !== this.state.endTime) {
			const { endTime, startTime } = this.state,
				startTimeMinutes = (+startTime[1]) / 60,
				endTimeMinutes = (+endTime[1]) / 60,
				calculatedHoursToday = +endTime[0] - +startTime[0],
				variableHoursToday = calculatedHoursToday - startTimeMinutes + endTimeMinutes;
			this.props.dispatch(workHoursTodayUpdated(variableHoursToday))
			this.setState({ hoursToday: variableHoursToday });
			setLocalStorage("endTime", this.state.endTime);
		}
		if (prevState.bigBreakLocation !== this.state.bigBreakLocation) {
			setLocalStorage("bigBreakLocation", this.state.bigBreakLocation);
		}
		if (prevState.smallBreakLocation !== this.state.smallBreakLocation) {
			setLocalStorage("smallBreakLocation", this.state.smallBreakLocation);
		}
		if (prevProps.kolliToday !== this.props.kolliToday) {
			this.handleCurrentOrderSize();
			this.handleProgressBar();

		}
		if (this.state.instantBuffer.length > 0 && (prevState.instantBuffer[0] !== this.state.instantBuffer[0])) {
			this.handleKolliDone();
			this.handleCurrentOrderSize();
			this.handleKolliLeftInOrder();
		}

		if (prevState.smallBreakLocation !== this.state.smallBreakLocation ||
			prevState.bigBreakLocation !== this.state.bigBreakLocation
		) {
			const { subtractedMinutes } = this.state;

			this.setState({ subtractedMinutes: subtractedMinutes });
		}

		if (prevState.subtractedMinutes !== this.state.subtractedMinutes) {
			this.subtractedHoursToday();
			setLocalStorage("subtractedMinutes", this.state.subtractedMinutes);
		}

		if (prevState.hoursToday !== this.state.hoursToday) {
			this.setKolliToday(this.useHoursToday());
			this.subtractedHoursToday();
		}
		if (prevProps.kolliTarget !== this.props.kolliTarget) {
			this.setKolliToday(this.useHoursToday());
		}

		if (prevProps.alteredKolli !== this.props.alteredKolli) {
			if (this.props.alteredKolli !== 0) {
				this.handleProgressBar();
				setLocalStorage("alteredKolli", this.props.alteredKolli);
			}
		}
		if (prevState.subMinutes !== this.state.subMinutes) {
			setLocalStorage("subMinutes", this.state.subMinutes);

		}

	}; //End of CDU


	render() {
		const { mainInput, settingsOn, startTime, pauseButtonPressed,
			bigBreakLocation, smallBreakLocation, endTime, instFbInput,
			modified_hoursToday, subMinutes, subtractedMinutes, hoursToday } = this.state;

		const allProps =
		{
			hoursToday,
			bigBreakLocation: bigBreakLocation,
			endTime: endTime,
			instFbInput: instFbInput,
			instFbRef: instFbRef,
			mainInput: mainInput,
			mainInputRef: mainInputRef,
			modified_hoursToday: modified_hoursToday,
			pauseButtonPressed,
			settingsOn: settingsOn,
			smallBreakLocation: smallBreakLocation,
			startTime: startTime,
			subMinutes: subMinutes,
			subtractedMinutes: subtractedMinutes,

			addOrder: this.addOrder,
			handleBigBreak: this.handleBigBreak,
			handleChange: this.handleChange,
			handleChangeInstantFb: this.handleChangeInstantFb,
			handleClick: this.handleClick,
			handleFinishTodayFn: this.handleFinishToday,
			handleInstantFeedback: this.handleInstantFeedback,
			handleKeyPress: this.handleKeyPress,
			handlePauseRecordFn: this.handlePauseRecord,
			handleReset: this.handleReset,
			handleSettingsToggle: this.handleSettingsToggle,
			handleSmallBreak: this.handleSmallBreak,
			handleTimeChangeFn: this.handleTimeChange,
			handleUndo: this.handleUndo,
			hoursToday: this.useHoursToday(),
			pauseButtonPressed: this.pauseButtonPressed,
			pullTimeData: this.pullTimeData,
			setEndTimeFn: this.setEndTime,
			setIncreaseHoursFn: this.setIncreaseHours,
			setKolliTargetFn: this.setKolliTarget,
			setStartTimeFn: this.setStartTime
		}; //End of allProps
		return (<>
			<ReminderModal
				showModal={this.state.showReminderModal}
				// modalText={`Today is the LAST day to write your 2 songs for the work radio Playlist!`}
				// additionalText={`For more info see the POSTER at the office or find Agris`}
				modalText={`I dag er den SISTE dag at skrive dine 2 sange til arbejdsradioens afspilningsliste!`}
				additionalText={`For mere information se PLAKATEN på kontoret eller find Agris`}
				activateOk={() => this.handleReminderModal(false)}
			/>
			<Overlay {...allProps} />
			<Menu {...allProps} />
			<Layout {...allProps}>
				<MainInterface {...allProps} />
			</Layout>
		</>);
	}
}
const mapStateToProps = (state) =>
({
	alteredKolli: getAlteredKolli(state),
	currentOrderSize: getCurrentOrderSize(state),
	doneProgress: getDoneProgress(state),
	effectivityColor: getEffectivityColor(state),
	kolli: getKolliArray(state),
	kolliDone: getKolliDone(state),
	kolliLeftInOrder: getKolliLeftInOrder(state),
	kolliTarget: getKolliTarget(state),
	kolliToday: getKolliToday(state),
	lastOrder: getLastOrder(state),
	pauseTime: state.entities.pauseTime,
	lastPauseEntry: getLastPauseEntry(state)
})






// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(App);