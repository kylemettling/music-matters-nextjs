/** @type {import('next').NextConfig} */
const nextConfig = {
	// reactStrictMode: true,
	env: {
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	},
	images: {
		domains: ['lh3.googleusercontent.com', 'i.scdn.co'],
	},
}

module.exports = nextConfig
