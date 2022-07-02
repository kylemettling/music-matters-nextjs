import logo from '../public/logo.svg'
import { useState, useEffect } from 'react'
import { MdOutlinePalette } from 'react-icons/md'
import { BackButton } from './BackButton'
import Image from 'next/image'
import Link from 'next/link'
import styles from './header.module.css'
import { supabase } from '../pages/api/supabase'
import { useRouter } from 'next/router'

export default function Header({ session }) {
	const [themeToggle, setThemeToggle] = useState(true)
	const router = useRouter()
	const { pathname } = router
	const [user, setUser] = useState(null)
	// const user = await supabase.auth.user()

	function handleThemeToggle(e) {
		// console.log('toggled')
		!themeToggle
			? document.body.classList.remove('dark')
			: document.body.classList.add('dark')
		setThemeToggle(!themeToggle)
	}
	async function findUser() {
		const user = await supabase.auth.user()
		if (user) {
			setUser(user)
			// console.log('USER IN FINDUSER', user, session)
		}
	}
	useEffect(() => {
		findUser()
	}, [themeToggle, session])

	return (
		<>
			<div className={styles.header}>
				{/* <div>{JSON.stringify(user)}</div> */}
				{/* <div>{JSON.stringify(pathname)}</div> */}
				<Link href='/'>
					<a
						style={{
							height: '125px',
							width: '700px',
							position: 'relative',
						}}
					>
						<Image
							aria-label='logo'
							name='logo'
							src={logo}
							layout='fill'
							className={styles.logo}
							alt='logo'
							priority
						/>
					</a>
				</Link>
			</div>
			{/* <div className={styles.settings}>
				{pathname !== '/' && <BackButton />}
				<MdOutlinePalette
					tabIndex='0'
					aria-label='theme select'
					className={`${styles.themeSelect} ${
						!themeToggle
							? styles.themeSelectBackward
							: styles.themeSelectForward
					}`}
					onKeyDown={(e) => (e.key === 'Enter' ? handleThemeToggle(e) : null)}
					onKeyUp={() => null}
					onClick={(e) => handleThemeToggle(e)}
				/>
			</div> */}
		</>
	)
}
