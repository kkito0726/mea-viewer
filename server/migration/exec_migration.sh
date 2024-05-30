#!/bin/bash
FLASK_APP=app.py flask db migrate
FLASK_APP=app.py flask db upgrade
