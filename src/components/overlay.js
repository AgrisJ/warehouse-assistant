import React from 'react'
import { getPauseOn } from './../Store/slices/pauseTime';
import { connect } from 'react-redux';
const Overlay = (props) => {
	const { pauseOn } = props;

	const pauseOverlay = () => {

		const transitionBg = pauseOn ? 'rgba(0, 0, 0,0.8)' : 'rgba(0, 0, 0,0.0)';
		const transitionOpacity = pauseOn ? '1' : '0';
		const transitionZindx = pauseOn ? '500' : '0';
		return (
			<div className={'overlay-pause'} style={{
				position: 'fixed',
				backgroundColor: transitionBg,
				width: '100%',
				height: '100%',
				top: '0',
				left: '0',
				zIndex: transitionZindx,
				transition: 'background 0.5s',
				display: 'flex',
				alignItems: 'center'
			}}>
				<div className="overlay-container has-text-centered" style={{ opacity: transitionOpacity }}>
					<h1 className="paused">Paused</h1>
					<h3 className="paused1 is-size-2">Remember to change your STATUS at the computer!</h3>
					<h5 className="paused1 is-size-4">For lunch breaks please use
                                the “-20min”, “-25min” buttons!</h5>
				</div>
			</div>
		)
	}; // End of pauseOverlay

	return (<>
		{pauseOverlay()}
	</>);
}

const mapStateToProps = (state) =>
	({
		pauseOn: getPauseOn(state),

	})

export default connect(mapStateToProps)(React.memo(Overlay));