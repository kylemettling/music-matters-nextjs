import { Draggable } from "react-beautiful-dnd";
import { ChordImage } from "./ChordImage";
import { useState, useRef, useEffect } from "react";
import { rawNotes } from "../lib/state";
import styles from "./chord.module.css";
import { FaTrashAlt } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";

function Chord({
  id,
  position,
  root,
  type,
  degree,
  bookType,
  bookId,
  _droppableId,
  updateChord,
  handleDelete,
  handleCopy,
}) {
  const [flattenedNotes, setFlattenedNotes] = useState(rawNotes.flat());
  const [isEditing, setToggleIsEditing] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [chordRoot, setChordRoot] = useState(root);
  const [chordType, setChordType] = useState(type);
  const [keyOptionState, setKeyOptionState] = useState(root);
  const [typeOptionState, setTypeOptionState] = useState(type);
  const [chordHover, setChordHover] = useState(false);
  const editRef = useRef();
  function handleQuality(type) {
    const newType = type === "min" ? "m" : type === "maj" ? "" : type;
    return newType;
  }
  function handleName(type, root) {
    const newType = handleQuality(type);
    return `${root}${newType === "blank" ? "" : newType}`;
  }
  function handleEditToggle(e) {
    if (!isEditing) {
      setToggleIsEditing(!isEditing);
    }
  }
  function handleChordChange(e) {
    updateChord(_droppableId, id, "root", e.target.value);
    setKeyOptionState(e.target.value);
    setChordRoot(e.target.value);
    setToggleIsEditing(!isEditing);
  }
  function handleTypeChange(e) {
    updateChord(_droppableId, id, "type", e.target.value);
    setTypeOptionState(e.target.value);
    setChordType(e.target.value);
    setToggleIsEditing(!isEditing);
  }

  useEffect(() => {
    setChordRoot(root);
    setChordType(type);
    setKeyOptionState(root);
    setTypeOptionState(type);
    const checkIfEditClickedOutside = (e) => {
      if (editRef.current && !editRef.current.contains(e.target)) {
        setToggleIsEditing(false);
      }
    };
    document.addEventListener("mousedown", checkIfEditClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfEditClickedOutside);
    };
  }, [id, position, editRef, root, type]);
  return (
    <Draggable draggableId={id.toString()} index={position} key={id}>
      {(provided) => (
        <div
          className={`${styles.chordDetail} droppableId-${_droppableId} card`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onMouseEnter={() => setChordHover(true)}
          onMouseLeave={() => setChordHover(false)}
        >
          <div>
            <div className={styles.chordNameEdit} ref={editRef}>
              <div
                className={styles.chordHeader}
                onClick={(e) => handleEditToggle(e)}
              >
                {(isEditing && (
                  <div className={styles.keyModeSelectCon}>
                    <select
                      className={styles.chordRootSelect}
                      name="KeySelector"
                      id="key_selector"
                      value={keyOptionState}
                      onChange={(e) => handleChordChange(e)}
                    >
                      {flattenedNotes.map((note, i) => (
                        // note.length > 1 ?
                        <option
                          key={i}
                          className={styles.chordRootSelectOption}
                          value={note}
                        >
                          {note}
                        </option>
                      ))}
                    </select>
                    <select
                      className={styles.chordRootSelect}
                      name="KeySelector"
                      id="key_selector"
                      value={typeOptionState}
                      onChange={(e) => handleTypeChange(e)}
                    >
                      <option
                        className={styles.chordRootSelectOption}
                        value="maj"
                      >
                        maj
                      </option>
                      <option
                        className={styles.chordRootSelectOption}
                        value="maj7"
                      >
                        maj7
                      </option>
                      <option
                        className={styles.chordRootSelectOption}
                        value="min"
                      >
                        m
                      </option>
                      <option
                        className={styles.chordRootSelectOption}
                        value="m7"
                      >
                        m7
                      </option>
                      <option
                        className={styles.chordRootSelectOption}
                        value="7"
                      >
                        7
                      </option>
                      <option
                        className={styles.chordRootSelectOption}
                        value="dim"
                      >
                        dim
                      </option>
                    </select>
                  </div>
                )) || (
                  <span className={styles.chordName}>
                    {handleName(chordType, chordRoot)}
                  </span>
                )}
              </div>
              <ChordImage
                chordName={
                  chordType !== "blank"
                    ? chordRoot + handleQuality(chordType)
                    : "blank"
                }
              />{" "}
              <div className={`${styles.chordFooter} flex`}>
                <div className={styles.deleteChord}>
                  <FaTrashAlt
                    className={`${styles.chordControl}${
                      chordHover && !["blank", "starter"].includes(bookType)
                        ? "active"
                        : ""
                    }`}
                    style={{ color: "var(--red)" }}
                    onClick={(e) => handleDelete(id, bookId, e)}
                  />
                </div>
                <div>
                  {degree && (
                    <span
                      className={`${styles.chordDegree}${
                        chordType === "blank" ? "blank" : ""
                      }`}
                    >
                      {degree}
                    </span>
                  )}
                </div>
                <div>
                  <MdContentCopy
                    className={`${styles.chordControl} ${
                      chordHover && !["blank", "starter"].includes(bookType)
                        ? "active"
                        : ""
                    }`}
                    onClick={(e) => handleCopy(id, bookId, e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Chord;
