import ReactPlayer from 'react-player';
import { useContext, ForwardedRef, forwardRef, useCallback, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';

import {
  PlayerDurationAtom,
  PlayerElapsedAtom,
  PlayerPlayingAtom,
  PlayerRateAtom,
  PlayerUrlAtom,
  PlayerVolumeAtom,
} from '@/state';
import { PlayerRefContext } from '@/views';

export const Video = forwardRef(({}: {}, ref: ForwardedRef<ReactPlayer | null>): JSX.Element | null => {
  const PlayerRef = useContext(PlayerRefContext);

  // shared state
  const [, setDuration] = useAtom(PlayerDurationAtom);
  const [elapsed, setElapsed] = useAtom(PlayerElapsedAtom);
  const [playing] = useAtom(PlayerPlayingAtom);
  const [rate] = useAtom(PlayerRateAtom);
  const [url] = useAtom(PlayerUrlAtom);
  const [volume] = useAtom(PlayerVolumeAtom);

  const config = useMemo(
    () => ({
      forceAudio: false,
      forceVideo: true,
      file: {
        attributes: {
          // poster: 'https://via.placeholder.com/720x576.png?text=4:3', // TODO: ADD POSTER
          controlsList: 'nodownload',
        },
      },
    }),
    [],
  );

  const onDuration = useCallback((duration: number) => setDuration(duration), []);
  const onProgress = useCallback(
    ({ playedSeconds }: { playedSeconds: number }) => setElapsed(playedSeconds),
    [setElapsed],
  );

  useEffect(() => {
    const play = () => {
      if (playing) PlayerRef?.current.seekTo(elapsed, 'seconds');
    };
    play();
  }, [playing]);

  if (!url) return null;

  return (
    <ReactPlayer
      config={config}
      height="100%"
      id="VideoPlayerRef" // if you want to change this, change it thrughout the app
      onDuration={onDuration}
      onProgress={onProgress}
      playbackRate={rate}
      playing={playing}
      progressInterval={100}
      ref={PlayerRef}
      style={{ lineHeight: 0 }}
      url={url}
      volume={volume}
      width="100%"
    />
  );
});

export default Video;
