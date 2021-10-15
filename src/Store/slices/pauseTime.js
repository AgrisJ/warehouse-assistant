import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'pauseTime',
	initialState: { entries: [], totalDuration: 0, pauseOn: false },
	reducers: {
		// actions => action handlers
		pauseEntryAdded: (state, action) => {
			state.entries.push(
				action.payload
			)
		},
		pauseEntryUpdated: (state, action) => {
			state.entries[state.entries.length - 1] && state.entries[state.entries.length - 1].push(
				action.payload
			)
		},
		pauseOnChanged: (state, action) => {
			console.log('state.pauseOn', state.pauseOn)
			state.pauseOn = !state.pauseOn
		},
		pauseOnSet: (state, action) => {
			console.log('pauseOnSet state.pauseOn', state.pauseOn)
			state.pauseOn = action.payload
		},
		pauseDurationChanged: (state, action) => {
			state.totalDuration = action.payload
		},
		pauseTimeReset: (orders, action) => {
			return { entries: [], totalDuration: 0, pauseOn: false }
		}
	}
});

export const getPauseDuration = createSelector(
	state => state.entities.pauseTime.totalDuration,
	totalDuration => totalDuration
)
export const getLastPauseEntry = createSelector(
	state => state.entities.pauseTime.entries,
	entries => entries[entries.length - 1] || []
)
export const getPauseOn = createSelector(
	state => state.entities.pauseTime.pauseOn,
	pauseOn => pauseOn
)

export const { pauseEntryAdded, pauseEntryUpdated, pauseOnChanged, pauseDurationChanged, pauseTimeReset, pauseOnSet } = slice.actions;
export default slice.reducer;