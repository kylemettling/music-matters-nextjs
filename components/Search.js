import styles from './search.module.css'
// import './style.css'
import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { useAppState } from '../lib/state'
import chordNotes from '../lib/state'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Shazam } from './Shazam'

export default function Search({ query, API_HOST, API_KEY }) {
	const [optionState, setOptionState] = useState('track')
	const router = useRouter()
	const pathname = router.pathname
	const [searchQuery, setSearchQuery] = useState(
		query || ''
		// process.env.NODE_ENV === 'development' ? 'synchronicity II' : ''
	)
	const { token, refreshToken, getStoredToken, clearTrackData } = useAppState()

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
						e.key === 'Enter' && searchQuery !== ''
							? router.push(`/search/${searchQuery}`)
							: null
					}
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
				<button
					type='submit'
					onClick={() =>
						searchQuery !== '' ? router.push(`/search/${searchQuery}`) : null
					}
				>
					Fetch!
				</button>

				{/* {pathname !== '/' && */}
				<Shazam API_HOST={API_HOST} API_KEY={API_KEY} />
				{/* } */}
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
