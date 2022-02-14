#! /bin/bash
WORK_PATH='/usr/projects/vue-webhook'
cd $WORK_PATH
echo '先清除旧代码'
git reset --hard origin/master
git clean -f

echo '拉取新代码'
git pull

npm i
echo '关闭旧服务启动新服务'
npm run stop
npm run start