import "bootstrap/dist/css/bootstrap.min.css";
import ToggleSwitch from './components/ToggleSwitch/index';
import React, { useEffect, useState } from 'react'

const Menu = (props) => {

	const [{ settingsToggle }, setSettingsToggle] = useState({ settingsToggle: false })
	const { settingsOn } = props;

	useEffect(() => {
		props.handleSettingsToggle(settingsToggle);
	}, [settingsToggle])

	const handleToggleChange = (event) => {
		const toggleEnabled = event.enabled;
		setSettingsToggle({ settingsToggle: toggleEnabled });
		console.log("handleToggleChange -> toggleEnabled", toggleEnabled)
	}; // End of handleToggleChange



	return (
		<>
			<div className="menu">
				<div className="logo-title">
					<div id="logo"></div>
					<div className="title">
						<h1>DAGROFA - KOLLI ASSISTANT</h1>
						<p>by Agris Jurjans</p>
					</div>
				</div>
				<div className="show-settings">
					SHOW SETTINGS
                <ToggleSwitch theme="graphite-small"
						className="d-flex"
						enabled={settingsToggle}
						onStateChanged={handleToggleChange}
						settingsOn={settingsOn}
					/>
				</div>
			</div>
		</>
	)
}

export default React.memo(Menu);