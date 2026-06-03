from __future__ import annotations

import argparse
import os

import uvicorn


def main() -> None:
    parser = argparse.ArgumentParser(description="Lance le backend Hexagone Talents.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8080)
    parser.add_argument("--reload", action="store_true")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--reset-db", action="store_true", help="Reconstruit la base de demo au demarrage.")
    mode.add_argument("--keep-db", action="store_true", help="Conserve la base existante au demarrage.")
    args = parser.parse_args()

    os.environ["HEXAGONE_RESET_DB"] = "0" if args.keep_db else "1"
    uvicorn.run("app.main:app", host=args.host, port=args.port, reload=args.reload)


if __name__ == "__main__":
    main()
