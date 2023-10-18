import sys
from os import getenv

import uvicorn
from dotenv import load_dotenv

load_dotenv()


def main() -> int:
    config = uvicorn.Config(
        access_log=True,
        app="app:app",
        log_level="debug" if bool(getenv("DEBUG", False)) else "info",
        reload=bool(getenv("DEBUG", False)),
        uds="api.sock",
        workers=4,
    )
    server = uvicorn.Server(config)
    server.run()

    return 0


if __name__ == "__main__":
    sys.exit(main())
