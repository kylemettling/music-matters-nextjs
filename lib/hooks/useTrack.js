import { useState, useEffect } from 'react'
import { spotify } from '../../components/config/connection'
import axios from 'axios'
import keyTranslation from '../state/keyTranslation'

export const useTrack = () => {
	const [isActiveTrack, setIsActiveTrack] = useState(false)
	const [songTitle, setSongTitle] = useState('')
	const [songArtist, setSongArtist] = useState('')
	const [songAlbum, setSongAlbum] = useState('')
	const [songKey, setSongKey] = useState('')
	const [songKeyCenterQuality, setKeyCenterQuality] = useState('')
	const [spotifySongId, setSpotifySongId] = useState('')
	const [albumCoverURL, setAlbumCoverURL] = useState({
		url: '',
		height: '',
		width: '',
	})
	const [isStoredTrack, setIsStoredTrack] = useState(false)
	const [artistCover, setArtistCover] = useState({
		url: '',
		height: '',
		weight: '',
	})

	async function getTrackFeatures(id, token) {
		if (id !== '' && token !== '') {
			const options = {
				method: 'GET',
				url: spotify.urls.getTrackFeatures + id,
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}
			const fetchTrackFeatures = async () => {
				// try {
				const search = await axios
					.request(options)
					.catch((err) => console.log(err))

				const featureData = search?.data
				const keyCenter = featureData?.mode === 1 ? 'mixolydian' : 'aeolian'
				const key = keyTranslation[featureData.key]
				// console.log("here'key, keyCenter)
				setSongKey(key)
				setKeyCenterQuality(keyCenter)
			}
			fetchTrackFeatures()
			// } catch (err) {
			// 	console.log(err)
			// }
		}
	}
	const setTrack = async (data, token) => {
		// console.log('data here', data)
		const artistName = data?.artists[0]?.name
		const {
			url = '',
			height,
			width,
		} = await data?.album?.images?.filter((img) => {
			return img.width === 640 ? img : null
		})[0]
		setSpotifySongId(data?.id)
		setSongTitle(data?.name)
		setSongArtist(artistName)
		setSongAlbum(data?.album?.name)
		setAlbumCoverURL({
			url,
			height,
			width,
		})
		setIsActiveTrack(true)
	}
	const getArtistCoverURL = (data, token) => {
		if (data !== '' && token !== '') {
			const options = {
				method: 'GET',
				url: data,
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}
			const fetchArtistDetails = async () => {
				const search = await axios
					.request(options)
					.catch((err) => console.log(err))
				const artistData = await search?.data
				const { url, height, width } = artistData?.images[0]
				// console.log("artist image", url, height, width);
				setArtistCover({
					url,
					height,
					width,
				})
			}
			fetchArtistDetails()
		}
	}

	const storeTrack = () => {
		localStorage.setItem('songTitle', songTitle)
		localStorage.setItem('songArtist', songArtist)
		localStorage.setItem('songAlbum', songAlbum)
		localStorage.setItem('songKey', songKey)
		localStorage.setItem('songMode', songKeyCenterQuality)
		localStorage.setItem('spotifySongId', spotifySongId)
		localStorage.setItem('albumCoverURL', albumCoverURL)
		localStorage.setItem('artistURL', artistCover.url)
	}

	const clearTrackData = () => {
		setSpotifySongId('')
		setSongTitle('')
		setSongArtist('')
		setSongAlbum('')
		setAlbumCoverURL({
			url: '',
			height: '',
			width: '',
		})
		setArtistCover({
			url: '',
			height: '',
			width: '',
		})
		setSongKey('')
		setKeyCenterQuality('')
		setIsActiveTrack(false)
	}
	return {
		songTitle,
		songArtist,
		songAlbum,
		songKey,
		songKeyCenterQuality,
		spotifySongId,
		albumCoverURL,
		artistCover,
		setTrack,
		isStoredTrack,
		isActiveTrack,
		clearTrackData,
		setIsActiveTrack,
		getTrackFeatures,
		getArtistCoverURL,
	}
}
