#! /bin/bash
WORK_PATH='/usr/projects/vue-webhook'
cd $WORK_PATH
git reset --hard origin/master
git clean -f

git pull

npm i
npm run stop
npm run start