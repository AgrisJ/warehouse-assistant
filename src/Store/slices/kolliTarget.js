import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'kolliTarget',
	initialState: 158,
	reducers: {
		// actions => action handlers
		kolliTargetUpdated: (state, action) => {
			return action.payload
		}
	}
});
// console.log('slice kolliTarget', slice)

export const getKolliTarget = createSelector(
	state => state.entities.kolliTarget,
	kolliTarget => kolliTarget
)

export const { kolliTargetUpdated } = slice.actions;
export default slice.reducer;