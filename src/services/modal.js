import React from 'react';
import AgrisPic from '../images/agris.png';
import QRPic from '../images/radio_qr.png';

function ReminderModal({ showModal, modalText, additionalText, activateOk }) {
	const styles = {
		box: {
			display: showModal ? 'flex' : 'none',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			height: '100vh',
			padding: '0 4rem 2rem',
			backgroundColor: 'unset'
		},
		container: {
			display: 'flex',
			width: '100%',
			height: '100%',
			position: 'fixed',
			top: '0',
			left: '0',
			justifyContent: 'center',
			alignItems: 'center',
			fontSize: '2em',
			fontFamily: 'monospace',
			textAlign: 'center',
			fontWeight: 'bold',
			backgroundColor: 'rgb(185 172 172 / 38%)',
			zIndex: 1000000
		},
		modal: {
			width: '32rem',
			padding: '5rem 2.5rem',
			borderRadius: '.8rem',
			position: 'relative',
			overflow: 'hidden',
			color: '#ffb328',
			background: 'linear-gradient(rgb(185 90 54 / 91%) 29.99%, rgb(253 156 71) 100%)',
			boxShadow: 'black, .4rem .4rem 10.2rem .2rem'
		},
		info: {
			fontSize: '0.8em',
			color: 'white',
			fontFamily: 'Roboto Condensed',
			fontWeight: 400
		},
		buttons: {
			padding: '1.3rem 1.8rem',
			margin: '0 1rem',
			color: 'white',
			fontSize: '1.2rem',
			backgroundColor: 'transparent',
			fontFamily: 'Roboto Condensed'
		},
		highlight: {
			color: '#ffbd29'
		},
		qrImg: {
			width: '5rem'
		},
		agrisImg: {
			width: '9rem'
		},
		pictures: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			marginTop: '1.5rem',
			gap: '13px'
		}
	}

	const { box, container, modal, info, buttons, highlight, qrImg, agrisImg, pictures } = styles;

	return (
		<div style={box}>
			<div style={container}>
				<div style={modal}>
					<p style={info}><span style={highlight}>{modalText}</span></p>
					{additionalText && <p style={info}>{additionalText}</p>}
					<div style={pictures}>
						<img src={AgrisPic} style={agrisImg} />
						<img src={QRPic} style={qrImg} />
					</div>
					<div className='is-justify-content-center mt-4'>
						<button style={buttons} className='button is-rounded' onClick={() => activateOk()}>OK</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ReminderModal;