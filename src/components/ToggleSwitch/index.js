import PropTypes from 'prop-types';
import classnames from 'classnames';
import isString from 'lodash/isString';
import React, { Component } from 'react';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';
import { useSwipeable, Swipeable } from 'react-swipeable'
import './index.scss'

class ToggleSwitch extends Component {

	state = { enabled: this.enabledFromProps() }

	isEnabled = () => this.state.enabled

	enabledFromProps() {
		let { enabled } = this.props;

		// If enabled is a function, invoke the function
		enabled = isFunction(enabled) ? enabled() : enabled;

		// Return enabled if it is a boolean, otherwise false
		return isBoolean(enabled) && enabled;
	}; // End of enabledFromProps

	toggleSwitch = evt => {
		evt && evt.persist();
		evt && evt.preventDefault();

		const { onClick, onStateChanged } = this.props;

		this.setState({ enabled: !this.state.enabled }, () => {
			const state = this.state;

			// Augument the event object with SWITCH_STATE
			const switchEvent = Object.assign(evt ? evt : 'onSwiped', { SWITCH_STATE: state });

			// Execute the callback functions
			isFunction(onClick) && onClick(switchEvent);
			isFunction(onStateChanged) && onStateChanged(state);
		});
	}; // End of toggleSwitch


	render() {
		// Isolate special props and store the remaining as restProps
		const { enabled: _enabled, theme, onClick, className, onStateChanged, settingsOn, ...restProps } = this.props;

		// Use default as a fallback theme if valid theme is not passed
		const switchTheme = (theme && isString(theme)) ? theme : 'default';

		const switchClasses = classnames(
			`switch switch--${switchTheme}`,
			className
		)

		const togglerClasses = classnames(
			'switch-toggle',
			`switch-toggle--${settingsOn ? 'on' : 'off'}`
		);

		const swipeConfig = {
			delta: 10,                             // min distance(px) before a swipe starts
			preventDefaultTouchmoveEvent: false,   // preventDefault on touchmove, *See Details*
			trackTouch: true,                      // track touch input
			trackMouse: true,                     // track mouse input
			rotationAngle: 0,                      // set a rotation angle
		};



		return (
			<Swipeable onSwiped={() => this.toggleSwitch()} {...swipeConfig} >
				<div className={switchClasses} onClick={this.toggleSwitch}  {...restProps}>
					<div className={togglerClasses}></div>
				</div>
			</Swipeable>
		)
	}; // End of render()


}; // End of ToggleSwitch

ToggleSwitch.propTypes = {
	theme: PropTypes.string,
	enabled: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.func
	]),
	onStateChanged: PropTypes.func
}

export default ToggleSwitch;