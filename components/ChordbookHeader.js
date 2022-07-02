import { useState, useEffect, useRef } from 'react'
import { useAppState } from '../lib/state'
import styles from './chordbook.module.css'

export function ChordbookHeader({
	name,
	type,
	handleScaleChange,
	handleResetScale,
	handleCreateBook,
	includeControls,
	handleUpdateBook,
	handleDeleteBook,
	isErasable,

	bookId,
}) {
	const { songKey, songKeyCenterQuality } = useAppState()
	const [keySelect, setKeySelect] = useState(songKey)
	const [modeOptionState, setModeOptionState] = useState(songKeyCenterQuality)
	const [title, setTitle] = useState(name)
	const [isEditing, setIsEditing] = useState(false)
	const editRef = useRef()
	// const includeScrollRef = useRef()

	function handleEditToggle(e) {
		if (!isEditing) {
			setIsEditing(!isEditing)
		}
	}

	function handleTitleChange(e) {
		setTitle(e.target.value)
		handleUpdateBook(bookId, 'name', e.target.value)
	}
	function doubleClickHighlight(e) {
		e.target.select()
	}

	useEffect(() => {
		// if (includeScrollRef) {
		// 	includeScrollRef.current.scrollIntoView({
		// 		behavior: 'smooth',
		// 	})
		// }
		const checkIfClickedoutside = (e) => {
			if (editRef.current && !editRef.current.contains(e.target)) {
				setIsEditing(false)
			}
		}
		document.addEventListener('mousedown', checkIfClickedoutside)

		return () => {
			document.removeEventListener('mousedown', checkIfClickedoutside)
		}
	}, [songKey, songKeyCenterQuality])

	//   if (!name && !type) return null;
	// const
	return (
		<div
			className={`${styles.chordbookHeader} flex card`}
			// ref={includeScrollRef}
		>
			{type !== 'starter' && (
				<div
					className={styles.bookTitle}
					//   onKeyDown={(e) => handleEditToggle(e)}
					onClick={(e) => handleEditToggle(e)}
				>
					{isEditing && (
						<input
							tabIndex={0}
							id='innerTitleInput'
							className={styles.innerTitleInput}
							//   onKeyDown={(e) => doubleClickHighlight(e)}
							onDoubleClick={(e) => doubleClickHighlight(e)}
							ref={editRef}
							style={{ maxWidth: `${title.length + 2}ch` }}
							type='text'
							value={title}
							onChange={handleTitleChange}
						/>
					)}
					{!isEditing && (
						<span
							tabIndex={0}
							onKeyDown={(e) => handleEditToggle(e)}
							className={styles.innerTitleInput}
						>
							{title}
						</span>
					)}
				</div>
			)}
			{type === 'starter' && (
				<h5>
					<span>{title}</span>
					<br />
					<span>
						{songKey} {songKeyCenterQuality}
					</span>
				</h5>
			)}
			{type === 'starter' && (
				<div className={styles.keyModeSelect}>
					<div>
						<label htmlFor='key_selector'>Root: </label>
						<select
							aria-label='KeySelector'
							tabIndex={0}
							name='KeySelector'
							id='key_selector'
							value={keySelect}
							onChange={(e) => setKeySelect(e.target.value)}
						>
							<option value='C'>C</option>
							<option value='C#'>C#</option>
							<option value='Db'>Db</option>
							<option value='D'>D</option>
							<option value='D#'>D#</option>
							<option value='Eb'>Eb</option>
							<option value='E'>E</option>
							<option value='F'>F</option>
							<option value='F#'>F#</option>
							<option value='Gb'>Gb</option>
							<option value='G'>G</option>
							<option value='G#'>G#</option>
							<option value='Ab'>Ab</option>
							<option value='A'>A</option>
							<option value='A#'>A#</option>
							<option value='Bb'>Bb</option>
							<option value='B'>B</option>
						</select>
					</div>
					<div>
						<label htmlFor='mode_selector'>Mode:</label>
						<select
							aria-label='ModeSelector'
							name='ModeSelector'
							id='mode_selector'
							value={modeOptionState}
							onChange={(e) => setModeOptionState(e.target.value)}
						>
							<option value='ionian'>Ionian (I) - major</option>
							<option value='dorian'>Dorain (II) - minor</option>
							<option value='phrygian'>Phrygian (III) - minor</option>
							<option value='lydian'>Lydian (IV) - major</option>
							<option value='mixolydian'>Mixolydian (V) - major</option>
							<option value='aeolian'>Aeolian (VI) - minor</option>
							<option value='locrian'>Locrian (VII) - diminished</option>
						</select>
					</div>
					<div className={styles.control}>
						<button
							//   tabIndex={0}
							aria-label='keyModeReset'
							className={styles.keyModeReset}
							onKeyDown={(e) =>
								e.key === 'Enter'
									? handleScaleChange(keySelect, modeOptionState, bookId)
									: null
							}
							onClick={() => handleResetScale(bookId)}
						>
							Reset
						</button>
						<button
							//   tabIndex={0}
							aria-label='keyModeSubmit'
							className={styles.keyModeSubmit}
							onKeyDown={(e) =>
								e.key === 'Enter'
									? handleScaleChange(keySelect, modeOptionState, bookId)
									: null
							}
							onClick={() =>
								handleScaleChange(keySelect, modeOptionState, bookId)
							}
						>
							Change
						</button>
					</div>
				</div>
			)}
			{includeControls && (
				<div className={styles.chordbookControls}>
					{isErasable && (
						<button
							tabIndex={0}
							onClick={() => handleDeleteBook(bookId)}
							className={styles.remove}
						>
							-
						</button>
					)}
					{includeControls && (
						<button
							tabIndex={0}
							onClick={() => handleCreateBook(bookId)}
							className={styles.create}
						>
							+
						</button>
					)}
				</div>
			)}
		</div>
	)
}
