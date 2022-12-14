import Image from 'next/image'
import { useUser, useSession } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { useRouter } from 'next/router'
export default function Protected() {
	const router = useRouter()
	const session = useSession()
	const user = useUser()
	if (!session) router.push('/sign-in')

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
