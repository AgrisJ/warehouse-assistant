import { createSelector, createSlice } from '@reduxjs/toolkit';
let lastId = 0;

const slice = createSlice({
	name: 'kolli',
	initialState: [],
	reducers: {
		// actions => action handlers
		kolliAdded: (orders, action) => {
			orders.push({
				id: ++lastId,
				kolli: action.payload.kolli
			})
		},
		kolliRemoved: (orders, action) => {
			return orders.filter(order => order.id !== action.payload.id);
		},
		kolliReset: (orders, action) => {
			return []
		}
	}
});


export const getKolliArray = createSelector(
	state => state.entities.kolli,
	kolli => kolli.reduce((acc, cur) => { acc.push(cur.kolli); return acc }, []) || null
)
export const getOrdersToday = createSelector(
	state => state.entities.kolli,
	kolli => kolli.length
)
export const getLastOrder = createSelector(
	state => state.entities.kolli,
	kolli => kolli[kolli.length - 1]
)

export const { kolliAdded, kolliRemoved, kolliReset } = slice.actions;
export default slice.reducer;





