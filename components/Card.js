import { useMemo } from "react";
import { FcGoogle } from "react-icons/fc";
import { RiSoundModuleLine } from "react-icons/ri";
import { MdSwapCalls } from "react-icons/md";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import { BsArrowsMove } from "react-icons/bs";
import Image from "next/image";
import styles from "./card.module.css";
import ReactPlayer from "react-player";
const icons = [RiSoundModuleLine, BsArrowsMove, MdSwapCalls, FcGoogle];

export const Card = ({ id, header, body, media: { type, data } }) => {
  const Icon = icons[`${id}`];
  //   const dataItems = useMemo((item) => {
  //     console.log(data);
  //     return type === "video" ? (
  //       <ReactPlayer url={data[0]} />
  //     ) : (
  //       <Image src={data[0]} layout="fill" />
  //     );
  //   }, data);
  return (
    <div className={`${styles.card} flex`}>
      <div>
        <h4>{header}</h4>
        <Icon />
      </div>
      {/* {dataItems} */}
      {/* <span>{data}</span> */}
      {/* {type === "video" && <ReactPlayer url={data[0]} />} */}
      {/* {type === "image" && <Image src={data} layout="fill" />} */}
      {/* <div>{type}</div> */}
      {/* <div>{data}</div> */}
      {/* {data &&
        data.map((file) => {
          console.log(file);
          return (
            <Image
              src={`/img/cards${file}`}
              alt={file}
              height={160}
              width={90}
            />
          );
        })} */}
      <span>{body}</span>
    </div>
  );
};
