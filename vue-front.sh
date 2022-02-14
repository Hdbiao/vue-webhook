#! /bin/bash
WORK_PATH='/usr/projects/vue-front'
echo $WORK_PATH
cd $WORK_PATH
echo '先清除旧代码'
git reset --hard origin/master
git clean -f

echo '拉取新代码'
git pull
echo '构建代码'
npm run build
echo '构建镜像'
docker build -t vue-front:1.0 .
echo '停止旧容器并删除旧容器'
docker stop vue-front-container
docker rm -f vue-front-container
echo '启动新容器'
docker run -d -p 3001:3001 --name vue-front-container vue-front:1.0