import logo from '../public/logo.svg'
import { useState, useEffect } from 'react'
import { MdOutlinePalette } from 'react-icons/md'
import { BackButton } from './BackButton'
import Image from 'next/image'
import Link from 'next/link'
import styles from './header.module.css'
import { supabase } from '../pages/api/supabase'

export default function Header({ session }) {
	const [themeToggle, setThemeToggle] = useState(true)
	const [user, setUser] = useState(null)

	function handleThemeToggle(e) {
		!themeToggle
			? document.body.classList.remove('dark')
			: document.body.classList.add('dark')
		setThemeToggle(!themeToggle)
	}
	async function findUser() {
		const user = await supabase.auth.user()
		if (user) {
			setUser(user)
		}
	}
	useEffect(() => {
		findUser()
	}, [themeToggle, session])

	return (
		<>
			<div className={styles.header}>
				<Link
					href='/'
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
				</Link>
			</div>
		</>
	)
}
