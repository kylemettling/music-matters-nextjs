import { useState, useEffect } from 'react'

const TestElement = ({ API_KEY, API_HOST }) => {
	const axios = require('axios')

	const options = {
		method: 'POST',
		url: 'https://shazam.p.rapidapi.com/songs/v2/detect',
		// params: { timezone: 'America/Chicago', locale: 'en-US' },
		headers: {
			'content-type': 'text/plain',
			'X-RapidAPI-Key': API_KEY,
			'X-RapidAPI-Host': API_HOST,
		},
		data: '"Generate one on your own for testing and send the body with the content-type as text/plain"',
	}
	console.log(options)
	// axios
	// 	.request(options)
	// 	.then(function (response) {
	// 		console.log(response.data)
	// 	})
	// 	.catch(function (error) {
	// 		console.error(error)
	// 	})

	return <div></div>
}
export default TestElement

export async function getStaticProps(context) {
	const API_KEY = process.env.X_RAPID_API_KEY
	const API_HOST = process.env.X_RAPID_API_HOST
	return {
		props: { API_KEY, API_HOST },
	}
}
