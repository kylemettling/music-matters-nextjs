// import React from "react";
import { FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'
import { useRouter } from 'next/router'
// import styles from '../styles/globals.css'
// import { useHistory } from "react-router-dom";

export function BackButton() {
	const router = useRouter()
	return (
		<div
			className='backButton flex'
			style={
				{
					// top: '0',
					// padding: '0 .75%',
					// position: 'sticky',
					// top: '0.25rem',
					// left: '0',
				}
			}
		>
			<a
				// className={styles.backButton}
				aria-label='back'
				name='back'
				style={
					{
						// width: '85px',
						// height: '35px',
						// // margin: '0 13%',
						// display: 'flex',
						// flexDirection: 'row',
						// justifyContent: 'center',
					}
				}
				onClick={() => router.back()}
			>
				<FiArrowLeft
					style={
						{
							// padding: '0px',
							// margin: '0px',
							// bottom: '10px',
						}
					}
				/>{' '}
				{/* Back */}
			</a>
		</div>
	)
}
