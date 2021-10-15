import { combineReducers } from 'redux';
import kolliReducer from '../slices/kolli';
import kolliDoneReducer from '../slices/kolliDone';
import kolliTodayReducer from '../slices/kolliToday';
import kolliTargetReducer from '../slices/kolliTarget';
import kolliLeftInOrderReducer from '../slices/kolliLeftInOrder';
import alteredKolliReducer from '../slices/alteredKolli';
import pauseTimeReducer from '../slices/pauseTime';
import effectivityColorReducer from '../slices/effectivityColor';
import doneProgressReducer from '../slices/doneProgress';
import currentOrderSizeReducer from '../slices/currentOrderSize';
import workHoursTodayReducer from '../slices/workHoursToday';

export default combineReducers({
	kolli: kolliReducer,
	kolliDone: kolliDoneReducer,
	kolliToday: kolliTodayReducer,
	kolliTarget: kolliTargetReducer,
	kolliLeftInOrder: kolliLeftInOrderReducer,
	alteredKolli: alteredKolliReducer,
	pauseTime: pauseTimeReducer,
	effectivityColor: effectivityColorReducer,
	doneProgress: doneProgressReducer,
	currentOrderSize: currentOrderSizeReducer,
	workHoursToday: workHoursTodayReducer

});