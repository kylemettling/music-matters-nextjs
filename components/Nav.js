import Link from 'next/link'
import { BackButton } from './BackButton'
import { MdOutlinePalette } from 'react-icons/md'
import { useRouter } from 'next/router'
// import '../styles/globals.css'
import { useState } from 'react'
import styles from '../components/nav.module.css'
import {
	useSession,
	useSupabaseClient,
	useUser,
} from '@supabase/auth-helpers-react'

function Nav() {
	const router = useRouter()
	const session = useSession()
	const supabase = useSupabaseClient()
	const [themeToggle, setThemeToggle] = useState(true)
	//   const [session, setSession] = useState(null);

	const { pathname } = router

	function handleThemeToggle(e) {
		!themeToggle
			? document.body.classList.remove('dark')
			: document.body.classList.add('dark')
		setThemeToggle(!themeToggle)
	}
	async function signIn() {
		// const session = await supabase.auth.getSession()
		// const { data } = await supabaseClient.auth.getUser()
		// console.log(data.user.user_metadata)
		const env =
			process.env.NODE_ENV === 'production'
				? 'https://www.musicmatters.life'
				: 'http://localhost:3000'
		const { error, data } = await supabase.auth.signInWithOAuth(
			{
				provider: 'google',
			}
			// { redirectTo: `${env}/profile` }
		)
		console.log("it's a user?", data)
		if (error) {
			console.log({ error })
		}
	}

	return (
		<nav>
			{' '}
			{pathname !== '/' && <BackButton />}
			<Link href='/'> Home</Link>
			{session ? (
				<>
					<Link href='/profile'>
						{' '}
						{session?.user?.user_metadata?.full_name}
						{/* {session?.user?.user_metadata?.full_name} */}
					</Link>
					<Link href='#' onClick={() => supabase.auth.signOut()}>
						Sign Out
					</Link>
				</>
			) : (
				<Link href='#' onClick={() => signIn()}>
					Sign In
				</Link>
			)}{' '}
			<a>
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
			</a>
		</nav>
	)
}
export default Nav
