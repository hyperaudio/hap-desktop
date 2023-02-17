import ReactPlayer from 'react-player';
import { useContext, ForwardedRef, forwardRef, useCallback, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';

import { _PlayerDuration, _PlayerElapsed, _PlayerPlaying, _PlayerRate, _PlayerUrl, _PlayerVolume } from '@/state';
import { PlayerRefContext } from '@/views';

export const Video = forwardRef(({}: {}, ref: ForwardedRef<ReactPlayer | null>): JSX.Element | null => {
  const PlayerRef = useContext(PlayerRefContext);

  // shared state
  const [, setDuration] = useAtom(_PlayerDuration);
  const [elapsed, setElapsed] = useAtom(_PlayerElapsed);
  const [playing] = useAtom(_PlayerPlaying);
  const [rate] = useAtom(_PlayerRate);
  const [url] = useAtom(_PlayerUrl);
  const [volume] = useAtom(_PlayerVolume);

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
