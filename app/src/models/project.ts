import { Transcript } from './transcript';

export interface Media {
  id: string;
  name: string;
  buffer: any; // TODO: typecheck this
  url: string;
}

export interface Project {
  // TODO: typecheck this properly
  media: {
    [k: string]: Media;
  };
  metadata: any;
  transcripts: Transcript[];
}
