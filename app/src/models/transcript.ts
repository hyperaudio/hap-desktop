export interface TranscriptSpeaker {
  id: string;
  name?: string;
  monetization?: {
    paymentPointer: string;
  };
}

export interface TranscriptBlock {
  key: string;
  text: string;
  inlineStyleRanges: Array<any>; // TODO: typecheck this
  entityRanges: Array<any>; // TODO: typecheck this
  data: {
    speaker: string;
    items: Array<{ start: number; end: number; text: string; length: number; offset: number }>;
    stt: Array<{ start: number; end: number; text: string; length: number; offset: number }>;
    start: number;
    end: number;
    minStart: number;
    maxEnd: number;
  };
}

export interface Transcript {
  speakers: {
    [k: string]: TranscriptSpeaker;
  };
  blocks: TranscriptBlock[];
}
