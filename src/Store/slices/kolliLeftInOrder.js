import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'kolliLeftInOrder',
	initialState: 0,
	reducers: {
		// actions => action handlers
		kolliLeftInOrderUpdated: (state, action) => {
			return action.payload
		}
	}
});
// console.log('slice kolliLeftInOrder', slice)

export const getKolliLeftInOrder = createSelector(
	state => state.entities.kolliLeftInOrder,
	kolliLeftInOrder => kolliLeftInOrder
)

export const { kolliLeftInOrderUpdated } = slice.actions;
export default slice.reducer;