import sys
from os import getenv

import uvicorn
from dotenv import load_dotenv

load_dotenv()


def main() -> int:
    config = uvicorn.Config(
        access_log=True,
        app="app:app",
        log_level="debug" if getenv("DEBUG") == "True" else "info",
        reload=getenv("DEBUG") == "True",
        uds="api.sock",
        workers=4,
    )
    server = uvicorn.Server(config)
    server.run()

    return 0


if __name__ == "__main__":
    sys.exit(main())
