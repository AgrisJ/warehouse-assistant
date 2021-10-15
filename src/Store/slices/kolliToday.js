import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'kolliToday',
	initialState: null,
	reducers: {
		// actions => action handlers
		kolliTodayUpdated: (state, action) => {
			return action.payload
		}
	}
});
// console.log('slice kolliToday', slice)

export const getKolliToday = createSelector(
	state => state.entities.kolliToday,
	kolliToday => kolliToday
)

export const { kolliTodayUpdated } = slice.actions;
export default slice.reducer;