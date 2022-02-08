#!/bin/bash
export URL_LAUNCHER_NODE=1
export NODE_ENV=production

#umount /dev/shm && mount -t tmpfs shm /dev/shm

#node /usr/src/app/node_modules/react-scripts/scripts/start.js 
#npm install -g serve
serve -s build -p 3001
