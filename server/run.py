import sys
import socket
import json

import uvicorn


def find_port(port=8000):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        if s.connect_ex(("127.0.0.1", port)) == 0:
            return find_port(port=port + 1)
        else:
            return port


if __name__ == "__main__":
    port = find_port()
    print(json.dumps({"msg": "server_starting", "port": port}), flush=True)

    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=port,
        access_log=False,
        reload=not getattr(sys, "oxidized", False),
    )
