import { useState, useEffect } from 'react'
import { supabase } from '../pages/api/supabase'
import { useRouter } from 'next/router'
import { gql, useLazyQuery } from '@apollo/client'
import { useAppState } from './../lib/state/PageWrapper'
import { spotify } from '../components/config/connection'
import axios from 'axios'
import { Result } from './../components/Result'
import styles from '../components/result.module.css'
import Image from 'next/image'
const GET_ALL_USER_TRACKS = gql`
	query userChordbooks($userId: String!) {
		userChordbooks(userId: $userId) {
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
export default function Profile() {
	const { token, getStoredToken } = useAppState()
	const [profile, setProfile] = useState(null)
	const [allTracks, setAllTracks] = useState([])
	const router = useRouter()
	const [getUserTracks, { data, loading, error }] =
		useLazyQuery(GET_ALL_USER_TRACKS)

	useEffect(() => {
		fetchProfile()
	}, [])
	useEffect(() => {
		if (!loading && !!data) {
			getSpotifyTracks(data?.userChordbooks)
		}
	}, [loading, data])

	async function fetchProfile() {
		const profileData = await supabase.auth.user()
		if (!profileData) {
			router.push('/sign-in')
		} else {
			setProfile(profileData)
			getUserTracks({ variables: { userId: profileData.id } })
		}
	}
	async function getSpotifyTracks(trackIds) {
		if (!token) {
			getStoredToken()
		}
		const filter = trackIds.map((track) => track.songId).join(',')
		const options = {
			method: 'GET',
			url: spotify.urls.getTracks + filter,
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
		setAllTracks(data?.tracks)
	}

	if (!profile) return null
	if (error) return <div>{error}</div>
	// if (loading) return null
	return (
		<div style={{ textAlign: 'center' }}>
			<h2>{`${profile.user_metadata.full_name}'s recent books:`}</h2>
			<ul className={`${styles.profileResults} grid`}>
				{allTracks &&
					allTracks.map((track, i) => {
						return <Result key={i} track={track} index={i} profile={true} />
					})}
			</ul>
			{loading && (
				<div>{`Loading ${profile.user_metadata.full_name}'s chordbooks...`}</div>
			)}
		</div>
	)
}
