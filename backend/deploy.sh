#!/bin/bash

REPOSITORY=/home/ubuntu/backend
cd $REPOSITORY

APP_NAME=demo
JAR_NAME=$(ls $REPOSITORY/build/libs/ | grep '.jar' | tail -n 1)
JAR_PATH=$REPOSITORY/build/libs/$JAR_NAME


# =====================================
# 현재 구동 중인 application pid 확인
# =====================================
CURRENT_PID=$(pgrep -fl demo | grep java | awk '{print $1}')

if [ -z "$CURRENT_PID" ]; then
    echo "NOT RUNNING"
else
    echo "> kill -9 $CURRENT_PID"
    kill -15 $CURRENT_PID
    sleep 5
fi

echo "> $JAR_PATH 배포"
nohup java -jar $JAR_PATH > myapp.log 2>&1 &
