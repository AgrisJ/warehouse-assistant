import React from 'react';
import { roundUp } from './helpers';
// import { roundDown } from './helpers';

const KolliTick = (props) => {
    const   {percentage} = props;
    return (<div className={"kolli-tick " + props.Class1} style={percentage}><span className={props.Class2}>{props.timeEntry}</span></div>)
};

const KolliTicks = (props) => {
  const { hoursToday, startTime, endTime, kolliTarget, kolliDone, kolliToday, bigBreakLocation, smallBreakLocation } = props;
    const bigBreak = (1 / 60) * 25,
        smallBreak = (1 / 60) * 20,
        calcKolliToday = (hoursToday - (smallBreak + bigBreak)) * kolliTarget,
        calculatedMinutes = (+endTime[1] - +startTime[1]) / 60,
        adjustedKolliToday = startTime[1] === '00' ? kolliToday : roundUp(calcKolliToday);


     
  const bigBreakKolli = kolliTarget * bigBreak,
        smallBreakKolli = kolliTarget * smallBreak,
        endTimeDeductable = (60 - +endTime[1]) / 60,
      oldAdjustedHoursToday = hoursToday  - (endTimeDeductable  !== 1 ? endTimeDeductable : 0),
      adjustedHoursToday = hoursToday /* + calculatedMinutes */ - (calculatedMinutes * (hoursToday)) /* - (endTimeDeductable  !== 1 ? endTimeDeductable : 0) */,
      adjustedHourDiffInPerc = 100 - (hoursToday - (calculatedMinutes * oldAdjustedHoursToday)/* adjustedHoursToday */ / (hoursToday) * 100),
      adjustedHourDiffInPercForMinutes = 100 - (adjustedHoursToday / (hoursToday - calculatedMinutes))* 100,
      arrayHoursStart = startTime[0],
      arrayMinutes = /* startTime[1] */'00',
      arrayMinutesForStart = startTime[1];
    //   console.log("KolliTicks -> calculatedMinutes", calculatedMinutes)
    //   console.log("KolliTicks -> adjustedHourDiffInPercForMinutes", adjustedHourDiffInPercForMinutes)

  const oneKolliPercent = kolliTarget / 100,
        kolliTodoInSmallBreakHour = kolliTarget - smallBreakKolli,
        kolliTodoInBigBreakHour = kolliTarget - bigBreakKolli,
        smallBreakPercent = kolliTodoInSmallBreakHour / oneKolliPercent +7, // <- Need to figure out where the 7% comes from;
        bigBreakPercent = kolliTodoInBigBreakHour / oneKolliPercent +7, // <- Need to figure out where the 7% comes from;
      regularHourPercent = 100 / (oldAdjustedHoursToday + calculatedMinutes/* adjustedHoursToday */),
        adjustedSmallbreakHour = (regularHourPercent / 100) * smallBreakPercent,
        adjustedBigbreakHour = (regularHourPercent / 100) * bigBreakPercent,
        oneOfBrakesTaken = bigBreakLocation !== 0 || smallBreakLocation !== 0;

    const kolliDonePercent = 100 / (+adjustedKolliToday) * kolliDone,
          dynamicKolliTarget = kolliTarget + ((adjustedHourDiffInPerc / 100) * kolliTarget),
          dynamicKolliTargetForMinutes = kolliTarget + ((adjustedHourDiffInPercForMinutes / 100) * kolliTarget),
          distributionByTarget = 100 / (+adjustedKolliToday) * dynamicKolliTarget,
          adjustedForMinuteChange = 100 / (+adjustedKolliToday) * dynamicKolliTargetForMinutes;
    const endTimeFormat = endTime[0] + ':' + endTime[1];

    let ticks = [];
    
    for (let i = 1; i < oldAdjustedHoursToday/* adjustedHoursToday */; i++) {
        const arrayHoursMid = (+startTime[0] + i).toString(),
              middleTime = arrayHoursMid + ':' + arrayMinutes,
            hoursPercent = i / ((oldAdjustedHoursToday  /* adjustedHoursToday */+.4) / 100);
              let ticksPassedOver = '';


            /* !! PERHAPS NEED A RE-DESIGN OF THE TICK DISTRIBUTION !!
             * [x] Goal: Have the ticks distributed based on kolliTarget so that the first tick is exactly where the "153" level's at; 
             * [x]  Check the percentage of break sizes - might not be as it should
             * [x] AdjustedHoursToday perhaps should be only for the last hour not all the hours
             */

             /*  HOW THE BREAK TIME ADJUSTMENTS SHOULD WORK
             * 1. The numbers "2" and "4" should be made dynamic;
             * 2. The dynamic numbers would identify when exactly to add the breakTime adjustment;
             * 3. Have to use real time to add these breaks;
             * 
             * // FEATURES ONCE REAL-TIME GETS IMPLEMENTED
             *  [] Every passed ticks should be colored based on the performance per hour
             * 
             * NOTE: The shorter hour adjustments shouldn't be affecting the above hour distribution => only the hours below (done Hours);
             */
              if (hoursPercent < kolliDonePercent) ticksPassedOver = 'passed-over-ticks';
              else ticksPassedOver = '';
                  
                    if (i === bigBreakLocation) { // 3
                       ticks.push(
                           <KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: adjustedBigbreakHour  + '%' }} />// 9.28%
                        );
                    } else
                   
                    if (i === smallBreakLocation) { // 5
                        ticks.push(
                            <KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: adjustedSmallbreakHour + '%' }} /> // 10.42%
                        );
                    } else
                    if ( i === (hoursToday - 1)) { // the last one before endTime
                        ticks.push(
                            <KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: oneOfBrakesTaken ? distributionByTarget + '%' : adjustedBigbreakHour + '%' }} style={{ background: 'red' }} /> // 10.42%
                        );
                     
                    } else
                        if (i === 1) { // the first one after startTime
                        ticks.push(
                            <KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: adjustedForMinuteChange + '%' }}  /> 
                        );
                    } 
                    else {
                        ticks.push(
                            <KolliTick key={i} timeEntry={middleTime} Class1={ticksPassedOver} Class2='kolli-number' percentage={{ height: distributionByTarget + '%' }} />
                        ); 
                    }
            //   console.log("KolliTicks -> adjustedHoursToday", adjustedHoursToday)

                
    }; // End of FOR loop
        ticks.push(
            <KolliTick key={hoursToday /* + calculatedMinutes */} timeEntry={endTimeFormat} Class1='no-border' Class2='end-time' percentage={{ height: 0 + '%' }} />
            );
            
            

    return (
    <div className="kolli-time-scale">
        {ticks}
            <div className="start-time">{arrayHoursStart + ':' + arrayMinutesForStart}</div>
    </div> 
    );
}
 
export default KolliTicks;