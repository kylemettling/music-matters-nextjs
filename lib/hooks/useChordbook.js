import { inRange } from 'lodash'
import { useState } from 'react'
import { useScaleChords } from '../hooks/useScaleChords'
import { supabase } from '../../pages/api/supabase'

export const useChordbook = (chordbookData) => {
	const { getScaleChords } = useScaleChords()
	const [chordbooks, setChordbooks] = useState(chordbookData)
	const [chordCount, setChordCount] = useState(0)
	const createStartingBook = (key, quality, songId) => {
		const starterBook = {
			id: 0,
			name: 'suggested scale',
			root: key,
			mode: quality,
			type: 'starter',
			isErasable: false,
			bookId: 0,
			chords: getScaleChords(key, quality),
		}
		const blankChord = {
			id: starterBook.chords.length + 1,
			root: 'drag chord',
			type: 'blank',
			position: 1,
			degree: 'down to start',
		}
		const introBook = {
			id: 1,
			name: 'intro',
			root: key,
			mode: quality,
			type: 'intro',
			bookId: 1,
			isErasable: true,
			chords: [blankChord],
		}

		const newList = [starterBook, introBook]
		const newChordCount = newList.reduce(
			(acc, curr) => acc + curr.chords.length,
			chordCount
		)
		return newList
	}
	const updateStarterChordbook = (newChords, bookId) => {
		const copy = [...chordbooks]
		const update = copy.map((book) => {
			if (book.bookId === bookId) {
				book.chords = newChords
				return book
			} else {
				return book
			}
		})
		return update
	}
	const sanitizeIds = (books) => {
		const copy = books.slice()
		let count = 0
		for (const book of copy) {
			for (let i = 0; i < book.chords.length; i++) {
				const chord = { ...book.chords[i] }
				chord.id = count
				chord.position = i + 1
				copy[book.bookId].chords[i] = chord
				count++
			}
		}
		return copy
	}
	const sanitizeChordIds = ({ chords }) => {
		const copy = Object.values(chords)
		console.log(copy)
		// let count = 0
		// for (const chord of copy) {
		// 	for (let i = 0; i < copy.length; i++) {
		// 		chord.id = count
		// 		chord.position = i + 1
		// 		count++
		// 	}
		// }
		// return copy
		return copy
	}

	const reorderChordbook = (
		chords,
		currentBookIndex,
		affectedRange,
		directionOfDrag,
		result
	) => {
		const newResult = [...chords]
		const hmm = chords.findIndex((chord) => {
			// console.log(chord, result.draggableId)
			return chord.id === parseInt(result.draggableId)
		})
		const [removed] = newResult.splice(hmm, 1)
		const copy = { ...removed }
		copy.position = result.destination.index
		console.log(result.destination.index, copy, affectedRange)
		const otherChords = []
		// const ok= newResult.reduce((acc, curr) => {}, []))
		for (let i = 0; i < newResult.length; i++) {
			if (affectedRange.includes(newResult[i].position)) {
				// console.log(affectedRange.includes(newResult[i].position))
				const [removed] = newResult.splice(i, 1)
				const affectedCopy = { ...removed }
				console.log('affectedCopy', affectedCopy, directionOfDrag)
				directionOfDrag === 'GREATER'
					? (affectedCopy.position = affectedCopy.position - 1)
					: null

				directionOfDrag === 'LESS'
					? (affectedCopy.position = affectedCopy.position + 1)
					: null
				console.log('affectedCopy after', affectedCopy)
				newResult.splice(i, 0, affectedCopy)
			} else {
				// const [removed] = newResult.splice(i, 1)
				// const copy = { ...removed }
				// newResult.push(copy)
			}
			// newResult.push
		}
		console.log('newResult', newResult)
		newResult.splice(result.destination.index - 1, 0, copy)
		console.log('newResult', newResult)
		const res = { ...newResult }
		// res[currentBookIndex] = newResult
		// otherChords.forEach((chord) => {
		// 	res[chord.id] = chord
		// })
		console.log(res)
		// return res
		return { chords: res }
	}
	const sanitizeChordbookIds = (copy) => {
		const newCopy = copy.slice()
		let count = 0
		for (let i = 0; i < copy.length; i++) {
			newCopy[i].bookId = count
			count++
		}
		return newCopy
	}

	const createBook = (id) => {
		const copy = chordbooks.slice()
		const blankChord = {
			id: 0,
			root: '',
			type: 'blank',
			position: 1,
			degree: '',
		}
		const newBook = {
			name: 'new',
			root: '',
			mode: '',
			type: '',
			bookId: chordbooks.length + 1,
			isErasable: true,
			chords: [blankChord],
		}
		copy.splice(id + 1, 0, newBook)

		const newBookIds = sanitizeChordbookIds(copy)
		const newChordIds = sanitizeIds(newBookIds)
		setChordbooks(newChordIds)
		storeChordbooks(newChordIds, id)
	}

	const deleteBook = (id) => {
		const copy = chordbooks.slice()
		const newList = copy.filter((book) => book.id !== id)
		const count = newList.reduce(
			(acc, curr) => acc + curr.chords.length,
			chordCount
		)
		setChordbooks(newList)
		setChordCount(count)
		storeChordbooks(chordbooks, id)
	}

	const updateChordbook = (id, property, value) => {
		const copy = chordbooks.slice()
		const update = copy.map((book) => {
			if (book.id === id) {
				book[property] = value
				return book
			} else {
				return book
			}
		})
		setChordbooks(update)
		storeChordbooks(chordbooks, id)
	}
	// update chord from passing ids of book and chord and the property to update with the new value
	const updateChord = (bookId, id, property, value) => {
		const copy = chordbooks.slice()
		const update = copy.map((book) => {
			if (book.id === parseInt(bookId)) {
				book.chords.map((chord) => {
					if (chord.id === id) {
						chord[property] = value
						return chord
					} else {
						return chord
					}
				})
				return book
			} else {
				return book
			}
		})
		setChordbooks(update)
	}
	const storeChordbooks = (books, songId) => {
		localStorage.setItem(songId, JSON.stringify(books))
	}
	const loadChordbooks = (id) => {
		let stored = JSON.parse(localStorage.getItem(id))
		return stored
	}
	const deleteChord = (id, bookId) => {
		const copy = chordbooks.slice()
		const filteredChords = copy[bookId].chords.filter((chord) => {
			return chord.id !== id
		})
		copy[bookId].chords = filteredChords
		const newIds = sanitizeIds(copy)
		setChordbooks(newIds)
	}
	const copyChord = (id, bookId) => {
		const copy = chordbooks.slice()
		const chordCopy = copy[bookId].chords.filter((chord) => chord.id === id)
		chordCopy.id = Object.entries(copy[bookId]).reduce((acc, curr) => {
			return curr.id > acc ? curr.id : acc
		}, 0)
		chordCopy.position = copy[bookId].chords.length + 1
		// console.log(chordCopy, ));
		// console.log(chordCopy);
		const update = copy[bookId].chords.concat(chordCopy)
		copy[bookId].chords = update
		// const newIds = sanitizeIds(copy)
		// console.log(newIds)
		// setChordbooks(newIds)
	}

	// const clearChordbook = () => {

	// }

	return {
		chordbooks,
		createStartingBook,
		updateChordbook,
		updateChord,
		reorderChordbook,
		deleteBook,
		createBook,
		setChordbooks,
		updateStarterChordbook,
		sanitizeIds,
		sanitizeChordIds,
		storeChordbooks,
		loadChordbooks,
		deleteChord,
		copyChord,
	}
}
