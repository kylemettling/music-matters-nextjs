import dynamic from 'next/dynamic'
import React from 'react'

const withNoSSR = (Component) =>
	dynamic(() => Promise.resolve(Component), { ssr: false })

export default withNoSSR
