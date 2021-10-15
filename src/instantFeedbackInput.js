import React from 'react';
import { getKolliLeftInOrder } from './Store/slices/kolliLeftInOrder';
import { connect } from 'react-redux';
const InstantFeedbackInput = (props) => {
	const { instFbRef, handleChange, handleKeyPress, handleClick, handleInstantFeedback, instFbInput, kolliLeftOrder } = props;
	return (<>
		<input
			ref={instFbRef}
			onClick={() => handleClick('instFbInput')}
			onChange={(event) => handleChange('instFbInput', event)}
			onKeyPress={(event) => handleKeyPress('instFbInput', event)}
			onSubmit={handleInstantFeedback}
			value={instFbInput}
			type={'number'}
			pattern={'[0-9]*'}
			className="instant-feedback-input input is-warning"
			placeholder={`${kolliLeftOrder} kolli left in order`}
			autoComplete={'off'}
		/>
		<p className='instantFb-label'>Type in new nr here:</p>
	</>
	);
}

const mapStateToProps = (state) =>
	({
		kolliLeftOrder: getKolliLeftInOrder(state)
	})

export default connect(mapStateToProps)(React.memo(InstantFeedbackInput));

