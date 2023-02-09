import ReactPlayer from 'react-player';
import { ForwardedRef, forwardRef, useCallback, useMemo } from 'react';
import { useAtom } from 'jotai';

import { _PlayerDuration, _PlayerElapsed, _PlayerPlaying, _PlayerRate, _PlayerUrl, _PlayerVolume } from '@/state';

export const Video = forwardRef(({}: {}, ref: ForwardedRef<ReactPlayer | null>): JSX.Element | null => {
  // shared state
  const [, setDuration] = useAtom(_PlayerDuration);
  const [, setElapsed] = useAtom(_PlayerElapsed);
  const [playing, setPlaying] = useAtom(_PlayerPlaying);
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

  if (!url) return null;

  return (
    <ReactPlayer
      config={config}
      height="100%"
      onDuration={onDuration}
      onPlay={() => setPlaying(true)}
      onProgress={onProgress}
      playbackRate={rate}
      playing={playing}
      progressInterval={100}
      ref={ref}
      style={{ lineHeight: 0 }}
      url={url}
      volume={volume}
      width="100%"
    />
  );
});

export default Video;
