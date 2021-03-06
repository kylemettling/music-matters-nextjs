import React, { useEffect, useState } from 'react'
import { useAppState } from '../../lib/state'
import axios from 'axios'
import { Result } from '../../components/Result'
import styles from '../../components/results.module.css'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Search from '../../components/Search'

export default function Results() {
	const router = useRouter()
	const { query } = router.query
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

		if (!token) {
			refreshToken()
		}
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
		// }
		// getData()
		// console.log('not here!!!!')
	}
	useEffect(() => {
		// setChordbooks([])
		getSpotifySearchData(query)
		// return () => {
		//   setChordbooks([]);
		//   clearTrackData();
		// };
	}, [])

	// if (!query) return null

	return (
		<React.Fragment>
			<Head>
				<meta charSet='utf-8' />
				<title>Results | {query} </title>
				<meta name='description' content='Music Matters - Audio Arranged' />
			</Head>
			<Search
			//  getSpotifyData={getSpotifySearchData}
			/>
			{/* <span>
				{`key:${songKey}, mode:${songKeyCenterQuality}, books:${JSON.stringify(
					chordbooks,
					null,
					4
				)}`}
			</span> */}
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
