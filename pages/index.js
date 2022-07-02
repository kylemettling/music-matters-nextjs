import Head from 'next/head'
import Search from '../components/Search'
import { supabase } from '../pages/api/supabase'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Home({ user, session }) {
	const [profile, setProfile] = useState('')
	async function checkUser() {
		const user = await supabase.auth.user()

		if (user) {
			setProfile(user)
		}
	}

	useEffect(() => {
		checkUser()
		if (!session) {
			setProfile(null)
		}
	}, [session])

	async function signIn() {
		const { error, data } = await supabase.auth.signIn({
			provider: 'google',
		})
		console.log('data inside index signIn()', data)
		if (error) {
			console.log(error)
		}
	}
	return (
		<div>
			<Head>
				<meta charSet='utf-8' />
				<title>Music Matters | Audio Arranged</title>
				<meta name='description' content='Music Matters - Audio Arranged' />
			</Head>

			<main>
				<h2>Do you have something playing?</h2>
				<Search />
				{/* {!session && !profile ? (
					<div>
						<button onClick={() => signIn()}>Sign In w/ Google</button>
						<span>Or continue as a guest!</span>
					</div>
				) : (
					<div>
						<h1>Welcome back, {profile?.user_metadata?.full_name}!</h1>
						<pre style={{ textAlign: 'center' }}>
							{JSON.stringify(profile, null, 2)}
						</pre>
					</div>
				)} */}
			</main>
		</div>
	)
}

export async function getServerSideProps({ req }) {
	try {
		const { user } = await supabase.auth.api.getUserByCookie(req)

		if (!user) {
			console.log('no user~')
			return { props: {} }
		}
		return { props: { user } }
	} catch (err) {
		console.log(err)
	}
}
