import styles from './search.module.css'
// import './style.css'
import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { useAppState } from '../lib/state'
import chordNotes from '../lib/state'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Search({ getSpotifyData }) {
	const [artistRequest, setArtistRequest] = useState('synchronicity')

	const [searchResult, setSearchResult] = useState('')
	const [searchToggle, setSearchToggle] = useState(false)
	const [optionState, setOptionState] = useState('track')
	const [searchQuery, setSearchQuery] = useState('synchronicity II')
	const router = useRouter()
	// const query = router.query
	const {
		token,
		refreshToken,
		getStoredToken,
		isTrackActive,
		clearTrackData,
		getScaleChords,
	} = useAppState()

	// async function getSpotifySearchData(search) {
	// 	if (!searchQuery) {
	// 		return
	// 	}

	// 	if (!token) {
	// 		refreshToken()
	// 	}
	// 	const res = await axios(
	// 		`https://api.spotify.com/v1/search?q=${search}&type=${optionState}`,
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
	// 	console.log('After request!!', res)
	// 	// if (!res) {
	// 	// 	refreshToken()
	// 	// 	getSpotifySearchData()
	// 	// }
	// 	setSearchResult(res?.data)
	// }

	useEffect(() => {
		getStoredToken()
		if (!token) {
			refreshToken()
		}
		clearTrackData()
		setOptionState(optionState)
	}, [searchQuery])

	return (
		<Fragment>
			<div className={`${styles.main} ${styles.flex}`}>
				<input
					type='text'
					placeholder='enter track, artist, or album'
					value={searchQuery}
					onKeyDown={(e) =>
						e.key === 'Enter' ? router.push(`/search/${searchQuery}`) : null
					}
					// onSubmit={() => getSpotifySearchData(searchQuery)}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<select
					name='search-type'
					id='search-type'
					value={optionState}
					onChange={(e) => setOptionState(e.target.value)}
				>
					<option value='track'>Track</option>
					<option value='artist' disabled={true}>
						Artist
					</option>
					<option value='album' disabled={true}>
						Album
					</option>
				</select>
				{/* <Link className={styles.submit} href={`/search/${searchQuery}`}> */}
				{/* <a> */}
				<button
					type='submit'
					onClick={() => router.push(`/search/${searchQuery}`)}
				>
					{/* <button type='submit' onClick={() => getSpotifyData(searchQuery)}> */}
					Fetch!
				</button>
				{/* </a> */}
				{/* </Link> */}
			</div>
			<style jsx>{`
				select,
				button {
					margin-left: 0.75rem;
				}
			`}</style>
		</Fragment>
	)
}
