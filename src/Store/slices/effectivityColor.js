import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'effectivityColor',
	initialState: '#000',
	reducers: {
		// actions => action handlers
		effectivityColorUpdated: (state, action) => {
			return action.payload
		}

	}
});

export const getEffectivityColor = createSelector(
	state => state.entities.effectivityColor,
	effectivityColor => effectivityColor
)

export const { effectivityColorUpdated/* , effectivityColorLoaded */ } = slice.actions;
export default slice.reducer;