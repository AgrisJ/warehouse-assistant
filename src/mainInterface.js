import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useRef } from 'react';
import KolliInput from './kolliInput';
import OrdersToday from './ordersToday';
import CenterPiece from './centerPiece';
import OrderList from './orderList';
import KolliTicks from './kolliTicks';
import InstantFeedbackInput from "./instantFeedbackInput";
import WorkTimeCounter from './workTimeCounter';

const MainInterface = (props) => {
	const
		{ mainInput, mainInputRef, handleChange, handleClick, instFbInput,
			handleKeyPress, handleInstantFeedback, modified_hoursToday,
			handleUndo, hoursToday, instFbRef, subMinutes, subtractedMinutes,
			startTime, endTime, bigBreakLocation, smallBreakLocation, pullTimeData }
			= props;
	const [{ delay }, setDelay] = useState({ delay: false });

	const undoRef = useRef();
	const resetDelay = () => {
		setDelay({ delay: true });
		setTimeout(() => {
			setDelay({ delay: false });
		}, 2000);
	};


	return (
		<div className="main-interface">
			<button
				ref={undoRef}
				className="undo-button"
				onClick={() => {
					!delay && handleUndo();
					!delay && resetDelay();
					undoRef.current.blur();
				}}
			>Undo</button>
			<div className="visuals-container">
				<div className='above-input'>
					<WorkTimeCounter
						startTime={startTime}
						endTime={endTime}
						subtractedMinutes={subtractedMinutes}
						subMinutes={subMinutes}
						pullTimeData={pullTimeData}
					/>
					<OrderList />
					<CenterPiece />
					<KolliTicks
						hoursToday={hoursToday}
						startTime={startTime}
						endTime={endTime}
						bigBreakLocation={bigBreakLocation}
						smallBreakLocation={smallBreakLocation}
						modified_hoursToday={modified_hoursToday}
					/>
				</div>

				<OrdersToday />
				<InstantFeedbackInput
					instFbRef={instFbRef}
					handleClick={handleClick}
					handleChange={handleChange}
					handleKeyPress={handleKeyPress}
					handleInstantFeedback={handleInstantFeedback}
					instFbInput={instFbInput}
				/>
				<KolliInput
					mainInputRef={mainInputRef}
					handleClick={handleClick}
					handleChange={handleChange}
					handleKeyPress={handleKeyPress}
					mainInput={mainInput}
				/>
			</div>
		</div>
	);
}

export default React.memo(MainInterface);