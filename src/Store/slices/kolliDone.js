import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'kolliDone',
	initialState: 0,
	reducers: {
		// actions => action handlers
		kolliDoneUpdated: (state, action) => {
			return action.payload
		}
	}
});
// console.log('slice kolliDone', slice)

export const getKolliDone = createSelector(
	state => state.entities.kolliDone,
	kolliDone => kolliDone
)

export const { kolliDoneUpdated } = slice.actions;
export default slice.reducer;