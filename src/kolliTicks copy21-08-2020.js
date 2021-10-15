import React, { useState, useEffect } from 'react';
import { roundUp, roundDown } from './helpers';

const KolliTick = (props) => {
    const   {percentage} = props;
    return (<div className={"kolli-tick " + props.Class1} style={percentage}><span className={props.Class2}>{props.timeEntry}</span></div>)
};

// let's redefine modified_hoursToday so it won't actually use the state version of it. Instead it would rely on an inside calculations. 
// - Make modified_hoursToday as an inside variable
const KolliTicks = (props) => {
    const { startTime, endTime, kolliTarget, kolliDone, bigBreakLocation, smallBreakLocation, modified_hoursToday } = props;
    // console.log("KolliTicks -> hoursToday", hoursToday)

    // const [{kolliTargetModifier}, setKolliTargetModifier] = useState({kolliTargetModifier: 0});

    const
        // kolliTarget = kolliTarget - kolliTargetModifier,
        insideKolliToday = (kolliTarget * modified_hoursToday);
        // console.log("KolliTicks -> kolliTarget", kolliTarget)
        // console.log("KolliTicks -> insideKolliToday", insideKolliToday )

    const 
        bigBreak = (1 / 60) * 25,
        smallBreak = (1 / 60) * 20,
        bothBreaksTaken = bigBreakLocation !== 0 && smallBreakLocation !== 0,
        smallBreakTaken = smallBreakLocation !== 0,
        bigBreakTaken = bigBreakLocation !== 0,
        startTimeMinutes = (+startTime[1]) / 60,
        endTimeMinutes = (+endTime[1]) / 60,
        calcKolliToday = insideKolliToday,
        subtractedBreaks = () => {return (bigBreakTaken && bigBreak) + (smallBreakTaken && smallBreak)},
        insideHoursToday = modified_hoursToday /* -(subtractedBreaks() && subtractedBreaks(false, false)) */ , 
        variableHoursToday = insideHoursToday  /* - startTimeMinutes + endTimeMinutes */,
        hoursOfToday_forStartTime = modified_hoursToday - subtractedBreaks() /* + startTimeMinutes - endTimeMinutes */;

    const 
        bigBreakKolli = kolliTarget * bigBreak ,
        smallBreakKolli = kolliTarget * smallBreak ,
        kolliTodoInSmallBreakHour = kolliTarget - smallBreakKolli,
        kolliTodoInBigBreakHour = kolliTarget - bigBreakKolli ,
        adjustedStartHour = hoursOfToday_forStartTime + (startTimeMinutes * hoursOfToday_forStartTime),
            // adjustedEndHour = hoursOfToday_forStartTime + (endTimeMinutes * hoursOfToday_forStartTime),
        adjustedHourDiffInPerc = 100 - ((variableHoursToday / variableHoursToday) * 100),
        adjustedHourDiffInPercStartTime = 100 - (adjustedStartHour / (variableHoursToday - subtractedBreaks())* 100),
            // adjustedHourDiffInPercEndTime = 100 - (adjustedEndHour / (variableHoursToday - subtractedBreaks())* 100),
        arrayHoursStart = startTime[0],
        arrayMinutes = '00',
        arrayMinutesForStart = startTime[1];
        // console.log("subtractedBreaks -> adjustedHourDiffInPercEndTime", adjustedHourDiffInPercEndTime)
        // console.log("subtractedBreaks -> adjustedHourDiffInPercStartTime", adjustedHourDiffInPercStartTime)

    const 
        // timeButtonValue = 0, // this should be from props eventually
        // minuteButtonValue = 0, // this should be from props eventually
        // kolliTargetPerMinute = kolliTarget / 60,
        // modifiedInsideKolliSum = minuteButtonValue * kolliTargetPerMinute,
        kolliInOnePercent = kolliTarget / 100,
        // oneMinuteKolli = kolliTarget * ((1 / 60) * 1),
        // kolliToDoInAdjustedTickHour = kolliTarget - (timeButtonValue * oneMinuteKolli),
        // timeAdjustedTickPercent = kolliToDoInAdjustedTickHour / kolliInOnePercent,
        smallBreakPercent = kolliTodoInSmallBreakHour / kolliInOnePercent, 
        bigBreakPercent = kolliTodoInBigBreakHour / kolliInOnePercent, 
        // adjustedTickHour = (timeAdjustedTickPercent / variableHoursToday),
        adjustedSmallbreakHour = (smallBreakPercent / variableHoursToday),
        adjustedBigbreakHour = (bigBreakPercent / variableHoursToday),
        regularHourPercent = 100 / (variableHoursToday),
        visibleTickFix = (regularHourPercent / 100) * (100 * endTimeMinutes);
        console.log("subtractedBreaks -> adjustedBigbreakHour", adjustedBigbreakHour)
   

    const
        kolliDonePercent = 100 / (+calcKolliToday) * kolliDone,
        dynamicKolliTarget = kolliTarget + ((adjustedHourDiffInPerc / 100) * kolliTarget),
        distributionByTarget = 100 / (+calcKolliToday) * dynamicKolliTarget
    
    const 
        isEndTimeNotRound = endTime[1] !== '00',
        isStartTimeNotRound = startTime[1] !== '00',
        startDynamicKolliTarget = kolliTarget + ((adjustedHourDiffInPercStartTime / 100) * kolliTarget),
        endDynamicKolliTarget = kolliTarget + ((/* adjustedHourDiffInPercEndTime */adjustedHourDiffInPerc / 100) * kolliTarget),
        projectedTickCount = isEndTimeNotRound || isStartTimeNotRound ? variableHoursToday + 1 /* + (isEndTimeNotRound && 1) - endTimeMinutes */ : variableHoursToday,
        firstHour = 100 / (+calcKolliToday) * startDynamicKolliTarget,
        lastHour = 100 / (+calcKolliToday) * endDynamicKolliTarget ;

    const
        lastIterator = roundUp((projectedTickCount)),
        alteredEndTimeFirst = +startTime[0] + (isEndTimeNotRound ? +lastIterator - 1 : +lastIterator),
        endTimeFormat = alteredEndTimeFirst + ':' + endTime[1];

    let ticks = [];
    
    for (let i = 1; i < lastIterator; i++) {
        const 
        arrayHoursMid = (+startTime[0] + i).toString(),
        middleTime = arrayHoursMid + ':' + arrayMinutes,
        hoursPercent = i / ((variableHoursToday+.4) / 100);
        
        // console.log("KolliTicks -> +startTime[0] + +lastIterator", +startTime[0] + +lastIterator)
        // console.log("KolliTicks -> lastIterator", +startTime[0])

        let ticksPassedOver = '';
        // const passedTicksAdjusted = (regularValue) => { 
        //     /**
        //      * - If (timeButtonValue <= 60) affect just one tick of ticks
        //      * - Every 60 of timeButtonValue another tick should be affected 
        //      */
        //     const isTimeButtonEngaged = timeButtonValue ? adjustedTickHour : regularValue;
        //     return (ticksPassedOver ? isTimeButtonEngaged  + '%' : regularValue + '%')
        // };


              if (hoursPercent < kolliDonePercent) ticksPassedOver = 'passed-over-ticks';
              else ticksPassedOver = '';
                  
                    if (i === bigBreakLocation) { // 3
                       ticks.push(
                           <KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: adjustedBigbreakHour }} />// 9.28%
                        );
                    } else
                   
                    if (i === smallBreakLocation) { // 5
                        ticks.push(
                            <KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: adjustedSmallbreakHour }} /> // 10.42%
                        );
                    } else
                    if ( i === (modified_hoursToday)) { // the last one before endTime
                        ticks.push(
                            <KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: bothBreaksTaken ? lastHour : visibleTickFix + '%' }} style={{ background: 'red' }} /> // 10.42%
                        );
                  
                    } else
                        if (i === 1) { // the first one after startTime
                        ticks.push(
                            <KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: firstHour }}  /> // 10.42%
                        );  
                            // console.log("passedTicksAdjusted -> passedTicksAdjusted(firstHour)", passedTicksAdjusted(firstHour))
                    // } else
                    //     if (isEndTimeNotRound) { // the extra one if endTime !== :00
                    //         ticks.push(
                    //             <KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: distributionByTarget + '%' }} style={{ background: 'red' }} /> // 10.42%
                    //     );
                    // } else
                    //         if (hoursPercent < kolliDonePercent) { 
                    //         ticks.push(
                    //             <KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: adjustedTickHour + '%' }}  /> // 10.42%
                    //     );
                    } 
                    else {
                        ticks.push(
                            <KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: distributionByTarget + '%'}}  />
                        ); 
                    }
                    //   console.log("KolliTicks -> adjustedHoursToday", adjustedHoursToday)
            // console.log("KolliTicks -> middleTime", arrayHoursMid)

                
        }; // End of FOR loop
        
        ticks.push(
            <KolliTick key={modified_hoursToday + endTimeMinutes} timeEntry={endTimeFormat} Class1='no-border' Class2='end-time' percentage={{ height: 0 + '%' }} />
            );
            
            // useEffect(() => {
            //       setKolliTargetModifier({kolliTargetModifier: modifiedInsideKolliSum});
            // }, [minuteButtonValue])


    return (
    <div className="kolli-time-scale">
        {ticks}
            <div className="start-time">{arrayHoursStart + ':' + arrayMinutesForStart}</div>
    </div> 
    );
}
 
export default KolliTicks;