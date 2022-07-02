import React from 'react'
import styles from './results.module.css'
import Link from 'next/link'
import Image from 'next/image'

export function Result({ track, index }) {
	return (
		<li className={`${styles.result} flex card`} key={index}>
			<div className={`${styles.resultDetails} flex`}>
				<span className={styles.titleCon}>
					<Link
						href={
							`/track/${track.id}`
							// 	{
							// 	pathname: `/${type}/${track.key || track.id}`,
							// 	state: { token: token },
							// }
						}
					>
						<a className={styles.title}>{track.title || track.name}</a>
					</Link>
				</span>
				<span>
					<Link
						href={
							// TODO Artist(pages)
							// `/artist/${track.artists[0].id}`
							`/`
						}
					>
						<a className={styles.artist}>{track.artists[0].name}</a>
					</Link>
				</span>
				<div className={`${styles.releaseTime} flex`}>
					<span>
						{new Date(track.duration_ms).getMinutes()}m
						{new Date(track.duration_ms).getSeconds()}s
					</span>
					<span>{track.album.release_date.split('-')[0]}</span>
				</div>
			</div>
			<div
				// className={styles.album}
				style={{
					padding: '1rem',
					height: '225px',
					width: '225px',
					display: 'flex',
					justifyContent: 'center',
					alignContent: 'center',
				}}
			>
				<Image
					className={styles.albumImage}
					style={
						{
							// margin: '3rem',
						}
					}
					height={track.album.images[0].height}
					width={track.album.images[0].width}
					// objectFit='contain'
					src={
						track.album.images[0].url ||
						'https://is5-ssl.mzstatic.com/image/thumb/Features115/v4/cc/62/0c/cc620ccb-c10d-c538-ce73-06cf185b3303/mzl.ynbraxen.jpg/800x800cc.jpg'
					}
					alt={[track.title || track?.name] + ' cover'}
				/>
			</div>
		</li>
	)
}
