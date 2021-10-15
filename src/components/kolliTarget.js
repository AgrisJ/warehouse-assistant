import React, { useEffect } from 'react'
import { useState } from 'react';
import { setLocalStorage } from '../helpers';
import { connect } from 'react-redux';
import { getKolliTarget, kolliTargetUpdated } from './../Store/slices/kolliTarget';
const KolliTarget = (props) => {


	const { kolliTarget, dispatch } = props;
	const [{ kolliTargetState }, setKolliTargetState] = useState({ kolliTargetState: kolliTarget });

	useEffect(() => {
		setKolliTargetState({ kolliTargetState: kolliTarget })
	}, [kolliTarget])

	const increaseTarget = () => {
		const points = kolliTargetState,
			increase = points + 1;
		setKolliTargetState({ kolliTargetState: increase });
		dispatch(kolliTargetUpdated(increase));
		setLocalStorage("kolliTarget", increase);
	}
	const decreaseTarget = () => {
		const points = kolliTargetState,
			decrease = points - 1,
			isNotNegative = points;

		if (isNotNegative) {
			setKolliTargetState({ kolliTargetState: decrease });
			dispatch(kolliTargetUpdated(decrease));
			setLocalStorage("kolliTarget", decrease);
		}
	}





	return (
		<div className="settings-tools" /* style={{ marginTop: '6em' }} */ >
			<h2>KOLLI TARGET/H</h2>
			<div className="settings-controls">
				<button
					className="settings-prev-button"
					onClick={decreaseTarget}
				/>
				<p>{kolliTargetState}</p>
				<button
					className="settings-next-button"
					onClick={increaseTarget}
				/>
			</div>
		</div>
	);
}

const mapStateToProps = (state) =>
({
	kolliTarget: getKolliTarget(state)
})

export default connect(mapStateToProps)(React.memo(KolliTarget));