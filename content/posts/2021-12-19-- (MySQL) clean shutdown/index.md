---
title: (MySQL) Clean Shutdown
category: "MySQL"
cover: mysql.png
author: Jun Young Choi
---

MySQL server가 시작되거나 종료될 때는 MySQL server(InnoDB storage engine)의 buffer pool 내용을 백업하고 기록하는 과정이 내부적으로 실행, 실제 buffer pool의 내용을 백업하는게 아니라 pool에 적재되어 있는 data file의 data page에 대한 meta 정보를 백업하기 때문에 용량도 크지 않고 속도도 느리진 않다.

그러나 server가 새로 시작되는 경우 disk에서 data file을 전부 읽어서 적재해야 하기 때문에 상당한 시간이 걸릴 수 있다.

위의 이유 때문에 Spring과 같이 graceful shutdown을 하지 않고, 그냥 내리게 되면 실제 transaction이 정상적으로 commit되어도 data file에 변경된 내용이 기록되지 않을 수 있다. (redo log에만 기록되기 때문에 transaction 복구 과정을 진행해서 다시 server가 올라가는 속도가 느림) commit된 내용을 모두 data file에 기록하게 할 수 있는데 아래와 같은 명령어를 통해 MySQL server를 종료하면 된다.

```bash
mysql> SET GLOBAL innodb_fast_shutdown=0;
linux> systemctl stop mysqld.service

### remote로 종료시킬 경우
mysql> SET GLOBAL innodb_fast_shutdown=0;
mysql> SHUTDOWN;
```
