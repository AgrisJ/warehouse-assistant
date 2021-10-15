import React, { useEffect } from 'react';
import { roundUp } from './helpers';
import { connect } from 'react-redux';
import { getKolliDone } from './Store/slices/kolliDone';
import { getAlteredKolli } from './Store/slices/alteredKolli';
import { getKolliTarget } from './Store/slices/kolliTarget';
import { getKolliToday } from './Store/slices/kolliToday';
import { getWorkHoursToday } from './Store/slices/workHoursToday';


const KolliTicks = (props) => {
	const { startTime, endTime, kolliTarget, kolliDone, kolliToday, bigBreakLocation, smallBreakLocation, modified_hoursToday, alteredKolli, workHoursToday } = props;


	const
		bigBreak = (1 / 60) * 25,
		smallBreak = (1 / 60) * 20,
		bothBreaksTaken = bigBreakLocation !== 0 && smallBreakLocation !== 0,
		smallBreakTaken = smallBreakLocation !== 0,
		bigBreakTaken = bigBreakLocation !== 0,
		startTimeMinutes = (+startTime[1]) / 60,
		endTimeMinutes = (+endTime[1]) / 60,
		subtractedBreaks = () => { return (bigBreakTaken && bigBreak) + (smallBreakTaken && smallBreak) },
		hoursOfToday_forStartTime = modified_hoursToday - subtractedBreaks();

	const
		bigBreakKolli = kolliTarget * bigBreak,
		smallBreakKolli = kolliTarget * smallBreak,
		kolliTodoInSmallBreakHour = kolliTarget - smallBreakKolli,
		kolliTodoInBigBreakHour = kolliTarget - bigBreakKolli,
		adjustedStartHour = hoursOfToday_forStartTime + (startTimeMinutes * hoursOfToday_forStartTime),
		adjustedHourDiffInPerc = 100 - ((modified_hoursToday / modified_hoursToday) * 100),
		adjustedHourDiffInPercStartTime = 100 - (adjustedStartHour / (modified_hoursToday - subtractedBreaks()) * 100),
		arrayHoursStart = startTime[0],
		arrayMinutes = '00',
		arrayMinutesForStart = startTime[1];

	const
		kolliInOnePercent = kolliTarget / 100,
		smallBreakPercent = kolliTodoInSmallBreakHour / kolliInOnePercent,
		bigBreakPercent = kolliTodoInBigBreakHour / kolliInOnePercent,
		adjustedSmallbreakHour = (smallBreakPercent / (modified_hoursToday - (!bothBreaksTaken ? subtractedBreaks() : 0))),
		adjustedBigbreakHour = (bigBreakPercent / (modified_hoursToday - (!bothBreaksTaken ? subtractedBreaks() : 0))),
		regularHourPercent = 100 / (modified_hoursToday),
		visibleTickFix = (regularHourPercent / 100) * (100 * endTimeMinutes);

	const
		kolliDonePercent = 100 / (+kolliToday) * (kolliDone - alteredKolli),
		dynamicKolliTarget = kolliTarget + ((adjustedHourDiffInPerc / 100) * kolliTarget),
		distributionByTarget = 100 / (+kolliToday) * dynamicKolliTarget

	const
		isEndTimeNotRound = endTime[1] !== '00',
		startDynamicKolliTarget = kolliTarget + ((adjustedHourDiffInPercStartTime / 100) * kolliTarget),
		endDynamicKolliTarget = kolliTarget + ((adjustedHourDiffInPerc / 100) * kolliTarget),
		projectedTickCount =
			() => {
				const
					startTimeMinutes = startTime[1],
					endTimeMinutes = endTime[1]

				if (workHoursToday) {
					if ((endTimeMinutes !== '00')) {
						if ((startTimeMinutes > endTimeMinutes)) return workHoursToday + 1
						if ((startTimeMinutes === endTimeMinutes)) return workHoursToday + 1
					}
					return workHoursToday
				}

			},
		firstHour = 100 / (+kolliToday) * startDynamicKolliTarget,
		lastHour = 100 / (+kolliToday) * endDynamicKolliTarget;

	const
		lastIterator = roundUp((projectedTickCount())),
		alteredEndTimeFirst = +startTime[0] + (isEndTimeNotRound ? +lastIterator - 1 : +lastIterator),
		endTimeFormat = alteredEndTimeFirst + ':' + endTime[1];


	let ticks = [];

	for (let i = 1; i < lastIterator; i++) {
		const
			arrayHoursMid = (+startTime[0] + i).toString(),
			middleTime = arrayHoursMid + ':' + arrayMinutes,
			theLastTick = isEndTimeNotRound ? lastIterator - 1 : lastIterator;


		let ticksPassedOver = '',
			hrs = '';

		if (i === bigBreakLocation) { // 3
			const breakTickHeight = adjustedBigbreakHour;
			hrs = tickHeights(ticks, i) + breakTickHeight;
			if (hrs < kolliDonePercent) ticksPassedOver = 'passed-over-ticks checkmark';

			ticks.push(
				<KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: adjustedBigbreakHour + '%' }} />// 9.28%
			);
		} else

			if (i === smallBreakLocation) { // 5
				const breakTickHeight = adjustedSmallbreakHour;
				hrs = tickHeights(ticks, i) + breakTickHeight;
				if (hrs < kolliDonePercent) ticksPassedOver = 'passed-over-ticks checkmark';

				ticks.push(
					<KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: adjustedSmallbreakHour + '%' }} /> // 10.42%
				);
			} else
				if (i === theLastTick) { // the last one before endTime
					const breakTickHeight = bothBreaksTaken ? lastHour : visibleTickFix;
					hrs = tickHeights(ticks, i) + breakTickHeight;
					if (hrs < kolliDonePercent) ticksPassedOver = 'passed-over-ticks checkmark';

					ticks.push(
						<KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: bothBreaksTaken ? lastHour + '%' : visibleTickFix + '%' }} /> // 10.42%
					);
				} else

					if (i === 1) { // the first one after startTime
						hrs = firstHour;
						if (hrs < kolliDonePercent) ticksPassedOver = 'passed-over-ticks checkmark';

						ticks.push(
							<KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: firstHour + '%' }} /> // 10.42%
						);
					} else {
						const breakTickHeight = distributionByTarget;
						hrs = tickHeights(ticks, i) + breakTickHeight;
						if (hrs < kolliDonePercent) ticksPassedOver = 'passed-over-ticks checkmark';

						ticks.push(
							<KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: distributionByTarget + '%' }} style={{ color: hrs < kolliDonePercent ? 'red' : '' }} />
						);
					}

	}; // End of FOR loop


	ticks.push(
		<KolliTick key={lastIterator} timeEntry={endTimeFormat} Class1='no-border' Class2='end-time' percentage={{ height: 0 + '%' }} />
	);


	return (
		<div className="kolli-time-scale">
			{ticks}
			<div className="start-time">{arrayHoursStart + ':' + arrayMinutesForStart}</div>
		</div>
	);
}

