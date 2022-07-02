import { useEffect } from 'react'

export const useOutsideClick = (e, ref, setRef) => {
	useEffect(() => {
		const checkIfClickedoutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) {
				setRef(false)
			}
		}
		// script.src = url
		// script.async = true
		// script.type = 'text/javascript'

		document.addEventListener('mousedown', checkIfClickedoutside)

		return () => {
			document.removeEventListener('mousedown', checkIfClickedoutside)
		}
	}, [e])
}

export default useOutsideClick
