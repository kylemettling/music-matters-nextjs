import styles from '../components/header.module.css'
import '../styles/globals.css'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PageWrapper } from '../lib/state'
import Header from '../components/Header'
// import { supabase } from "../pages/api/supabase";
import { useRouter } from 'next/router'
import { ApolloProvider, gql, useQuery } from '@apollo/client'
import client from '../lib/apollo'
import { BackButton } from '../components/BackButton'
import { MdOutlinePalette } from 'react-icons/md'
import { Shazam } from '../components/Shazam'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, useUser } from '@supabase/auth-helpers-react'

function MyApp({
	Component,

	pageProps,
}) {
	const [supabaseClient] = useState(() => createBrowserSupabaseClient())
	const user = useUser()
	const [themeToggle, setThemeToggle] = useState(true)
	const router = useRouter()
	//   const [session, setSession] = useState(null);
	const { pathname } = router
	function handleThemeToggle(e) {
		!themeToggle
			? document.body.classList.remove('dark')
			: document.body.classList.add('dark')
		setThemeToggle(!themeToggle)
	}

	async function checkIfUser() {}

	async function signIn() {
		// const session = await supabase.auth.getSession()
		// const { data } = await supabaseClient.auth.getUser()
		// console.log(data.user.user_metadata)
		const env =
			process.env.NODE_ENV === 'production'
				? 'https://www.musicmatters.life'
				: 'http://localhost:3000'
		const { error, data } = await supabaseClient.auth.signInWithOAuth(
			{
				provider: 'google',
			},
			{ redirectTo: `${env}/profile` }
		)
		console.log("it's a user?", data)
		if (error) {
			console.log({ error })
		}
	}
	async function signOut() {
		const { error } = await supabaseClient.auth.signOut()
		if (error) {
			console.log({ error })
		}
		router.push('/')
	}
	// useEffect(() => {
	//   setSession(supabase.auth.session())
	//   supabase.auth.onAuthStateChange((_event, session) => {
	//     if (_event === "SIGNED_IN") {
	//       console.log("signed in :D");
	//       setSession(session);
	//     }
	//     if (_event === "SIGNED_OUT") {
	//       console.log("signed out :O");
	//       setSession(null);
	//     }
	//   });
	// }, [session]);

	return (
		<PageWrapper>
			<SessionContextProvider
				supabaseClient={supabaseClient}
				initialSession={pageProps.initialSession}
			>
				<ApolloProvider client={client}>
					{/* <nav>
						{' '}
						{pathname !== '/' && <BackButton />}
						<Link href='/'> Home</Link>
						{pageProps.initialSession ? (
							<>
								<Link href='/profile'>
									{' '}
									{
										pageProps.initialSession.session?.user?.user_metadata
											?.full_name
									} 
								</Link>
								<Link href='#' onClick={() => signOut()}>
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
								onKeyDown={(e) =>
									e.key === 'Enter' ? handleThemeToggle(e) : null
								}
								onKeyUp={() => null}
								onClick={(e) => handleThemeToggle(e)}
							/>
						</a>
					</nav> */}
					{/* <Header includeBackButton={router.pathname !== '/' ? true : false} /> */}
					{/* <div style={{ display: 'flex', justifyContent: 'center' }}>
						{JSON.stringify(user)}
						{JSON.stringify(pageProps.initialSession)}
					</div> */}
					<Component {...pageProps} />
				</ApolloProvider>
			</SessionContextProvider>
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
