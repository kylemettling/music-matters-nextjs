import logo from '../public/logo.svg'
import { useState, useEffect } from 'react'
import { MdOutlinePalette } from 'react-icons/md'
import { BackButton } from './BackButton'
import Image from 'next/image'
import Link from 'next/link'
import styles from './header.module.css'

export default function Header() {
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
// export async function getServerSideProps({ req }) {
//   try {
//     const { user } = await supabase.auth.api.getUserByCookie(req);

//     if (!user) {
//       console.log("no user~");
//       return { props: {} };
//     }
//     return { props: { user } };
//   } catch (err) {
//     console.log(err);
//     return {
//       props: {},
//     };
//   }
// }
export const getServerSideProps = async (ctx) => {
	// Create authenticated Supabase Client
	const supabase = createServerSupabaseClient(ctx)
	// Check if we have a session
	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (!session) console.log('No session in Header')
	return {
		redirect: {
			destination: '/',
			permanent: false,
		},
	}

	// Retrieve provider_token & logged in user's third-party id from metadata
	const { provider_token, user } = session
	const userId = user.user_metadata.user_name

	//   const allRepos = await (
	//     await fetch(`https://api.github.com/search/repositories?q=user:${userId}`, {
	//       method: "GET",
	//       headers: {
	//         Authorization: `token ${provider_token}`,
	//       },
	//     })
	//   ).json();

	return { props: { user, initialSession: session } }
}
