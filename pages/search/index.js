import styles from "../../components/search.module.css";
// import './style.css'
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
// import Results from '../../components/Results'
import { useAppState } from "../../lib/state";
import chordNotes from "../../lib/state";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Search({ API_HOST, API_KEY }) {
  const router = useRouter();
  const query = router.query;

  const [searchResult, setSearchResult] = useState("");
  const [searchToggle, setSearchToggle] = useState(false);
  const [optionState, setOptionState] = useState("track");
  const [searchQuery, setSearchQuery] = useState(query);
  const {
    token,
    refreshToken,
    getStoredToken,
    isTrackActive,
    clearTrackData,
    getScaleChords,
    chordbooks,
  } = useAppState();

  async function getSpotifySearchData(e) {
    if (!searchQuery) {
      return;
    }

    if (!token) {
      refreshToken();
    }
    const res = await axios(
      `https://api.spotify.com/v1/search?q=${searchQuery}&type=${optionState}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
        method: "GET",
      }
    ).catch((err) => {
      if (err.status === 401) {
        refreshToken();
        getSpotifySearchData();
      }
      console.log("Error!!", err);
    });
    if (!res) {
      refreshToken();
      getSpotifySearchData();
    }
    setSearchToggle(true);
    setSearchResult(res?.data);
  }

  useEffect(() => {
    getStoredToken();
    if (!token) {
      refreshToken();
    }
    setOptionState(optionState);
  }, [optionState]);

  return (
    <Fragment>
      <div className={`${styles.main} flex`}>
        <h2>Do you have something playing?</h2>
        <h3>LIVE</h3>
        <div>
          <input
            type="text"
            placeholder="enter track, artist, or album"
            value={searchQuery}
            onKeyDown={(e) =>
              e.key === "Enter" ? router.push(`/search/${searchQuery}`) : null
            }
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            name="search-type"
            id="search-type"
            value={optionState}
            onChange={(e) => setOptionState(e.target.value)}
          >
            <option value="track">Track</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
          </select>
          <Link className={styles.submit} href={`/search/${searchQuery}`}>
            <button type="submit" onSubmit={(e) => getSpotifySearchData(e)}>
              Fetch!
            </button>
          </Link>
          <Search query={query} />
        </div>
      </div>
      <style jsx>{`
        select,
        button {
          margin-left: 0.75rem;
        }
      `}</style>
    </Fragment>
  );
}
// export async function getStaticProps(context) {
// 	const API_KEY = process.env.X_RAPID_API_KEY
// 	const API_HOST = process.env.X_RAPID_API_HOST
// 	console.log('KEYS', API_KEY, API_HOST)
// 	return {
// 		props: { API_KEY, API_HOST },
// 	}
// }
// export const getStaticPaths = async () => {
//   return {
//     paths: [], //indicates that no page needs be created at build time
//     fallback: "blocking", //indicates the type of fallback
//   };
// };

// export async function getStaticProps(context) {
//   const API_KEY = process.env.X_RAPID_API_KEY;
//   const API_HOST = process.env.X_RAPID_API_HOST;
//   return {
//     props: { API_KEY, API_HOST },
//   };
// }
