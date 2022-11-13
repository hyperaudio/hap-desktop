import React, { useState, useMemo, useRef, useCallback } from 'react';
import { EditorState, ContentState, RawDraftContentBlock, convertFromRaw } from 'draft-js';

import { Editor, createEntityMap } from './components/editor';
import Player from './components/player/Player';
import sampleTranscript from './data/sampleTranscript.json';

const Edit: React.FC = () => {
  const [url, setUrl] = useState('https://stream.hyper.audio/q3xsh/input/YCCJ4HtHr4jy2Dxxr5wf2U/video.mp4');
  const [data, setData] = useState<{ speakers: { [key: string]: any }; blocks: RawDraftContentBlock[] }>({
    speakers: sampleTranscript.speakers,
    blocks: sampleTranscript.blocks.map(block => ({ ...block, type: 'paragraph', depth: 0 })),
  });
  const [error, setError] = useState<Error>();

  const [speakers, setSpeakers] = useState({});
  const { blocks } = data ?? {};

  const initialState = useMemo(
    () => blocks && EditorState.createWithContent(convertFromRaw({ blocks, entityMap: createEntityMap(blocks) })),
    [blocks],
  );

  const setDraft = useCallback(
    (state: {
      speakers: {
        [key: string]: any;
      };
      blocks: RawDraftContentBlock[];
      contentState: ContentState;
    }) => {
      console.log('TODO setDraft');
    },
    [],
  );

  const [time, setTime] = useState(0);

  const noKaraoke = false; // FIXME
  const seekTo = (time: number): void => {
    console.log('TODO seekTo', time);
  };
  const [playing, setPlaying] = useState(false);
  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);

  return (
    <div>
      <Player {...{ url, playing, play, pause, setTime }} />
      <hr />
      {initialState ? (
        <Editor
          {...{ initialState, time, seekTo, speakers, setSpeakers, playing, play, pause }}
          autoScroll
          onChange={setDraft}
          playheadDecorator={noKaraoke ? null : undefined}
        />
      ) : error ? (
        <p>Error: {error?.message}</p>
      ) : (
        <p>TODO skeleton loader</p>
      )}
    </div>
  );
};

export default Edit;
