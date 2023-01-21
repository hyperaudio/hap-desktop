import vosk from 'vosk';
import fs from 'fs';
import { Readable } from 'stream';
import wav from 'wav';

const MODEL_PATH = '/Users/laurian/Projects/Hyperaudio/hyperaudio-desktop/app/models/vosk-model-small-en-us-0.15';
// const MODEL_PATH = '/Users/laurian/Projects/Hyperaudio/hyperaudio-desktop/app/models/vosk-model-en-us-0.22';

const SPEAKER_MODEL_PATH = '/Users/laurian/Projects/Hyperaudio/hyperaudio-desktop/app/models/vosk-model-spk-0.4';
const FILE_NAME = '/Users/laurian/Projects/Hyperaudio/hyperaudio-desktop/app/models/Blink-3YX7kXDh.wav';

const test = async () => {
  if (!fs.existsSync(MODEL_PATH)) {
    console.log(
      'Please download the model from https://alphacephei.com/vosk/models and unpack as ' +
        MODEL_PATH +
        ' in the current folder.',
    );
    return;
  }

  if (!fs.existsSync(SPEAKER_MODEL_PATH)) {
    console.log(
      'Please download the speaker model from https://alphacephei.com/vosk/models and unpack as ' +
        SPEAKER_MODEL_PATH +
        ' in the current folder.',
    );
    return;
  }

  const model = new vosk.Model(MODEL_PATH);
  const speakerModel = new vosk.SpeakerModel(SPEAKER_MODEL_PATH);

  const wfReader = new wav.Reader();
  const wfReadable = new Readable().wrap(wfReader);

  wfReader.on('format', async ({ audioFormat, sampleRate, channels }) => {
    if (audioFormat != 1 || channels != 1) {
      console.error('Audio file must be WAV format mono PCM.');
      return;
    }

    // const rec = new vosk.Recognizer({ model: model, speakerModel: speakerModel, sampleRate: sampleRate });

    const rec = new vosk.Recognizer({ model: model, sampleRate: sampleRate });
    rec.setSpkModel(speakerModel);

    rec.setWords(true);
    rec.setPartialWords(true);

    for await (const data of wfReadable) {
      const end_of_speech = rec.acceptWaveform(data);
      if (end_of_speech) {
        console.log(JSON.stringify(rec.finalResult()));
      }
    }

    console.log(JSON.stringify(rec.finalResult()));
    rec.free();
  });

  fs.createReadStream(FILE_NAME, { highWaterMark: 4096 })
    .pipe(wfReader)
    .on('finish', function (err) {
      model.free();
      speakerModel.free();
    });
};

test();
