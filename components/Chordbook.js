import React, { useState, useEffect, useCallback } from "react";
import { Draggable, DragDropContext, Droppable } from "react-beautiful-dnd";
import { orderBy, random, range, update } from "lodash";
import { useAppState } from "../lib/state";
import Chord from "./Chord";
import styles from "./chordbook.module.css";
import { useChordbook } from "../lib/hooks";
import { ChordbookHeader } from "./ChordbookHeader";
import { useRouter } from "next/router";
import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";

export function Chordbook({
  trackId,
  // user,
  session,
  loadedBooks,
  refetchChordbook,
}) {
  const { getScaleChords, songKeyCenterQuality, songKey } = useAppState();
  const router = useRouter();
  const { query } = router.query;
  const [isStorageChecked, setIsStorageChecked] = useState(false);
  const [keyOptionState, setKeyOptionState] = useState(songKey);
  const [modeOptionState, setModeOptionState] = useState(songKeyCenterQuality);
  const [isActive, setIsActive] = useState(false);
  const {
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
  } = useChordbook(loadedBooks);
  const UPDATE_USER_TRACK = gql`
    mutation updateChordbook(
      $songId: String!
      $userId: String!
      $chordbooks: [ChordbookItemInput]
    ) {
      updateChordbook(
        songId: $songId
        userId: $userId
        chordbooks: $chordbooks
      ) {
        data {
          name
          root
          mode
          type
          isErasable
          bookId
          chords {
            id
            root
            type
            position
            degree
          }
        }
      }
    }
  `;
  const GET_USER_TRACK = gql`
    query chordbook($songId: String!, $userId: String!) {
      chordbook(songId: $songId, userId: $userId) {
        id
        songId
        data {
          name
          root
          mode
          type
          isErasable
          bookId
          chords {
            id
            root
            type
            position
            degree
          }
        }
      }
    }
  `;
  // function handleCopy(id, book, e) {
  // 	console.log(id, book, e)
  // 	copyChord(id, book)
  // 	sanitizeIds()
  // }
  // function handleDelete(id, book, e) {
  // 	console.log(id, book, e)
  // 	deleteChord(id, book)
  // 	sanitizeIds()
  // }

  const [updateDbChordbook, { data, loading, error }] = useMutation(
    UPDATE_USER_TRACK,
    {
      ignoreResults: true,
      refetchQueries: [
        {
          query: GET_USER_TRACK,
          variables: { songId: trackId, userId: session?.user?.id },
        },
      ],
    }
  );
  function handleScaleChange(newKey, newMode, bookId) {
    const newChords = getScaleChords(newKey, newMode);
    setKeyOptionState(newKey);
    setModeOptionState(newMode);
    const updatedBook = updateStarterChordbook(newChords, bookId);
    setChordbooks(updatedBook);
  }
  function handleResetScale(bookId) {
    const newChords = getScaleChords(songKey, songKeyCenterQuality);
    setKeyOptionState(songKey);
    setModeOptionState(songKeyCenterQuality);
    const updatedBook = updateStarterChordbook(newChords, bookId);
    setChordbooks(updatedBook);
  }
  const onDragStart = useCallback((result) => {
    // add blur animation to non-dragging chords
    const { destination, source } = result;
    const elements = document.querySelectorAll(
      `.droppableId-${source.droppableId.toString()}`
    );
    for (let i = 0; i < elements.length; i++) {
      if (i !== source.index - 1) {
        elements[i].classList.add("blur");
      }
    }
  }, []);

  const move = (
    source,
    destination,
    droppableSource,
    droppableDestination,
    copyChord
  ) => {
    const sourceClone = [...source];
    const destClone = [...destination];
    if (copyChord) {
      const [removed] = sourceClone.splice(droppableSource.index - 1, 1);
      const copy = { ...removed };
      sourceClone.splice(droppableSource.index - 1, 0, removed);
      if (!destClone[0]) {
        // if destination chord list is empty push copy to it
        destClone.push(copy);
        // console.log('empty chords', destClone)
      } else if (destClone[0].type === "blank") {
        // if destination chord list is not empty and first chord is blank splice copy into it and remove blank
        // remove the blank first card
        console.log("blank removal");
        destClone.splice(0, 1);
        destClone.splice(droppableDestination.index - 1, 0, copy);
      } else {
        // if destination chord list is not empty and first chord is not blank splice copy into it
        destClone.splice(droppableDestination.index - 1, 0, copy);
      }
    } else {
      // if not copying chord just move it
      // console.log('source/dest', sourceClone, destClone)
      const [removed] = sourceClone.splice(droppableSource.index - 1, 1);
      destClone.splice(droppableDestination.index - 1, 0, removed);
    }
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const onDragUpdate = useCallback(() => {}, []);
  // the only one that is required
  const onDragEnd = useCallback((result) => {
    console.log("drag", result);
    const { destination, source, droppableId } = result;
    // adding blur animation to non-dragging chords
    const elements = document.querySelectorAll(
      `.chord-detail.droppableId-${source.droppableId}`
    );
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove("blur");
    }
    // make sure change occurs
    if (!destination || !source) {
      return;
    }
    // access to initial (source) position
    // access to dropped (destination) position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // checking if the source droppableId is the same as the destination droppableId
    if (destination.droppableId === source.droppableId) {
      // check the direction (> or <)
      const directionOfDrag =
        destination.index > source.index ? "GREATER" : "LESS";

      // find the affected range
      let affectedRange;
      if (directionOfDrag === "GREATER") {
        affectedRange = range(source.index, destination.index + 1);
      } else {
        affectedRange = range(destination.index, source.index);
      }
      // if songs affected (+ or -) update positions
      // const currentBookIndex = chordbooks.findIndex((book) =>
      // 	book.id === parseInt(source.droppableId) ? book : null
      // )
      console.log("affected range", affectedRange);
      const currentChords = chordbooks[destination.droppableId].chords.slice();
      const currentBookIndex = chordbooks.findIndex((book) =>
        book.bookId === parseInt(source.droppableId) ? book : null
      );
      const currentBook = chordbooks[currentBookIndex];
      const reorderedChordbook = chordbooks[currentBookIndex].chords.map(
        (chord) => {
          if (chord.id === parseInt(result.draggableId)) {
            chord.position = destination.index;
            // console.log('condition 1', chord)
            return chord;
          } else if (affectedRange.includes(chord.position)) {
            if (directionOfDrag === "GREATER") {
              chord.position = chord.position - 1;
              // console.log('condition 2.1', chord)
              return chord;
            } else if (directionOfDrag === "LESS") {
              chord.position = chord.position + 1;
              // console.log('condition 2.2', chord)
              return chord;
            }
          } else {
            // console.log('condition 3', chord)
            return chord;
          }
        }
      );
      // const reorderedChordbook = currentChords.map((chord) => {
      // 	if (chord.id === parseInt(result.draggableId)) {
      // 		chord.position = destination.index
      // 		return chord
      // 	} else if (affectedRange.includes(chord.position)) {
      // 		if (directionOfDrag === 'GREATER') {
      // 			chord.position = chord.position - 1
      // 			console.log('condition 2.1', chord)
      // 			return chord
      // 		} else if (directionOfDrag === 'LESS') {
      // 			chord.position = chord.position + 1
      // 			console.log('condition 2.2', chord)
      // 			return chord
      // 		}
      // 	} else {
      // 		return chord
      // 	}
      // })
      // currentBook.chords = reorderedChordbook
      // chordbooks[destination.droppableId] = currentBook
      //   updateDbChordbook({
      //     variables: {
      //       songId: trackId,
      //       userId: user.id,
      //       chordbook,
      //     },
      //   });
      //   setChordbooks(chordbooks);
      // setChordbooks(chordbooks)
      // const newIds = sanitizeIds(chordbooks)

      // setChordbooks(newIds)
    }
    if (destination.droppableId !== source.droppableId) {
      let copyChord = false;
      // console.log('inside onDragEnd', chordbooks)
      // if songs are moved between chordbooks and the source book is starter type copy the chord instead of moving it
      if (
        ["starter", "new"].includes(
          chordbooks[parseInt(source.droppableId)].type
        )
      ) {
        copyChord = true;
      }
      const result = move(
        chordbooks[parseInt(source.droppableId)].chords,
        chordbooks[parseInt(destination.droppableId)].chords,
        source,
        destination,
        copyChord
      );
      chordbooks[parseInt(source.droppableId)].chords =
        result[source.droppableId];
      chordbooks[parseInt(destination.droppableId)].chords =
        result[destination.droppableId];
      chordbooks.filter((book) => book.length);
      // const newBooks =
      //   updateDbChordbook({
      //     variables: { chordbook: chordbooks, userId: user?.id, songId: trackId },
      //   });
      // setUpdateTrack(true)
      // const newIds = sanitizeIds(chordbooks)

      // setChordbooks(newIds)
    }
    const newIds = sanitizeIds(chordbooks);
    // console.log('update after shuffle', newIds)
    // setChordbooks(newIds)
    if (session) {
      updateDbChordbook({
        variables: {
          songId: trackId,
          userId: session?.user?.id,
          chordbooks: newIds,
        },
      });
    } else if (!session) {
      storeChordbooks(newIds, trackId);
    }
  });
  async function updateChordbookData() {}
  useEffect(() => {
    if (
      (!loadedBooks || !loadedBooks.length || !chordbooks) &&
      songKey &&
      songKeyCenterQuality
    ) {
      console.log("no books here");
      setChordbooks(createStartingBook(songKey, songKeyCenterQuality, trackId));
    }
  }, [loadedBooks, songKey, songKeyCenterQuality, trackId]);

  if (!chordbooks) return <div>HMMM</div>;
  if (error) return <pre>{JSON.stringify(error, null, 4)}</pre>;
  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {chordbooks &&
        orderBy(chordbooks, "id").map((book, idx) => {
          return (
            <div key={idx} className={styles.chordbook}>
              <ChordbookHeader
                handleScaleChange={handleScaleChange}
                handleResetScale={handleResetScale}
                handleCreateBook={createBook}
                handleUpdateBook={updateChordbook}
                handleDeleteBook={deleteBook}
                includeControls={
                  chordbooks.length === idx + 1 || book.isErasable
                    ? true
                    : false
                }
                isErasable={book.isErasable}
                bookId={book.bookId}
                songKey={songKey}
                songMode={songKeyCenterQuality}
                name={book.name}
                type={book.type}
              />
              <Droppable
                droppableId={book.bookId.toString()}
                direction="horizontal"
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={styles.chords}
                  >
                    {orderBy(book.chords, "position").map((chord) => (
                      <Chord
                        key={chord.id}
                        _droppableId={book.bookId.toString()}
                        root={chord.root}
                        type={chord.type}
                        id={chord.id}
                        position={chord.position}
                        degree={chord.degree}
                        updateChord={updateChord}
                        bookType={book.type}
                        bookId={book.bookId}
                        handleCopy={copyChord}
                        handleDelete={deleteChord}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
    </DragDropContext>
  );
}
