import React, { useMemo, useCallback, useRef, MutableRefObject } from 'react';
import ReactPlayer from 'react-player';

const Player = ({
  url,
  playing,
  play,
  pause,
  setTime,
}: {
  url: string | null;
  playing: boolean;
  play: () => void;
  pause: () => void;
  setTime: (t: number) => void;
}): JSX.Element | null => {
  const ref = useRef<ReactPlayer>() as MutableRefObject<ReactPlayer>;

  const config = useMemo(
    () => ({
      forceAudio: false,
      forceVideo: true,
      file: {
        attributes: {
          // poster: 'https://via.placeholder.com/720x576.png?text=4:3',
          controlsList: 'nodownload',
        },
        // hlsOptions: {
        //   backBufferLength: 30,
        //   maxMaxBufferLength: 30,
        // },
      },
    }),
    [],
  );

  const onDuration = useCallback((duration: number) => {
    console.log({ duration });
  }, []);

  const onProgress = useCallback(
    ({ playedSeconds }: { playedSeconds: number }) => {
      console.log({ playedSeconds });
      setTime(playedSeconds);
    },
    [setTime],
  );

  return url ? (
    <ReactPlayer
      controls
      {...{ ref, url, config, playing, onDuration, onProgress }}
      onPlay={play}
      onPause={pause}
      progressInterval={100}
      width="100%"
      height="100%"
    />
  ) : null;
};

export default Player;
