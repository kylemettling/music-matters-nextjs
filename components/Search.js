import styles from './search.module.css'
// import './style.css'
import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { useAppState } from '../lib/state'
import chordNotes from '../lib/state'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Search() {
	const [optionState, setOptionState] = useState('track')
	const [searchQuery, setSearchQuery] = useState(
		process.env.NODE_ENV === 'development' ? 'synchronicity II' : ''
	)
	const router = useRouter()
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
						e.key === 'Enter' ? router.push(`/search/${searchQuery}`) : null
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
					onClick={() => router.push(`/search/${searchQuery}`)}
				>
					Fetch!
				</button>
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
