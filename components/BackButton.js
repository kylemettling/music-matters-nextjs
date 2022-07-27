// import React from "react";
import { FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'
import { useRouter } from 'next/router'
// import styles from '../styles/globals.css'
// import { useHistory } from "react-router-dom";

export function BackButton() {
	const router = useRouter()
	return (
		<div className='backButton flex'>
			<a aria-label='back' name='back' onClick={() => router.back()}>
				<FiArrowLeft />
			</a>
		</div>
	)
}
