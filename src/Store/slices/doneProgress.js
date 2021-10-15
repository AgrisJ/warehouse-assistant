import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'doneProgress',
	initialState: null,
	reducers: {
		// actions => action handlers
		doneProgressUpdated: (state, action) => {
			return action.payload
		}
	}
});

export const getDoneProgress = createSelector(
	state => state.entities.doneProgress,
	doneProgress => doneProgress
)

export const { doneProgressUpdated } = slice.actions;
export default slice.reducer;