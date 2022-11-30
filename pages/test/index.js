import { useState, useEffect } from 'react'

const TestElement = ({ API_KEY, API_HOST }) => {
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
