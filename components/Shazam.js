import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import axios from 'axios'
import shazam from '../public/img/shazam.svg'
import Image from 'next/image'
import styles from './shazam.module.css'
// import { StereoAudioRecorder } from 'recordrtc'
// import {
// invokeSaveAsDialog,
// 	RecordRTCPromisesHandler,
// } from 'recordrtc'
// import withNoSSR from '../../components/utils/withNoSSR'

export function Shazam({ API_KEY, API_HOST }) {
	const [isRecording, setIsRecording] = useState(false)
	const [audioDevice, setAudioDevice] = useState(null)
	const [audioBase64, setAudioBase64] = useState(null)
	const [status, setStatus] = useState(null)
	const [matches, setMatches] = useState(null)
	const [audio, setAudio] = useState(null)
	const [blob, setBlob] = useState(null)
	const [testBlob, setTestBlob] = useState(null)
	const audioRef = useRef(null)
	const recorderRef = useRef(null)
	const router = useRouter()

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
		let reader = new window.FileReader()
		reader.readAsDataURL(audioToBase64)
		reader.onloadend = function () {
			let base64 = reader.result
			base64 = base64.split(',')[1]
			getShazamResult(base64)
		}
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
		if (!audioDevice) {
			console.log('no audio device')
			getMedia()
		}
		const RecordRTC = await (await import('recordrtc')).default
		recorderRef.current = new RecordRTC(audio, {
			type: 'audio',
			mimeType: 'audio/wav',
			numberOfAudioChannels: 1,
			recorderType: RecordRTC.StereoAudioRecorder,
			desiredSampRate: 44100,
		})
		recorderRef.current.startRecording()
		setIsRecording(true)
		setTimeout(() => {
			recorderRef.current.stopRecording(() => {
				setBlob(URL.createObjectURL(recorderRef.current.getBlob()))
				getBase64(recorderRef.current.getBlob())
				setIsRecording(false)
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

	async function getShazamResult(base64) {
		const options = {
			method: 'POST',
			url: 'https://shazam.p.rapidapi.com/songs/detect',
			headers: {
				'content-type': 'text/plain',
				'X-RapidAPI-Key': API_KEY,
				'X-RapidAPI-Host': API_HOST,
			},
			data: base64,
		}

		axios
			.request(options)
			.then(function (response) {
				if (!response) {
					router.push('/')
				}
				console.log(response?.data)
				const { title } = response?.data?.track
				const { subtitle } = response?.data?.track
				console.log(
					'title',
					title.split(' ').join(''),
					'subtitle',
					subtitle.split(' ').join('')
				)
				// setMatches(response?.data.track.title)
				router.push(`/search/${title} ${subtitle}`)
			})
			.catch(function (error) {
				console.error(error)
			})
		setAudioBase64(base64)
	}

	const RecordedAudio = (props, ref) => {
		return (
			<audio
				ref={audioRef}
				src={'data:audio/ogg;base64,' + audioBase64}
				controls
			></audio>
		)
	}
	function _arrayBufferToBase64(buffer) {
		console.log('buffer', buffer)
		var binary = ''
		var bytes = new Uint8Array(buffer)
		var len = bytes.byteLength
		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i])
		}
		console.log(binary)
		console.log(window.btoa(binary))
		return window.btoa(binary)
	}
	return (
		<section className={styles.container}>
			<Image
				onClick={() => handleRecord()}
				alt='shazam'
				className={styles.shazam}
				src={shazam}
				height={150}
				width={150}
			></Image>
		</section>
	)
}
