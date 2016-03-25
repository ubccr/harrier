#!/usr/bin/env python

from harrier import web

application = web.create_app()

if __name__ == "__main__":
    application.run()
