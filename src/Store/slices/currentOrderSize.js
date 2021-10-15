import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'currentOrderSize',
	initialState: null,
	reducers: {
		// actions => action handlers
		currentOrderSizeUpdated: (state, action) => {
			return action.payload
		},
		currentOrderSizeReset: (orders, action) => {
			return 0
		}
	}
});

export const getCurrentOrderSize = createSelector(
	state => state.entities.currentOrderSize,
	currentOrderSize => currentOrderSize
)

export const { currentOrderSizeUpdated, currentOrderSizeReset } = slice.actions;
export default slice.reducer;