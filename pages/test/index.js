import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
// import { StereoAudioRecorder } from 'recordrtc'
// import {
// invokeSaveAsDialog,
// 	RecordRTCPromisesHandler,
// } from 'recordrtc'
// import withNoSSR from '../../components/utils/withNoSSR'

const TestElement = ({ API_KEY, API_HOST }) => {
	const [isRecording, setIsRecording] = useState(false)
	const [audioDevice, setAudioDevice] = useState(null)
	const [audioBase64, setAudioBase64] = useState(null)
	const [audio, setAudio] = useState(null)
	const [blob, setBlob] = useState(null)
	const [testBlob, setTestBlob] = useState(null)
	const audioRef = useRef(null)
	const recorderRef = useRef(null)

	async function getMedia(contraints) {
		let stream
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			})
			setAudio(stream)
			setAudioDevice(stream.getAudioTracks()[0]?.label)
		} catch (err) {
			console.log('ERROR!', err)
		}
	}

	function getBase64(audioToBase64) {
		console.log('audio', audioToBase64)
		// const newBase = window.atob(audioToBase64)
		let data
		let reader = new window.FileReader()
		reader.readAsDataURL(audioToBase64)
		reader.onloadend = function () {
			let base64 = reader.result
			// convertBase64(base64)
			// console.log(base64)
			// const binary = convertURIToBinary(base64)
			// console.log('BINARY', binary)
			// setTestBlob(binary)
			// const newBase = window.btoa(base64)
			base64 = base64.split(',')[1]
			// console.log(newBase)
			console.log(base64)
			data = base64
			// getShazamResult(base64)
			// setAudioBase64(base64)
			// console.log(convertURIToBinary(base64))
		}
		return data
		// setAudioBase64(newBase)
	}
	function convertBase64() {
		let binary = convertURIToBinary(audioBase64)
		let blob1 = new Blob([binary], {
			type: 'audio/ogg',
		})
		setTestBlob(blob1)
		let blobUrl = URL.createObjectURL(blob1)
		console.log(blobUrl)
		setAudioBase64(blob1)
	}

	const handleRecord = async () => {
		const RecordRTC = await (await import('recordrtc')).default
		// let audioCopy = { ...audio }
		recorderRef.current = new RecordRTC(audio, {
			// type: 'audio',
			mimeType: 'application/octet-stream',
			numberOfAudioChannels: 1,
			// recorderType: StereoAudioRecorder,
			// bitrate: 8,
			audioBitsPerSecond: 16,
			sampleRate: 44100,
			desiredSampRate: 44100,
		})
		recorderRef.current.startRecording()
		setIsRecording(true)
		setTimeout(() => {
			recorderRef.current.stopRecording(() => {
				setBlob(URL.createObjectURL(recorderRef.current.getBlob()))
				// setAudioBase64(
				// getBase64(recorderRef.current.getBlob())
				// )
				// getBase64(recorderRef.current.getBlob())
				_base64ToArrayBuffer(getBase64(recorderRef.current.getBlob()))
				// getBase64(_base64ToArrayBuffer(recorderRef.current.getBlob()))
				// let base = Buffer.from(getBase64(recorderRef.current.getBlob()))
				// console.log(base)
				setIsRecording(false)
				setTimeout(() => {
					getShazamResult()
				}, 1000)
			})
		}, 5000)
	}
	function _base64ToArrayBuffer(base64) {
		console.log(base64)
		var binary_string = window.atob(base64)
		var len = binary_string.length
		var bytes = new Uint8Array(len)
		for (var i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i)
		}
		return bytes.buffer
	}
	function convertURIToBinary(dataURI) {
		let BASE64_MARKER = ';base64,'
		let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length
		let base64 = dataURI.substring(base64Index)
		let raw = window.atob(base64)
		let rawLength = raw.length
		let arr = new Uint8Array(new ArrayBuffer(rawLength))

		for (let i = 0; i < rawLength; i++) {
			arr[i] = raw.charCodeAt(i)
		}
		return arr
	}

	async function getShazamResult() {
		const options = {
			method: 'POST',
			url: 'https://shazam.p.rapidapi.com/songs/detect',

			// url: 'https://shazam-core.p.rapidapi.com/v1/tracks/recognize',
			// url: 'https://shazam-song-recognizer.p.rapidapi.com/recognize',
			// params: { timezone: 'America/LosAngeles', locale: 'en-US' },
			headers: {
				'content-type': 'text/plain',
				'X-RapidAPI-Key': API_KEY,
				'X-RapidAPI-Host': API_HOST,
			},
			// data: JSON.stringify({ audio_data: audioBase64.split('base64,')[1] }),
			data: audioBase64,
			// body: audioBase64,
		}

		// console.log('options', audioBase64)
		axios
			.request(options)
			.then(function (response) {
				// console.log(response.json())
				console.log(response?.data)
			})
			.catch(function (error) {
				console.error(error)
			})
	}
	const clearMedia = () => {
		console.log('done')
	}
	const handleSave = () => {
		// invokeSaveAsDialog(audioBase64)
	}
	const handleStop = () => {
		recorderRef.current.stopRecording(() => {
			setBlob(recorderRef.current.getBlob())
		})
	}

	const RecordedAudio = (props, ref) => {
		return (
			<audio
				ref={audioRef}
				src={'data:audio/ogg;base64,' + audioBase64}
				// src={blob}
				controls
				// autoPlay
			></audio>
		)
	}

	useEffect(() => {
		if (!audioDevice) {
			getMedia()
		}
	}, [audioDevice])

	// useEffect(() => {
	// 	getShazamResult()
	// }, [audioBase64])

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				maxWidth: '500px',
				flexDirection: 'column',
				margin: '0 auto',
			}}
		>
			{blob && <RecordedAudio />}
			<span>Device: {audioDevice}</span>
			<span>Status: {isRecording ? 'recording' : 'not recording'}</span>
			<span>TEST: {testBlob && testBlob.slice(0, 100)}</span>
			{/* {blob && (
				<span>
					Audio:{' '}
					{recorderRef.current.getDataURL((data) => setAudioBase64(data))}
				</span>
			)} */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{/* <button onClick={() => getMedia()}>Try me!</button> */}
				<button onClick={() => handleSave()}>Save</button>
				<button onClick={() => handleRecord()}>Record</button>
				<button onClick={() => clearMedia()}>Clear Device</button>
			</div>
			{/* <span>AudioBase64: {JSON.stringify(audioBase64)}</span> */}
			<div>
				{/* <span>Status: {status}</span> */}
				{/* <button onClick={(e) => startRecording({ mediaRecorder })}>
					Start
				</button>
      <button onClick={(e) => setStatus({ mediaRecorder })}>Stop</button> */}
			</div>
			{/* <span>{audioURL}</span> */}
		</div>
	)
}
export default TestElement
// export default withNoSSR(TestElement)

export async function getStaticProps(context) {
	const API_KEY = process.env.X_RAPID_API_KEY
	const API_HOST = process.env.X_RAPID_API_HOST
	return {
		props: { API_KEY, API_HOST },
	}
}
