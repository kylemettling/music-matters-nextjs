import Head from "next/head";
import Search from "../components/Search";
import { supabase } from "../pages/api/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Cards } from "../components/Cards";
import Link from "next/link";
import { cards } from "../lib/state/cards";

export default function Home({ user, session }) {
  const [profile, setProfile] = useState("");
  async function checkUser() {
    const user = await supabase.auth.user();

    if (user) {
      setProfile(user);
    }
  }

  useEffect(() => {
    checkUser();
    if (!session) {
      setProfile(null);
    }
  }, [session]);

  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <title>Music Matters | Audio Arranged</title>
        <meta name="description" content="Music Matters - Audio Arranged" />
      </Head>

      <main>
        <h2>Have something playing?</h2>
        <Search />
        <Cards cards={cards} />
      </main>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  try {
    const { user } = await supabase.auth.api.getUserByCookie(req);

    if (!user) {
      console.log("no user~");
      return { props: {} };
    }
    return { props: { user } };
  } catch (err) {
    console.log(err);
  }
}
