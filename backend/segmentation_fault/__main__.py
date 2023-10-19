import sys
from os import getenv

import uvicorn
from dotenv import load_dotenv

load_dotenv()


def main() -> int:
    config = uvicorn.Config(
        access_log=True,
        app="app:app",
        host="0.0.0.0"
        log_level="debug" if getenv("DEBUG") == "True" else "info",
        port=80,
        reload=getenv("DEBUG") == "True",
        workers=4,
    )
    server = uvicorn.Server(config)
    server.run()

    return 0


if __name__ == "__main__":
    sys.exit(main())
