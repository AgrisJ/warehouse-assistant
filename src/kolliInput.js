import React from 'react';
const KolliInput = (props) => {
	const { mainInputRef, handleChange, handleKeyPress, addOrder, mainInput, handleClick } = props;
	return (
		<input
			ref={mainInputRef}
			onClick={() => handleClick('mainInput')}
			onChange={(event) => handleChange('mainInput', event)}
			onKeyPress={(event) => handleKeyPress('mainInput', event)}
			onSubmit={addOrder}
			value={mainInput}
			type={'number'}
			pattern={'[0-9]*'}
			className="main-input input is-info"
			placeholder='Type your kolli'
			autoComplete={'off'}
		/>
	);
}
export default React.memo(KolliInput);