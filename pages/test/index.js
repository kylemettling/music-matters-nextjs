import { useState, useEffect } from "react";
import { useAudioRecorder } from "../../lib/hooks";

const TestElement = ({ API_KEY, API_HOST }) => {
  const [audioURL, setAudioURL] = useState("");
  let mediaRecorder,
    chunks = [];

  const { status, stopRecording, startRecording } = useAudioRecorder();
  async function getMedia(contraints) {
    console.log("ok?", contraints);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      // console.log("STREAM!", stream);
      const audioTracks = stream.getAudioTracks();
      console.log("AUDIO TRACKS!", audioTracks[0].label);
      setAudioURL(stream);
      // const mediaRecorder = new MediaRecorder(stream);
      // mediaRecorder.ondataavailable = (e) => {
      //   chunks.push(e.data);
      // };
      // mediaRecorder.onstop = () => {
      //   const blob = new Blob(chunks, { type: "audio/ogg; codex=opus" });
      //   chunks = [];
      //   const audio = window.URL.createObjectURL(blob);
      //   setAudioURL(audio);
      //   console.log(audio);
      // };
    } catch (err) {
      console.log("ERROR!", err);
    }
    // console.log("stream!", stream);
    // console.log("ok?", contraints);
    // stream = navigator.mediaDevices
    //   .getUserMedia({
    //     audio: true,
    //   })
    //   .then((stream) => {
    //     console.log(stream);
    //     mediaRecorder = new MediaRecorder(stream);

    //     mediaRecorder.ondataavailable = (e) => {
    //       chunks.push(e.data);
    //     };
    //     mediaRecorder.onstop = () => {
    //       const blob = new Blob(chunks, { type: "audio/ogg; codex=opus" });
    //       chunks = [];
    //       const audio = window.URL.createObjectURL(blob);
    //       setAudioURL(audio);
    //       console.log(audio);
    //     };
    //   })
    //   .catch((err) => console.log("ERROR!", err));
    // console.log("stream!", stream);
  }

  const axios = require("axios");

  const options = {
    method: "POST",
    url: "https://shazam.p.rapidapi.com/songs/v2/detect",
    // params: { timezone: 'America/Chicago', locale: 'en-US' },
    headers: {
      "content-type": "text/plain",
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": API_HOST,
    },
    data: '"Generate one on your own for testing and send the body with the content-type as text/plain"',
  };
  console.log(options);
  // axios
  // 	.request(options)
  // 	.then(function (response) {
  // 		console.log(response.data)
  // 	})
  // 	.catch(function (error) {
  // 		console.error(error)
  // 	})

  return (
    <>
      <audio src={audioURL} controls></audio>
      <button onClick={(e) => getMedia(e)}>Try me!</button>
      <button onClick={(e) => clearMedia(e)}>Clear Device</button>
      <div>
        <span>Status: {status}</span>
        <button onClick={(e) => startRecording({ mediaRecorder })}>
          Start
        </button>
        <button onClick={(e) => setStatus({ mediaRecorder })}>Stop</button>
      </div>
      <span>{audioURL}</span>
    </>
  );
};
export default TestElement;

export async function getStaticProps(context) {
  const API_KEY = process.env.X_RAPID_API_KEY;
  const API_HOST = process.env.X_RAPID_API_HOST;
  return {
    props: { API_KEY, API_HOST },
  };
}
