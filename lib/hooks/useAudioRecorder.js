import { useState } from 'react'

export const useAudioRecorder = ({ mediaRecorder }) => {
	const [status, setStatus] = useState('initial')

	const startRecording = () => {
		// mediaRecorder
		mediaRecorder.start()
		setStatus(true)
	}
	const stopRecording = () => {
		mediaRecorder.stop()
		setStatus(false)
	}

	return { status, stopRecording, startRecording }
}
