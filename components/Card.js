import { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { RiSoundModuleLine } from 'react-icons/ri'
import { MdSwapCalls } from 'react-icons/md'
import { VscGitPullRequestCreate } from 'react-icons/vsc'
import { BsArrowsMove } from 'react-icons/bs'
import Image from 'next/image'
import styles from './card.module.css'
import ReactPlayer from 'react-player'
import { render } from 'react-dom'
const icons = [RiSoundModuleLine, BsArrowsMove, MdSwapCalls, FcGoogle]

export const Card = ({ id, header, body, media }) => {
	const Icon = icons[`${id}`]
	const [hasWindow, setHasWindow] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setHasWindow(true)
		}
	}, [])

	return (
		<div className={`${styles.card} flex`}>
			<div>
				<h4>{header}</h4>
				<Icon />
			</div>
			{hasWindow && media.endsWith('mp4') ? (
				<div className={`${styles.video} flex`}>
					<ReactPlayer
						url={`/img/cards/${media}`}
						width='100%'
						height='100%'
						muted={true}
						playing={true}
						loop={true}
					/>
				</div>
			) : (
				<div className={`${styles.image}`}>
					<Image src={`/img/cards/${media}`} height={200} width={300} />
				</div>
			)}
			<span>{body}</span>
		</div>
	)
}
