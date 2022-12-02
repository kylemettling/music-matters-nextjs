import { useState } from "react";

export const useAudioRecorder = () => {
  const [status, setStatus] = useState("initial");

  const startRecording = ({ mediaRecorder }) => {
    // mediaRecorder
    mediaRecorder.start();
    setStatus(true);
  };
  const stopRecording = ({ mediaRecorder }) => {
    mediaRecorder.stop();
    setStatus(false);
  };

  return { status, stopRecording, startRecording };
};
