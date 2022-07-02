import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import styles from './chordImage.module.css'

export function ChordImage({ chordName }) {
	const [isZoomed, setIsZoomed] = useState(false)
	const [chord, setChordName] = useState(chordName)
	const imageRef = useRef(null)
	const zoomRef = useRef(null)

	function handleImageClick(e) {
		setIsZoomed(!isZoomed)
	}

	function handleImgName(name) {
		const newName = name.includes('#') ? name.replace('#', 'sharp') : name
		return newName
	}

	useEffect(() => {
		setChordName(chordName)

		const checkIfZoomClickedOutside = (e) => {
			if (zoomRef.current && !zoomRef.current.contains(e.target)) {
				setIsZoomed(false)
			}
		}
		document.addEventListener('mousedown', checkIfZoomClickedOutside)
	}, [chordName, zoomRef])

	return (
		<div className={styles.chordImageCon}>
			{chord && (
				<div
					ref={imageRef}
					className={styles.chordImage}
					style={{
						height: `10rem`,
						width: `9rem`,
						position: 'relative',
					}}
				>
					<Image
						onClick={handleImageClick}
						src={`/img/${handleImgName(chord)}.svg`}
						alt={`${chord}-img`}
						layout='fill'
					/>
					{isZoomed && (
						<div
							className={styles.chordImageZoom}
							style={{
								height: '8.8rem',
								width: '7.5rem',
							}}
							ref={zoomRef}
						>
							<Image
								onClick={handleImageClick}
								src={`/img/${handleImgName(chord)}.svg`}
								alt={`${chord}ImgZoom`}
								// height={188}
								// width={175}
								layout='fill'
							/>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
