import { useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'

export default function SignIn() {
	const [email, setEmail] = useState('')
	const [submitted, setSubmitted] = useState(false)
	const supabase = useSession()
	async function signIn() {
		const { error, data } = await supabase.auth.signIn({
			provider: 'google',
		})
		console.log('DATA', data)
		if (error) {
			console.log({ error })
		} else {
			setSubmitted(true)
		}
	}

	if (submitted) {
		return (
			<div>
				<h1>Please check your email to sign in :D</h1>
			</div>
		)
	}
	return (
		<div>
			<main>
				<h1>Sign In w/ Google</h1>
				{/* <input onChange={(e) => setEmail(e.target.value)} /> */}
				<button onClick={() => signIn()}>Sign In</button>
				<span>Or continue as a guest!</span>
			</main>
		</div>
	)
}
