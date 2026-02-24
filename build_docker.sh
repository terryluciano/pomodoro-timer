docker build -t pomodoro-timer .
docker rm -f pomodoro
docker run -d --name pomodoro --restart always -p 2525:2525 pomodoro-timer