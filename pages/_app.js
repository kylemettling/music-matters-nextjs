import styles from '../components/header.module.css'
import '../styles/globals.css'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PageWrapper } from '../lib/state'
import Header from '../components/Header'
import { supabase } from '../pages/api/supabase'
import { useRouter } from 'next/router'
import { ApolloProvider, gql, useQuery } from '@apollo/client'
import client from '../lib/apollo'
import { BackButton } from '../components/BackButton'
import { MdOutlinePalette } from 'react-icons/md'

function MyApp({ Component, pageProps }) {
	const [themeToggle, setThemeToggle] = useState(true)
	const router = useRouter()
	const [session, setSession] = useState(null)
	const { pathname } = router
	function handleThemeToggle(e) {
		!themeToggle
			? document.body.classList.remove('dark')
			: document.body.classList.add('dark')
		setThemeToggle(!themeToggle)
	}

	async function signIn() {
		const env =
			process.env.NODE_ENV === 'production'
				? 'https://www.musicmatters.life'
				: 'http://localhost:3000'
		const { error, data } = await supabase.auth.signIn(
			{
				provider: 'google',
			},
			{ redirectTo: env }
		)
		console.log(data)
		if (error) {
			console.log({ error })
		}
	}
	async function signOut() {
		const { error } = await supabase.auth.signOut()
		if (error) {
			console.log({ error })
		}
		router.push('/')
	}
	useEffect(() => {
		setSession(supabase.auth.session())
		supabase.auth.onAuthStateChange((_event, session) => {
			if (_event === 'SIGNED_IN') {
				console.log('signed in :D')
				setSession(session)
			}
			if (_event === 'SIGNED_OUT') {
				console.log('signed out :O')
				setSession(null)
			}
		})
	}, [session])

	return (
		<PageWrapper>
			<ApolloProvider client={client}>
				<nav>
					{' '}
					{pathname !== '/' && <BackButton />}
					<Link href='/'>
						<a>Home</a>
					</Link>
					{session ? (
						<>
							<Link href='/profile'>
								<a>{session?.user?.user_metadata?.full_name}</a>
							</Link>
							<Link href='#'>
								<a onClick={() => signOut()}>Sign Out</a>
							</Link>
						</>
					) : (
						<Link href='#'>
							<a onClick={() => signIn()}>Sign In</a>
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
							onKeyDown={(e) =>
								e.key === 'Enter' ? handleThemeToggle(e) : null
							}
							onKeyUp={() => null}
							onClick={(e) => handleThemeToggle(e)}
						/>
					</a>
				</nav>
				<Header
					includeBackButton={router.pathname !== '/' ? true : false}
					session={session}
				/>
				<Component {...pageProps} session={session} />
				<style jsx>{``}</style>
			</ApolloProvider>
		</PageWrapper>
	)
}

export default MyApp
{
	/* <Image
											src={session?.user?.user_metadata.picture}
											height={60}
											width={60}
											style={{ borderRadius: '50%' }}
										/> */
}
