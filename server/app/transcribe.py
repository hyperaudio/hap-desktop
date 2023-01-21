import wave
import sys
import json

from vosk import Model, KaldiRecognizer
from starlette.responses import JSONResponse


async def transcribe(request):
    # wf = wave.open("/Users/laurian/Downloads/Blink-3YX7kXDh.wav", "rb")
    # if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != "NONE":
    #     print("Audio file must be WAV format mono PCM.")
    #     sys.exit(1)

    # model = Model(lang="en-us")

    # rec = KaldiRecognizer(model, wf.getframerate())
    # rec.SetWords(True)
    # rec.SetPartialWords(True)

    # while True:
    #     data = wf.readframes(4000)
    #     if len(data) == 0:
    #         break
    #     if rec.AcceptWaveform(data):
    #         print("...")
    #         # print(rec.Result())
    #     # else:
    #     #     print(rec.PartialResult())

    # # print(json.loads(rec.FinalResult()))

    return JSONResponse({"hello": "world"})
    # return JSONResponse(rec.FinalResult())
