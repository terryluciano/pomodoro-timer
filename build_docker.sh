#!/bin/bash

docker build -t pomodoro-timer .
docker rm -f pomodoro

if [[ $1 == "host" ]]; then
    echo "Exposing to all interfaces"
    docker run -d --name pomodoro --restart always -p 2505:2505 pomodoro-timer
else 
    echo "Exposing to localhost only"
    docker run -d --name pomodoro --restart always -p 127.0.0.1:2505:2505 pomodoro-timer
fi