import { useState, useEffect } from 'react'
import { MdOutlinePalette } from 'react-icons/md'
import Image from 'next/image'
import styles from './card.module.css'
import { Card } from './Card'
import { useRouter } from 'next/router'

export const Cards = ({ cards }) => {
	return (
		<div>
			{cards.map((card, index) => (
				<Card key={index} {...card} />
			))}
		</div>
	)
}
