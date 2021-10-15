import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'alteredKolli',
	initialState: 0,
	reducers: {
		// actions => action handlers
		alteredKolliUpdated: (state, action) => {
			return action.payload
		},
		alteredKolliReset: (state, action) => {
			return 0
		}
	}
});
// console.log('slice alteredKolli', slice)

export const getAlteredKolli = createSelector(
	state => state.entities.alteredKolli,
	alteredKolli => alteredKolli
)

export const { alteredKolliUpdated, alteredKolliReset } = slice.actions;
export default slice.reducer;