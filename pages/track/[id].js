import axios from 'axios'
import styles from './track.module.css'
import React, { useEffect, useState, useLayoutEffect, useRef } from 'react'
import { spotify } from '../../components/config/connection'
import { useChordbook } from '../../lib/hooks'
import { useAppState } from '../../lib/state'
import client from '../../lib/apollo'
import { Chordbook } from '../../components/Chordbook'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { supabase } from '../api/supabase'
import { gql, useLazyQuery, useQuery, useMutation } from '@apollo/client'

// const GET_USER_TRACK = gql`
// 	query chordbook($songId: String!, $userId: ID!) {
// 		chordbook(songId: $songId, userId: $userId) {
// 			id
// 		}
// 	}
// `

export default function TrackDetail({ session }) {
	const router = useRouter()
	const { id } = router.query
	const GET_USER_TRACK = gql`
		query chordbook($songId: String!, $userId: String!) {
			chordbook(songId: $songId, userId: $userId) {
				id
				songId
				data {
					name
					root
					mode
					type
					isErasable
					bookId
					chords {
						id
						root
						type
						position
						degree
					}
				}
			}
		}
	`
	// const [user, setUser] = useState(null)
	const [fetchData, setFetchData] = useState(false)
	const [skip, setSkip] = useState(false)
	const {
		data: trackData,
		loading,
		error,
	} = useQuery(GET_USER_TRACK, {
		variables: { songId: id, userId: session?.user?.id },
		skip: !skip && !session,
	})
	const { loadChordbooks } = useChordbook(null)
	//   const [getData, { data: trackData, loading, error }] =
	//   useLazyQuery(GET_USER_TRACK);
	const [loadedChordbooks, setLoadedChordbooks] = useState()
	const {
		songTitle,
		songArtist,
		songAlbum,
		albumCoverURL,
		artistCover,
		setTrack,
		spotifySongId,
		getStoredToken,
		songKey,
		songKeyCenterQuality,
		token,
		refreshToken,
		isActiveTrack,
		setIsActiveTrack,
		getArtistCoverURL,
		getTrackFeatures,
		chordbooks,
		createStartingBook,
		updateChordbook,
		updateChord,
		deleteBook,
		createBook,
		setChordbooks,
		updateStarterChordbook,
		sanitizeIds,
		storeChordbooks,
		// loadChordbooks,
		deleteChord,
		copyChord,
	} = useAppState()

	async function getTrack(id) {
		if (!token) {
			getStoredToken()
		}
		const options = {
			method: 'GET',
			url: spotify.urls.getTrack + id,
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}
		const fetchTrack = async () => {
			const search = await axios
				.request(options)
				.catch((err) => console.log(err))
			const data = await search?.data
			return data
		}
		const data = await fetchTrack()
		const href = await data?.artists[0]?.href
		getArtistCoverURL(href, token)
		getTrackFeatures(data?.id, token)
		setTrack(data, token)
		setIsActiveTrack(true)
	}
	// async function findUser() {
	// 	const user = await supabase.auth.user()
	// 	if (user) {
	// 		console.log('got user', user)
	// 		setUser(user)
	// 	}
	// }
	// async function refetchChordbook() {
	// 	console.log('fetching again')
	// 	getData({ variables: { songId: id, userId: user?.id } })
	// 	setChordbooks(JSON.parse(JSON.stringify(trackData.chordbook.data || '')))
	// }
	//   if (id && session && user && !isActiveTrack) {
	//     console.log("ok");
	//     getData({ variables: { songId: id, userId: user?.id } });
	//     setIsActiveTrack(true);
	//   }
	// findUser()
	useEffect(() => {
		if (typeof window !== 'undefined') {
			console.log('getting localStorage')
			setLoadedChordbooks(loadChordbooks(id))
		}
		getTrack(id)
	}, [id])
	useEffect(() => {
		if (isActiveTrack && session) {
			console.log('setting skip -> true')
			setSkip(true)
		}
		return setSkip(false)
	}, [session, isActiveTrack])
	useEffect(() => {
		if (!loading && !!trackData) {
			console.log('setting skip -> false')
			setSkip(false)
		}
	}, [loading, trackData])

	if (
		!songTitle &&
		!songKey &&
		!id &&
		!artistCover &&
		!songKey &&
		!songKeyCenterQuality
	)
		return null
	if (loading) return <div>Finding tracks!</div>
	if (error) return <pre>{JSON.stringify(error, null, 4)}</pre>

	return (
		<>
			<Head>
				<meta charSet='utf-8' />
				<title>{`${songTitle} - ${songArtist}`}</title>
				<meta name='description' content='Music Matters - Audio Arranged' />
			</Head>
			<pre style={{ display: 'flex', justifyContent: 'center' }}></pre>
			<div className={styles.track}>
				<div className={`${styles.detailCard}`}>
					<div
						className={styles.details}
						style={{
							width: artistCover?.width,
						}}
					>
						<h1 tabIndex={0} className={styles.trackTitle}>
							{songTitle}
						</h1>
						<h2 tabIndex={0} className={styles.trackArtist}>
							{songArtist}
						</h2>
						<div
							className={styles.trackCoverCon}
							style={{
								display: 'flex',
								maxWidth: '300px',
							}}
						>
							{albumCoverURL && (
								<Image
									tabIndex={0}
									className={styles.trackCover}
									src={albumCoverURL.url || '/public/logo.svg'}
									height={albumCoverURL.height || 200}
									width={albumCoverURL.width || 200}
									alt={songAlbum + ' cover'}
								></Image>
							)}
						</div>
						<h3 tabIndex={0} className={styles.trackAlbum}>
							{songAlbum}
						</h3>
					</div>
					<div
						className={styles.artistImageCon}
						style={{
							display: 'flex',
						}}
					>
						{artistCover && (
							<Image
								tabIndex={0}
								className={styles.artistImage}
								src={artistCover.url || '/public/logo.svg'}
								height={artistCover.height || 200}
								width={artistCover.width || 200}
								alt={songAlbum + ' cover'}
							></Image>
						)}
					</div>
				</div>
				<div className={`${styles.chordbookContainer} flex`}>
					{/* <span>loaded: {JSON.stringify(loadedChordbooks, null, 4)}</span> */}
					<Chordbook
						key={id}
						trackId={id}
						session={session}
						setFetchData={setFetchData}
						loadedBooks={
							JSON.parse(JSON.stringify(trackData?.chordbook?.data || '')) ||
							loadedChordbooks
						}
					/>
				</div>
			</div>
		</>
	)
}
