import React, { useEffect, useState } from 'react'
import { useAppState } from '../../lib/state'
import axios from 'axios'
import { Result } from '../../components/Result'
import styles from '../../components/result.module.css'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Search from '../../components/Search'
import { Shazam } from '../../components/Shazam'
import Nav from '../../components/Nav'
import Header from '../../components/Header'

export default function SearchQuery({ API_KEY, API_HOST }) {
	const router = useRouter()
	const { query } = router.query || ''
	const [results, setResults] = useState([])
	const {
		token,
		refreshToken,
		songKey,
		songKeyCenterQuality,
		setChordbooks,
		chordbooks,
		clearTrackData,
	} = useAppState()

	async function getSpotifySearchData(query) {
		if (!query) {
			return
		}

		refreshToken()
		// const getData = async () => {
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
				console.log('404!!!', err)
			}
			console.log('Error!!', err)
		})
		if (!res) {
			refreshToken()
			getSpotifySearchData()
		}
		const data = res?.data['tracks']?.items

		setResults(data)
	}
	useEffect(() => {
		if (!token) {
			refreshToken()
		}
	}, [])
	useEffect(() => {
		// if (token) {
		getSpotifySearchData(query)
		// }
	}, [query])

	return (
		<React.Fragment>
			<Head>
				<meta charSet='utf-8' />
				<title>Results | {query}</title>
				<meta name='description' content='Music Matters - Audio Arranged' />
			</Head>
			<Header />
			<Nav />
			<Search query={query} API_HOST={API_HOST} API_KEY={API_KEY} />
			{results && (
				<ul className={`${styles.results} grid`}>
					{results &&
						results.map((track, i) => (
							<Result
								key={i}
								index={i}
								track={track}
								type='track'
								token={token}
							/>
						))}
				</ul>
			)}
		</React.Fragment>
	)
}
export async function getStaticProps(context) {
	const API_KEY = process.env.X_RAPID_API_KEY
	const API_HOST = process.env.X_RAPID_API_HOST
	return {
		props: { API_KEY, API_HOST },
	}
}

export const getStaticPaths = async () => {
	return {
		paths: [], //indicates that no page needs be created at build time
		fallback: 'blocking', //indicates the type of fallback
	}
}
