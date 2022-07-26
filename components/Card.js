import { useState, useEffect } from 'react'
import { MdOutlinePalette } from 'react-icons/md'
import Image from 'next/image'
import styles from './card.module.css'

import { useRouter } from 'next/router'

export const Card = ({ header, body, media, image }) => {
	return (
		<div>
			<span>{header}</span>
			<span>{body}</span>
			{/* <Image src={image} alt={header + 'image'} /> */}
		</div>
	)
}
