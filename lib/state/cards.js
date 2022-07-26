import { FcGoogle, RiSoundModuleLine } from "react-icons";
export const cards = [
  {
    id: 0,
    header: "Dial in Track",
    body: "Search Spotify's library -> select a song -> start a chordbook",
    media: {
      type: "image",
      data: [
        "/huey lewis.png",
        "/tears for fears.png",
        "/the beatles.png",
        "/billy joel.png",
      ],
    },
  },
  {
    id: 1,
    header: "Drag & Drop",
    body: "Use suggested scale chord cards to save found progressions",
    media: { type: "video", data: ["/drag & drop.mp4"] },
  },
  {
    id: 2,
    header: "Switch it Up",
    body: "Not sounding accurate? Try a different scale, change chord roots or types!",
    media: { type: "video", data: ["/root.mp4", "/type.mp4"] },
  },
  {
    id: 3,
    header: "Sign in w/ Google",
    body: "Save your progressions and pick your profile back up on another device!",
    media: {
      type: "image",
      data: [
        "/huey lewis.png",
        "/tears for fears.png",
        "/the beatles.png",
        "/billy joel.png",
      ],
    },
  },
];
