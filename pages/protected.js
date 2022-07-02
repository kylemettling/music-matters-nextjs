import { supabase } from '../src/api/supabase'
import Image from 'next/image'

export default function Protected({ user }) {
	console.log('user in /protected =>', user)

	return (
		<div>
			<h2>Hello from protected route!</h2>
			<p>{JSON.stringify(user)}</p>
			<p>{JSON.stringify(user.user_metadata.avatar_url)}</p>
			<Image
				src={user.user_metadata.avatar_url}
				height='400px'
				width='400px'
				alt={`${user.user_metadata.full_name}`}
			/>
		</div>
	)
}

export async function getServerSideProps({ req }) {
	const { user } = await supabase.auth.api.getUserByCookie(req)

	if (!user) {
		return { props: {}, redirect: { destination: '/sign-in' } }
	}

	return { props: { user } }
}
