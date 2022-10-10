import React, { useState, useMemo, useRef, useCallback } from 'react';

import { Editor, EditorState, convertFromRaw, createEntityMap } from './components/editor';

const Edit: React.FC = () => {
  const [data, setData] = useState();
  const [originalData, setOriginalData] = useState();
  const [error, setError] = useState();
  const [time, setTime] = useState(0);
  const [speakers, setSpeakers] = useState({});
  const [seekTime, setSeekTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [pip, setPip] = useState(false);

  const { blocks } = data ?? {};
  const initialState = useMemo(
    () =>
      blocks && EditorState.createWithContent(convertFromRaw({ blocks: blocks, entityMap: createEntityMap(blocks) })),
    [blocks],
  );

  const video = useRef();
  const seekTo = useCallback(
    time => {
      // setSeekTime(time);
      // if (video.current) video.current.seekTo(time, 'seconds');
    },
    [video],
  );

  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);

  const setDraft = () => {};
  const noKaraoke = false;

  return (
    <div>
      <p>Hello Electron + Vite + React!</p>
      {initialState ? (
        <Editor
          {...{ initialState, time, seekTo, speakers, setSpeakers, playing, play, pause }}
          autoScroll={true}
          onChange={setDraft}
          playheadDecorator={noKaraoke ? null : undefined}
        />
      ) : error ? (
        <p>Error: {error?.message}</p>
      ) : (
        <p>Loading…</p>
      )}
    </div>
  );
};

export default Edit;
