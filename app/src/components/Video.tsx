import ReactPlayer from 'react-player';
import { ForwardedRef, forwardRef, useCallback, useMemo } from 'react';

import { _PlayerDuration, _PlayerElapsed, _PlayerPlaying, _PlayerUrl } from '@/state';
import { useAtom } from 'jotai';

export const Video = forwardRef(
  (
    {
      hideVideo,
      pause,
      pip,
      play,
      // playing,
      setBuffering,
      // setDuration,
      setPip,
    }: // setTime,
    {
      buffering: boolean;
      hideVideo: boolean;
      pause: () => void;
      pip: boolean;
      play: () => void;
      // playing: boolean;
      seekTime: number;
      setBuffering: (b: boolean) => void;
      // setDuration: (d: number) => void;
      setHideVideo: (h: boolean) => void;
      setPip: (p: boolean) => void;
      setSeekTime: (s: number) => void;
      // setTime: (t: number) => void;
      time: number;
    },
    ref: ForwardedRef<ReactPlayer | null>,
  ): JSX.Element | null => {
    // shared state
    const [, setDuration] = useAtom(_PlayerDuration);
    const [, setElapsed] = useAtom(_PlayerElapsed);
    const [url, setUrl] = useAtom(_PlayerUrl);
    const [playing] = useAtom(_PlayerPlaying);

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

    const onBuffer = useCallback(() => setBuffering(true), []);
    const onBufferEnd = useCallback(() => setBuffering(false), []);
    const onDisablePIP = useCallback(() => setPip(false), []);
    const onDuration = useCallback((duration: number) => setDuration(duration), []);
    const onEnablePIP = useCallback(() => setPip(true), []);
    const onProgress = useCallback(
      ({ playedSeconds }: { playedSeconds: number }) => setElapsed(playedSeconds),
      [setElapsed],
    );

    if (!url) return null;

    return (
      <ReactPlayer
        config={config}
        height="100%"
        onBuffer={onBuffer}
        onBufferEnd={onBufferEnd}
        onDisablePIP={onDisablePIP}
        onDuration={onDuration}
        onEnablePIP={onEnablePIP}
        onPlay={play}
        onProgress={onProgress}
        playing={playing}
        progressInterval={100}
        ref={ref}
        style={{ lineHeight: 0, visibility: hideVideo || pip ? 'hidden' : 'visible' }}
        url={url}
        width="100%"
      />
    );
  },
);

export default Video;
