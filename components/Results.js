import React, { useEffect, useState } from 'react'
import { useSpotifyToken } from '../lib/hooks'
import { useAppState } from '../lib/state'
import axios from 'axios'
import { Result } from './Result'
import styles from './results.module.css'
import Head from 'next/head'
import { useRouter } from 'next/router'

// function useQuery() {
// 	const { search } = useLocation()
// 	return React.useMemo(() => new URLSearchParams(search), [search])
// }

export default function Results({ results, type = '' }) {
	const router = useRouter()
	const query = router.query
	// const [results, setResults] = useState([])
	const {
		token,
		refreshToken,
		getStoredToken,
		isTrackActive,
		clearTrackData,
		getScaleChords,
	} = useAppState()

	// let query = useQuery()

	// async function getSpotifySearchData() {
	// 	if (!query) {
	// 		return
	// 	}

	// 	if (!token) {
	// 		refreshToken()
	// 	}
	// 	const res = await axios(
	// 		`https://api.spotify.com/v1/search?q=${query}&type=track`,
	// 		{
	// 			headers: {
	// 				Authorization: 'Bearer ' + token,
	// 			},
	// 			method: 'GET',
	// 		}
	// 	).catch((err) => {
	// 		if (err.status === 401) {
	// 			refreshToken()
	// 			getSpotifySearchData()
	// 		}
	// 		console.log('Error!!', err)
	// 	})
	// 	if (!res) {
	// 		refreshToken()
	// 		getSpotifySearchData()
	// 	}
	// 	const data = res.data['tracks']?.items
	// 	setResults(data)
	// }

	useEffect(() => {}, [results])

	if (!query) return null

	return (
		<React.Fragment>
			<Head>
				<meta charSet='utf-8' />
				<title>Results | {query}</title>
				<meta name='description' content='Music Matters - Audio Arranged' />
			</Head>
			{results && (
				<ul className={styles.results}>
					{results &&
						results.map((track, i) => (
							<Result key={i} index={i} track={track} />
						))}
				</ul>
			)}
		</React.Fragment>
	)
}

export async function getServerSideProps({ req }) {
	// if (!query) {
	// 	return
	// }

	if (!token) {
		refreshToken()
	}
	const res = await axios(
		`https://api.spotify.com/v1/search?q=${query}&type=track`,
		{
			headers: {
				Authorization: 'Bearer ' + token,
			},
			method: 'GET',
		}
	).catch((err) => {
		if (err.status === 401) {
			refreshToken()
			getSpotifySearchData()
		}
		console.log('Error!!', err)
	})
	if (!res) {
		refreshToken()
		getSpotifySearchData()
	}
	const data = res.data['tracks']?.items
	console.log('props!!', data)
	// setResults(data)
	return { props: { data } }
}
