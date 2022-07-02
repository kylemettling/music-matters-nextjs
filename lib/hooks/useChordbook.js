import { inRange } from 'lodash'
import { useState } from 'react'
import { useScaleChords } from '../hooks/useScaleChords'
import { supabase } from '../../pages/api/supabase'

export const useChordbook = (chordbookData) => {
	console.log('in useChordbook', chordbookData)
	const { getScaleChords } = useScaleChords()
	const [chordbooks, setChordbooks] = useState(chordbookData)
	const [chordCount, setChordCount] = useState(0)
	const [bookCount, setBookCount] = useState(0)
	const createStartingBook = (key, quality, songId) => {
		// const copy = books.slice()
		console.log('details', key, quality, songId)
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
			// isErasable: false,
			degree: 'down to start',
		}
		// setChordCount(chordCount + 1)
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
		// setChordbooks(newList)
		// setChordCount(newChordCount)
		// storeChordbooks(newList, songId);
		return newList
	}
	const updateStarterChordbook = (newChords, bookId) => {
		// const copy = chordbooks.slice();
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
		// console.log("update", update);
		// setChordbooks(update)
		// setChordCount
		// setBookCount
	}
	const sanitizeIds = (books) => {
		const copy = books.slice()
		let count = 0
		for (const book of copy) {
			for (let i = 0; i < book.chords.length; i++) {
				// console.log(book.chords.length, book.chords[i], i, count);
				book.chords[i].id = count
				book.chords[i].position = i + 1
				count++
				// console.log(book.chords.length, book.chords[i], i, count);
			}
		}
		// console.log("in sanitize", copy, id);
		// setChordbooks(copy);
		// storeChordbooks(id);
		// setChordCount(count)
		return copy
	}
	const sanitizeChordbookIds = (copy) => {
		console.log('insideSanitize', copy)
		const newCopy = copy.slice()
		let count = 0
		// for (const book of copy) {
		for (let i = 0; i < copy.length; i++) {
			// console.log(book.chords.length, book.chords[i], i, count);
			newCopy[i].bookId = count
			// book.chords[i].position = i + 1;
			count++
			// console.log(book.chords.length, book.chords[i], i, count);
		}
		// }
		console.log('after sanitize', newCopy)
		// setChordbooks(copy)
		return newCopy
		// setChordCount(count);
	}

	const createBook = (id) => {
		const copy = chordbooks.slice()
		// console.log("id", id);
		const blankChord = {
			id: 0,
			root: '',
			type: 'blank',
			position: 1,
			// isErasable: false,
			degree: '',
		}
		const newBook = {
			//   id: chordbooks.length + 1,
			// id: id + 1,
			// insert snazzy song part name function here
			name: 'new',
			root: '',
			mode: '',
			type: '',
			bookId: chordbooks.length + 1,
			isErasable: true,
			chords: [blankChord],
		}
		console.log('new', newBook)
		copy.splice(id + 1, 0, newBook)
		// console.log("new book inserted", copy);
		// const newList = [...copy, newBook];
		const count = copy.reduce(
			(acc, curr) => acc + curr.chords.length,
			chordCount
		)
		// setChordCount(count)
		const newBookIds = sanitizeChordbookIds(copy)
		const newChordIds = sanitizeIds(newBookIds)
		console.log('in createBook', newChordIds)
		setChordbooks(newChordIds)
		storeChordbooks(newChordIds, id)
		// return newIds
	}

	const deleteBook = (id) => {
		const copy = chordbooks.slice()
		console.log(copy, id, copy[id])
		const newList = copy.filter((book) => book.id !== id)
		console.log(newList)
		const count = newList.reduce(
			(acc, curr) => acc + curr.chords.length,
			chordCount
		)
		setChordbooks(newList)
		setChordCount(count)
		// sanitizeIds()
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
		// storeChordbooks()
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
		// storeChordbooks()
	}
	const storeChordbooks = (books, songId) => {
		console.log('~STORING~', songId, books)
		localStorage.setItem(songId, JSON.stringify(books))
		// console.log(localStorage)
	}
	const loadChordbooks = (id) => {
		let stored = JSON.parse(localStorage.getItem(id))
		console.log('in loaded', typeof stored, stored)
		return stored
	}
	const deleteChord = (id, bookId, event) => {
		const copy = chordbooks.slice()
		console.log('deleteChord', id, bookId, copy)
		const update = copy[bookId].chords.map((chord) => {
			const filter = copy[bookId].chords.filter((chord) => chord.id !== id)
			return filter
		})
		copy[bookId].chords = update
		const newIds = sanitizeIds(copy)
		setChordbooks(newIds)
	}
	const copyChord = (id, bookId) => {
		const copy = chordbooks.slice()
		console.log('copyChord', copy, id, bookId)
		const chordCopy = copy[bookId].chords.filter((chord) => chord.id === id)
		chordCopy.id = copy[bookId].chords.length + 1
		chordCopy.position = copy[bookId].chords.length + 1
		// console.log(copyChord)
		const update = copy[bookId].chords.concat(chordCopy)
		copy[bookId].chords = [...update]
		console.log(copy)
		const newIds = sanitizeIds(copy)
		setChordbooks(newIds)
		// storeChordbooks()
	}

	// const clearChordbook = () => {

	// }

	return {
		chordbooks,
		createStartingBook,
		updateChordbook,
		updateChord,
		deleteBook,
		createBook,
		setChordbooks,
		updateStarterChordbook,
		sanitizeIds,
		storeChordbooks,
		loadChordbooks,
		deleteChord,
		copyChord,
	}
}
