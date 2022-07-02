import React, { createContext, useContext } from "react";
import {
  useSpotifyToken,
  useTrack,
  useScaleChords,
  useChordbook,
} from "../../lib/hooks";

export const AppContext = createContext({});

export const PageWrapper = ({ children }) => {
  const { token, refreshToken, getStoredToken } = useSpotifyToken();
  const { getScaleChords } = useScaleChords();
  // const {
  // 	chordbooks,
  // 	createStartingBook,
  // 	updateChordbook,
  // 	updateChord,
  // 	deleteBook,
  // 	createBook,
  // 	setChordbooks,
  // 	updateStarterChordbook,
  // 	sanitizeIds,
  // 	storeChordbooks,
  // 	loadChordbooks,
  // 	deleteChord,
  // 	copyChord,
  // } = useChordbook()
  const {
    songTitle,
    songArtist,
    songAlbum,
    songKey,
    songKeyCenterQuality,
    spotifySongId,
    albumCoverURL,
    artistCover,
    setTrack,
    isActiveTrack,
    setIsActiveTrack,
    clearTrackData,
    getTrackFeatures,
    getArtistCoverURL,
  } = useTrack();
  return (
    <AppContext.Provider
      value={{
        token,
        refreshToken,
        getStoredToken,
        songTitle,
        songArtist,
        songAlbum,
        songKey,
        songKeyCenterQuality,
        spotifySongId,
        albumCoverURL,
        artistCover,
        setTrack,
        isActiveTrack,
        clearTrackData,
        setIsActiveTrack,
        getScaleChords,
        getTrackFeatures,
        getArtistCoverURL,
        // chordbooks,
        // createStartingBook,
        // updateChordbook,
        // updateChord,
        // deleteBook,
        // createBook,
        // setChordbooks,
        // updateStarterChordbook,
        // sanitizeIds,
        // storeChordbooks,
        // loadChordbooks,
        // deleteChord,
        // copyChord,
        // updateChordbookProperty,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => useContext(AppContext);
