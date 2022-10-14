# ws-tcp

## save ws-tcp image to a tar file

```bash
docker save -o ws-tcp.tar ws-tcp
```

## 查看容器列表

```bash
docker ps -a
```

## 移除之前的ws-tcp容器

```bash
# containerid[4]: 只需要输入containerid的前4个字母即可
docker rm containerid[4]
```

## 运行ws-tcp容器

```bash
# 3010 为 tcp 监听端口
docker run --name=ws-tcp -d -p 3010:3010 -p 3011:3011 ws-tcp
```

## 移除某一个或多个image

```bash
# imageid[4]: 只需要输入imageid的前4个字母即可
docker image rm imageid[4]
```

## 查看docker占用资源情况

```bash
docker stats
```

## 查看docker容器日志

```bash
# 静态得到logs
docker logs container-name
# 静态得到最后的10条log
docker logs --tail 10 container-name
# 跟踪日志输出
docker logs -f container-name
```

## 在服务器上运行ws-tcp镜像

因为此工程只需要有一个镜像, 所以没有用到`docker-compose`

将打包后的`ws-tcp.tar`文件上传到服务器的 `~/om-docker/`, 下面

1. 需要先关闭之前已经在运行的`ws-tcp`容器
    ```bash
    docker stop ws-tcp
    ```
2. 移除关闭后的`ws-tcp`容器, 可以使用 `-f` (force) 强制移除正在运行中的容器
    ```bash
    dcoker rm ws-tp
    # 直接移除运行中的容器
    docker rm -f ws-tcp
    ```
3. 移除之前的`ws-tcp`镜像
   ```bash
   docker image rm imageid[4]
   ```
4. 加载新的镜像文件
   ```bash
   # 当前处于在 ~/om-docker/ 目录中
   docker load < ws-tcp.tar
   ```
5. 运行这个新的镜像
    ```bash
    # 同 npm run run
    docker run --name=ws-tcp -d -p 3010:3010 -p 3011:3011 ws-tcp
    ```



