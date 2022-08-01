import axios from "axios";
import styles from "./track.module.css";
import React, { useEffect, useState } from "react";
import { spotify } from "../../components/config/connection";
import { useChordbook } from "../../lib/hooks";
import { useAppState } from "../../lib/state";
import { Chordbook } from "../../components/Chordbook";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { gql, useLazyQuery, useQuery, useMutation } from "@apollo/client";

export default function TrackDetail({ session }) {
  const router = useRouter();
  const { id } = router.query;
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
  const [skip, setSkip] = useState(false);
  const {
    data: trackData,
    loading,
    error,
  } = useQuery(GET_USER_TRACK, {
    variables: { songId: id, userId: session?.user?.id },
    skip: !skip && !session,
  });
  const { loadChordbooks } = useChordbook(null);
  const [loadedChordbooks, setLoadedChordbooks] = useState();
  const {
    songTitle,
    songArtist,
    songAlbum,
    albumCoverURL,
    artistCover,
    setTrack,
    getStoredToken,
    songKey,
    songKeyCenterQuality,
    token,
    isActiveTrack,
    setIsActiveTrack,
    getArtistCoverURL,
    getTrackFeatures,
  } = useAppState();

  async function getTrack(id) {
    if (!token) {
      getStoredToken();
    }
    const options = {
      method: "GET",
      url: spotify.urls.getTrack + id,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const fetchTrack = async () => {
      const search = await axios
        .request(options)
        .catch((err) => console.log(err));
      const data = await search?.data;
      return data;
    };
    const data = await fetchTrack();
    const href = await data?.artists[0]?.href;
    getArtistCoverURL(href, token);
    getTrackFeatures(data?.id, token);
    setTrack(data, token);
    setIsActiveTrack(true);
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoadedChordbooks(loadChordbooks(id));
    }
    getTrack(id);
  }, [id]);
  useEffect(() => {
    if (isActiveTrack && session) {
      setSkip(true);
    }
    return setSkip(false);
  }, [session, isActiveTrack]);
  useEffect(() => {
    if (!loading && !!trackData) {
      setSkip(false);
    }
  }, [loading, trackData]);

  if (
    !songTitle &&
    !songKey &&
    !id &&
    !artistCover &&
    !songKey &&
    !songKeyCenterQuality
  )
    return null;
  if (loading) return <div>Finding tracks!</div>;
  if (error) return <pre>{JSON.stringify(error, null, 4)}</pre>;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{`${songTitle} - ${songArtist}`}</title>
        <meta name="description" content="Music Matters - Audio Arranged" />
      </Head>
      <div className={styles.track}>
        <div className={`${styles.detailCard}`}>
          <div
            className={styles.details}
            style={{
              width: artistCover?.width,
            }}
          >
            <h1 tabIndex={0} className={styles.trackTitle}>
              {songTitle}
            </h1>
            <h2 tabIndex={0} className={styles.trackArtist}>
              {songArtist}
            </h2>
            <div
              className={styles.trackCoverCon}
              style={{
                // display: "flex",
                maxWidth: "300px",
              }}
            >
              {albumCoverURL && (
                <Image
                  tabIndex={0}
                  className={styles.trackCover}
                  src={albumCoverURL.url || "/public/logo.svg"}
                  height={albumCoverURL.height || 200}
                  width={albumCoverURL.width || 200}
                  alt={songAlbum + " cover"}
                ></Image>
              )}
            </div>
            <h3 tabIndex={0} className={styles.trackAlbum}>
              {songAlbum}
            </h3>
          </div>
          <div
            className={styles.artistImageCon}
            style={{
              // display: "flex",
              // position: "relative",
              // maxHeight: "1000px",
              maxWidth: "800px",
              // height: "100%",
              // justifySelf: "center",
              // width: "100%",
              // margin: "0 auto",
            }}
          >
            {artistCover && (
              <Image
                tabIndex={0}
                className={styles.artistImage}
                src={artistCover.url || "/public/logo.svg"}
                // layout="fill"
                // objectFit="contain"
                height={artistCover.height || 200}
                width={artistCover.width || 200}
                alt={songAlbum + " cover"}
              ></Image>
            )}
          </div>
        </div>
        <div className={`${styles.chordbookContainer} flex`}>
          <Chordbook
            key={id}
            trackId={id}
            session={session}
            loadedBooks={
              JSON.parse(JSON.stringify(trackData?.chordbook?.data || "")) ||
              loadedChordbooks
            }
          />
        </div>
      </div>
    </>
  );
}
