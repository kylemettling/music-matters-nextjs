import Head from 'next/head'
import Search from '../components/Search'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Cards } from '../components/Cards'
import { cards } from '../lib/state/cards'
import Nav from '../components/Nav'
import Header from '../components/Header'
import { useUser } from '@supabase/auth-helpers-react'

export default function Home({ API_KEY, API_HOST }) {
	const [profile, setProfile] = useState('')
	const user = useUser()
	const router = useRouter()

	return (
		<div>
			<Head>
				<meta charSet='utf-8' />
				<title>Music Matters | Home</title>
				<meta name='description' content='Music Matters - Audio Arranged' />
			</Head>

			<main>
				<Header />
				<Nav />
				<h2>Have something playing?</h2>

				<Search API_HOST={API_HOST} API_KEY={API_KEY} />
				<Cards cards={cards} />
			</main>
		</div>
	)
}

export async function getStaticProps() {
	const API_KEY = process.env.X_RAPID_API_KEY
	const API_HOST = process.env.X_RAPID_API_HOST

	return {
		props: { API_HOST, API_KEY },
	}
}
