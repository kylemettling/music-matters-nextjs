import { supabase } from '../src/api/supabase'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Logout() {
	const router = useRouter()

	useEffect(() => {
		const initialize = async () => await supabase.auth.api.signOut()

		initialize()

		const { data: authListener } = supabase.auth.onAuthStateChange(
			async (event, session) => {
				const body = JSON.stringify({ event, session })
				const headers = new Headers({ 'Content-Type': 'application/json' })
				await fetch('/', {
					method: 'POST',
					body,
					headers,
					credentials: 'same-origin',
				})
				router.push('/')
			}
		)
		return () => {
			authListener.unsubscribe()
		}
	}, [])
	return <></>
}
