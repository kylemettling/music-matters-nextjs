import React from 'react'
import styles from './result.module.css'
import Link from 'next/link'
import Image from 'next/image'

export function Result({ track, index, profile = false }) {
	return (
		<Link href={`/track/${track.id}`}>
			<li className={`${styles.result}`} key={index}>
				<div className={`${styles.resultDetails}`}>
					<span className={styles.titleCon}>
						<Link href={`/track/${track.id}`} className={styles.title}>
							{track.title || track.name}
						</Link>
					</span>
					<span>
						<Link href={`/`} className={styles.artist}>
							{track.artists[0].name}
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
				<div className={styles.imageCon}>
					<Image
						className={styles.albumImage}
						layout='responsive'
						height={250}
						width={250}
						src={
							track.album.images[0].url ||
							'https://is5-ssl.mzstatic.com/image/thumb/Features115/v4/cc/62/0c/cc620ccb-c10d-c538-ce73-06cf185b3303/mzl.ynbraxen.jpg/800x800cc.jpg'
						}
						alt={[track.title || track?.name] + ' cover'}
					/>
				</div>
			</li>
		</Link>
	)
}
