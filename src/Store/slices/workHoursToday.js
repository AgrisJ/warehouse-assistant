import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'workHoursToday',
	initialState: null,
	reducers: {
		// actions => action handlers
		workHoursTodayUpdated: (state, action) => {
			return action.payload
		}
	}
});
// console.log('slice workHoursToday', slice)

export const getWorkHoursToday = createSelector(
	state => state.entities.workHoursToday,
	workHoursToday => workHoursToday
)

export const { workHoursTodayUpdated } = slice.actions;
export default slice.reducer;