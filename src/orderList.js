import React from 'react';
import { connect } from 'react-redux';
import { getKolliArray } from './Store/slices/kolli';

const OrderList = (props) => {
	const { kolli } = props;

	return (
		<div className="orderList">{

			kolli.map((order, i, arr) => {

				const currOrderIndex = arr.length - 1;
				if (currOrderIndex === i) return <li key={i.toString()} className='current-order'>{order}</li>;
				else return <li key={i.toString()}>{order}</li>;

			})}</div>
	);
}

const mapStateToProps = (state) =>
	({
		kolli: getKolliArray(state)
	})

export default connect(mapStateToProps)(React.memo(OrderList));