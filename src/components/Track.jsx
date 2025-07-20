import React, { useState, useRef } from "react";

function Track(props) {
  const songs = props.song;
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const audioRefs = useRef([]);

  const handlePlayPause = (index) => {
    const currentAudio = audioRefs.current[index];

    if (currentPlaying === index) {
      // Pause if it's already playing
      currentAudio.pause();
      setCurrentPlaying(null);
    } else {
      // Pause any other audio
      audioRefs.current.forEach((audio, i) => {
        if (i !== index && audio) {
          audio.pause();
        }
      });
      // Play selected
      currentAudio.play();
      setCurrentPlaying(index);
    }
  };

  const renderSongs = songs.map((obj, idx) => {
    const { title, artist, audio } = obj;
    return (
      <div key={idx} className="flex justify-between w-[70vw] gap-2 bg-zinc-700 items-center rounded-lg p-2">
        <div className="text-[15px]">
          <h2 className="uppercase font-semibold">{title}</h2>
          <p>{artist}</p>
        </div>
        <div>
          {currentPlaying === idx ? (
            <i
              className="ri-pause-circle-fill text-3xl cursor-pointer"
              onClick={() => handlePlayPause(idx)}
            ></i>
          ) : (
            <i
              className="ri-play-circle-fill text-3xl cursor-pointer"
              onClick={() => handlePlayPause(idx)}
            ></i>
          )}
        </div>
        <audio ref={(el) => (audioRefs.current[idx] = el)} src={audio}></audio>
      </div>
    );
  });

  return (
    <div className="mt-16 text-[20px] scroll-mb-0">
      Recommended Tracks
      <div className="flex gap-5 flex-col mt-5">{renderSongs}</div>
    </div>
  );
}

export default Track;