const mapStateToProps = (state) =>
({
	alteredKolli: getAlteredKolli(state),
	kolliTarget: getKolliTarget(state),
	kolliDone: getKolliDone(state),
	kolliToday: getKolliToday(state),
	workHoursToday: getWorkHoursToday(state)
})

export default connect(mapStateToProps)(React.memo(KolliTicks));












function KolliTick(props) {
	const { percentage } = props;
	return (
		<>
			<div className={"kolli-tick " + props.Class1} style={percentage}>
				<span className={props.Class2}>{props.timeEntry}</span>
				<div className={props.Class1 + ' draw'}></div>
			</div>
		</>
	)
};


function tickHeights(array, currentID) {
	// RETURN: PREV and CURRENT tick SUM
	const harvestedTicks = array.map((tick) => {
		const
			tickId = tick.key,
			tickHeightPerc = tick.props.percentage.height;

		return (
			{
				'tickId': tickId,
				'highPercent': tickHeightPerc
			}
		)
	});

	const listOfViableTicks = [0]; // perhaps needs 0 in it

	harvestedTicks.forEach(tick => {
		const
			ID = +tick.tickId,
			HEIGHT = +tick.highPercent.slice(0, tick.highPercent.length - 1);

		if (ID <= currentID) listOfViableTicks.push(HEIGHT);
	});

	const result = listOfViableTicks.reduce((accumulator, currentValue) => {
		return accumulator + currentValue;
	});

	return result;
}; // End of tickHights