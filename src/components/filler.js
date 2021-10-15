import React from 'react'

const Filler = (props) => {
	// console.log('Progress', props);
	const isDoneProgress = props.Class === 'done-progress-filler';
	return <div className={props.Class} style={{ height: `${props.progress}%`, background: `${props.fillColor}`, bottom: `${!isDoneProgress ? props.doneProgress : 0}%` }} />;

};

export default React.memo(Filler);