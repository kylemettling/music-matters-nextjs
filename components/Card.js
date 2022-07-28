import { useEffect, useState, createElement } from 'react'
import { IconContext } from 'react-icons'
import { Fc, FcGoogle } from 'react-icons/fc'
import { Ri, RiSoundModuleLine } from 'react-icons/ri'
import { Md, MdSwapCalls } from 'react-icons/md'
import { Bs, BsArrowsMove } from 'react-icons/bs'
import Image from 'next/image'
import styles from './card.module.css'
import ReactPlayer from 'react-player'
const icons = ['RiSoundModuleLine', 'BsArrowsMove', 'MdSwapCalls', 'FcGoogle']

export const Card = ({ id, header, body, media }) => {
	function Icon(iconName) {
		const iconFamily = (iconName) => {
			switch (iconName) {
				case 'RiSoundModuleLine':
					// iconFamily = Ri[iconName]
					iconFamily = <RiSoundModuleLine />
					break
				case 'BsArrowsMove':
					// iconFamily = Bs[iconName]
					iconFamily = <BsArrowsMove />
					break
				case 'MdSwapCalls':
					// iconFamily = Md[iconName]
					iconFamily = <MdSwapCalls />
					break
				case 'FcGoogle':
					iconFamily = Fc[iconName]
				// iconFamily = <FcGoogle />
			}
		}
		console.log(iconFamily)
		const icon = createElement(iconFamily, { className: styles.icon, key: id })
		console.log(icon)
		return (
			<IconContext.Provider value={{ className: styles.icon }}>
				{icon}
			</IconContext.Provider>
		)
	}
	console.log(Icon)
	const [hasWindow, setHasWindow] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setHasWindow(true)
		}
	}, [])

	return (
		<div className={`${styles.card} item-${id} flex`}>
			<span>
				<div
				// style={{
				// 	display: 'inline',
				// 	justifyContent: 'center',
				// }}
				>
					{' '}
					{hasWindow && <Icon iconName={icons[id]} />}
				</div>
				<h4>{header}</h4>
			</span>
			{hasWindow && media.endsWith('mp4') ? (
				<div className={`${styles.video} `}>
					<ReactPlayer
						className='react-player'
						url={`/img/cards/${media}`}
						width='100%'
						height='100%'
						muted={true}
						playing={true}
						playbackRate={0.7}
						loop={true}
					/>
				</div>
			) : (
				<div className={`${styles.image} `}>
					<Image
						src={`/img/cards/${media}`}
						alt={`${header}`}
						layout='responsive'
						height={561}
						width={2350}
					/>
				</div>
			)}
			<span className={styles.cardBody}>{body}</span>
		</div>
	)
}
