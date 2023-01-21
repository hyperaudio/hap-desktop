import asyncio

from starlette.applications import Starlette
from starlette.routing import Route, WebSocketRoute, Mount
from starlette.requests import Request
from starlette.responses import JSONResponse, FileResponse, PlainTextResponse, Response

from .websockets import (
    all_channels,
    broadcast_advertise_channel,
    sockets_index,
    socket_endpoint,
)

from .transcribe import transcribe


def index(_: Request) -> Response:
    return FileResponse("index.html")


async def push(request: Request) -> Response:
    channel = request.path_params["channel"]
    if channel not in all_channels:
        return PlainTextResponse("Channel doesn't exist", status_code=400)
    data = await request.json()
    await asyncio.gather(
        *[
            socket.send_json({"t": "msg", "id": channel, "msg": data})
            for socket, subscriptions in sockets_index.values()
            if channel in subscriptions
        ]
    )
    return PlainTextResponse("Done")


async def new_channel(request: Request):
    channel = request.query_params.get("id")
    if channel is None or channel in all_channels:
        return PlainTextResponse(
            "Missing or invalid channel identifier", status_code=400
        )
    all_channels.add(channel)
    await broadcast_advertise_channel(channel, False)
    return PlainTextResponse("Done")


async def del_channel(request):
    channel = request.query_params.get("id")
    if channel is None or channel not in all_channels:
        return PlainTextResponse(
            "Missing or invalid channel identifier", status_code=400
        )
    all_channels.discard(channel)
    await broadcast_advertise_channel(channel, True)
    for _, subscriptions in sockets_index.values():
        subscriptions.discard(channel)
    return PlainTextResponse("Done")


# async def index(request):
#     return JSONResponse({"hello": "world"})


routes = [
    Route("/", index),
    Route("/transcribe", transcribe),
    Route("/push/{channel}", push, methods=["POST"]),
    Route("/new-channel", new_channel),
    Route("/del-channel", del_channel),
    WebSocketRoute("/socket", socket_endpoint),
]

app = Starlette(debug=True, routes=routes)
