import React from 'react';
import { getOrdersToday } from './Store/slices/kolli';
import { connect } from 'react-redux';
const OrdersToday = (props) => {
	const { ordersToday } = props;
	return (
		<div className='orders-today'>
			<span className='order-number'>{ordersToday}</span> ORDERS TODAY
		</div>
	);
}

const mapStateToProps = (state) =>
	({
		ordersToday: getOrdersToday(state),
	})

export default connect(mapStateToProps)(React.memo(OrdersToday));
