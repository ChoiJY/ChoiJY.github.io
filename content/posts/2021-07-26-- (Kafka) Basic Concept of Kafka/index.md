---
title: (Basic concept) Broker, Cluster, Zookeeper란
category: "Kafka"
cover: kafka.png
author: Jun Young Choi
---

### Broker, Cluster, Zookeeper

**Broker**는 Client와 data를 주고받기 위해 사용하는 주체이자, data를 분산 저장하여 장애가 발생하더라도 안전하게 사용할 수 있도록 도와주는 application

1개의 broker server에 1개의 Kafka broker process가 실행되고 1대로도 기본 기능이 실행되지만, **고가용성을 위해 3대 이상의 broker server를 1개의 cluster로 묶어서 운영**한다. cluster에 묶인 broker server들은 producer가 보낸 data를 안전하게 분산 저장하고 복제하는 역할을 수행

**Data 저장, 전송**

- producer에서 data를 받게 되면, broker는 producer가 요청한 topic의 partition에 data를 저장함
- consumer가 data를 요청하게 되면, broker는 partition에 저장된 data를 전달
- `config/server.properties` 의 `log.dir` 옵션에 정의한 dir에 data를 저장하게 됨, topic 이름과 partition 번호의 조합으로 하위 dir 생성(ex.hello.world-1)
- 해당 dir에서 log에는 message와 meta data를 저장
- index에는 message의 offset을 indexing한 정보 저장
- timeindex에는 message에 포함된 timestamp값을 기준으로 indexing한 정보 저장, timestamp값은 broker가 가지고 있는 data를 삭제하거나, 압축하는데 사용
- Kafka의 경우, os level에서 page cache를 사용하고 있으며 매번 disk를 거쳐 data를 가져오는 것이 아니기 때문에 gc가 자주 일어나지 않는다. 그렇기 때문에 broker를 실행하는데 heap memory size를 크게 설정할 필요가 없음

**Data 복제, 싱크**

- data 복제 단위는 partition 단위이며, topic 생성 시 partition의 replication factor(1...broker 개수)도 같이 설정되는데 따로 선택하지 않으면 broker의 설정값을 그대로 사용
- 복제된 partition은 leader(직접 conusmer/producer와 통신하는)와 follower(복제 data를 가진)로 나뉜다
- follower들은 leader의 offset을 확인해서 현재 자신이 가지고 있는 offset과 비교해서 차이가 나는 경우, leader에서 data를 가져와서 자신의 partition에 저장하는데 이 과정을 **replication(복제)**라고 한다.
- replication factor를 2 이상 정하는게 중요 (기본적으로 cluster 구축 시 3개 이상의 broker 사용하고, kafka를 사용하는 주 이유 중 하나인 고가용성을 고려했을 때)

**Controller**

- Cluster 내 broker중 1 대가 controller의 역할 수행
- Controller는 **다른 broker들의 상태를 체크**하고, broker가 cluster에서 제외되는 경우, 해당 broker에 존재하는 **leader partition을 재분배**

**데이터 삭제**

- Consumer가 data를 가져가도 topic 내 data는 삭제되지 않고, consumer/producer가 data 삭제를 요청할 수도 없다. 오직 **broker만이 data를 삭제 가능**
- data 삭제의 경우, file 단위로 이루어지는데 이 단위를 **log segment**라고 부른다.
- log segment는 data가 쌓이는 동안 file system으로 열려있다. **특정 데이터를 선별해서 삭제할 수 없으나,** broker내 `log.segment.bytes`나 [`log.segment.ms`](http://log.segment.ms) 옵션으로만 삭제할 수 있다.
- 삭제 처리 대신 message key를 기준으로 오래된 data를 압축하는 정책을 가져갈 수도 있다.

**Consumer offset 저장**

- Consumer group은 topic이 특정 partition으로부터 data를 가져가서 처리하고 이 partition의 어느 record까지 가져갔는지 확인하기 위해 offset을 commit
- `__consumer__offsets` topic에 저장되며, 여기에 저장된 offset을 기반으로 consumer group은 다음 record를 가져가게 된다.

**Coordinator**

- Cluster 내 broker 중 하나는 coordinator의 역할을 수행
- Consumer group의 상태를 체크하고 partition을 consumer와 매칭되게 분배하는 역할 수행
- Consumer가 group에서 제외되면, 매칭되지 않은 partition을 정상 동작하는 consumer에게 할당하여 data가 처리되게 돕는데, 이 과정을 **rebalance**라고 한다.

**Zookeeper**

- Kafka ≥ 2.6에서는 필수가 아님
- Kafka의 meta data를 관리하는데 사용
- Kafka cluster로 묶인 broker들은 동일 경로의 zookeper 경로로 설정해야 같은 broker 묶음이 된다.
- Zookeeper에서 다수의 cluster를 묶기 위해서는 root znode가 아닌 한 depth 아래의 znode를 kafka broker option으로 지정해야 한다. 각자 다른 하위 znode로 설정해야 각 cluster간 data에 영향을 미치지 않고 정상 작동할 수 있다.
