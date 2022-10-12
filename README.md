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
docker run --name=ws-tcp -p 3010:3010 ws-tcp
```