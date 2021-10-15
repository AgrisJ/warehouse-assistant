import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react'
import { connect } from "react-redux";
import Filler from './components/filler';
import { roundUp } from "./helpers";
import { getEffectivityColor } from './Store/slices/effectivityColor';
import { getKolliArray } from './Store/slices/kolli';
import { getAlteredKolli } from './Store/slices/alteredKolli';
import { getDoneProgress } from './Store/slices/doneProgress';
import { getKolliDone } from './Store/slices/kolliDone';
import { getKolliToday } from './Store/slices/kolliToday';
import { getCurrentOrderSize } from './Store/slices/currentOrderSize';

const CenterPiece = props => {

	const { kolliToday, kolli, kolliDone, currentOrderProgress, doneProgress, Class, effectivityColor, alteredKolli } = props,
		isDoneProgress = Class === 'done-progress-filler',
		isFirstOrderDone = kolli.length > 1,
		isThereDoneKolli = kolliDone !== 0 && !isNaN(kolliDone),
		remaining = +kolliToday + +roundUp(alteredKolli) - kolliDone || '0' || kolliToday,
		isOverTarget = remaining < 0,
		minDoneProgress = 9;


	const orderStatus = () => {
		if (isOverTarget) return 'OVER TARGET:';
		if (isFirstOrderDone) return 'KOLLI LEFT:';
		else return 'KOLLI TODAY:';
	}; // orderStatus
	const overTargetNr = () => {
		if (isOverTarget) return '+ ' + Math.abs(remaining);
		if (isFirstOrderDone) return remaining;
		else return kolliToday;
	}; // overTargetNr

	const totalKolliPlace = (color = 0) => {
		const underFiller = doneProgress - 6.5,
			aboveCurrentOrder = doneProgress + 3,
			whileFillerTooSmall = doneProgress <= minDoneProgress,
			place = whileFillerTooSmall ? aboveCurrentOrder : underFiller;

		return !isDoneProgress ? place : 0
	}; // End of totalKolliPlace

	const totalKolliStyle = () => {
		const
			whileFillerTooSmall = doneProgress <= minDoneProgress && currentOrderProgress <= 3,

			color = whileFillerTooSmall ? '#4B71A6' : /* '#dedede' */ '#fff';

		return {
			bottom: `${totalKolliPlace() - 2.5}%`,
			color: color,
			opacity: isOverTarget ? 0 : 1
		}
	}; // End of totalKolliColor

	const kolliTodaySpanStyle = () => {
		const
			whileFillerTooSmall = doneProgress <= minDoneProgress && currentOrderProgress <= 7.9,
			color = whileFillerTooSmall ? '#4B71A6' : 'white';
		return {
			position: 'absolute',
			bottom: `${totalKolliPlace() + 3.1}%`,
			color: color,
			left: '37%'
		}

	}; // End of kolliTodayStyle

	const stripedCurrentOrder = `repeating-linear-gradient(45deg, #51698a, #51698a 12px, #5581bb 12px, #5581bb 20px)`;
	return (
		<div className='center-piece'>
			<div className='kolli-target'><p className="remaining">{orderStatus()}</p> <p className="rem-kolliToday">{overTargetNr()}</p> </div>
			<div className="scale-container">
				<div className="quantity-scale">
					<div className="kolli-today">{isOverTarget && kolliToday}<span>{isOverTarget && ' TODAY'}</span><span style={kolliTodaySpanStyle()}>{!isOverTarget && ' TOTAL'}</span></div>
					<div className="kolli-done" style={totalKolliStyle()}>{isThereDoneKolli && Math.abs(kolliDone)}</div>
					<Filler doneProgress={doneProgress} progress={currentOrderProgress} fillColor={stripedCurrentOrder} Class={'current-progress-filler currentOrder-transition'} />
					<Filler progress={doneProgress} fillColor={effectivityColor} Class={'done-progress-filler totalProgress-transition '} />
				</div>
			</div>
		</div>
	);

}

// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
const mapStateToProps = (state) =>
	({
		alteredKolli: getAlteredKolli(state),
		currentOrderProgress: getCurrentOrderSize(state),
		doneProgress: getDoneProgress(state),
		effectivityColor: getEffectivityColor(state),
		kolli: getKolliArray(state),
		kolliDone: getKolliDone(state),
		kolliToday: getKolliToday(state)
	})

export default connect(mapStateToProps)(React.memo(CenterPiece));