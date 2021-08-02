---
title: (Basic concept) Kafka Client 
category: "Kafka"
cover: kafka.png
author: Jun Young Choi
---

### Kafka Client

Kafka cluster에 명령을 내리거나 data를 송/수신 하기 위해서 Producer, Consumer, Admin client를 제공하는 Kafka Client를 이용해서 Application을 개발한다. Kafka client 자체는 library이기 때문에 Spring같이 자체 life cycle을 가진 framework나 application 위에서 개발을 해야 한다.

**Producer API**

Kafka에서 data flow의 시작은 producer이다. Producer application은 kafka에 필요한 data를 선언하고 broker의 특정 topic 내 partition에 전송하게 된다. 이 과정에서 Producer는 data를 전송할 때 leader partition을 가지고 있는 kafka broker와 직접 통신하게 된다.

**간단한 record 생성 및 전송 process**

- Properties 객체 초기화 (bootstrap 정보, serializer/deserializer 정보, ...)
- KafkaProducer 객체 생성
- ProducerRecord 생성 (Topic명, message key, message value, ...)
- KafkaProducer send (`send(record)` 의 경우 즉시 전송이 아닌, record를 producer 내부에 저장하고 있다가 batch로 broker에 전송하는 방식)
- KafkaProducer flush (`flush()` 를 통해 Producer 내부 buffer에 가지고 있는 record batch를 broker에 전송)
- KafkaProducer close (Producer instance의 resource 반환)

위 과정 이외에도 Producer instance를 통해 data가 broker까지 정상적으로 도달했는가에 대한 logic이나, 환경에 따른 추가적인 producer 선택 옵션 설정 등이 들어갈 수 있다.

**Producer 중요 개념**

Producer는 broker로 record를 전송할 때, 내부적으로 partitioner, batch 생성 단계를 거치게 된다. 

위 프로세스에서 ProducerRecord가 생성되고 KafkaProducer가 `send()` 를 호출하게 되면, topic내 어떤 partition으로 record를 전송할 지 결정하게 된다. 

- KafkaProducer instance를 생성할 때, 별도로 partitioner를 설정하지 않을 경우 `DefaultPartitioner` 를 이용해서 partition을 정함
- Producer API 사용 시, `UniformStickyPartitioner` (기본값, ≥ v2.5),  `RoundRobinParitioner` 두 개의 partitioner를 제공하게 되는데, 아래와 같은 차이점을 가지고 있다
    - message key가 있을 경우, message key의 hash값과 partition을 matching하여 record를 전송한다는 점이 동일
    - message key가 없을 경우, partition에 최대한 동일하게 record를 분배하는데 `UniformStickyPartitioner` 의 경우, `RoundRobinPartitioner` 의 단점을 개선했다는 점이 다르다.
    RoundRobinPartitioner의 경우 record가 들어오는 대로 partition을 돌면서 전송하는 방식, UniformStickyPartitioner의 경우 accumlator에서 record가 batch로 모두 묶일 때 까지 기다렸다가  동일한 partition에 전송하여 성능 향상
- Client library에서는 저 둘 말고도 `Partitioner` interface를 상속받아 직접 custom partitioner를 구현 가능하다. (Partitioner를 통해 partition이 지정된 data는 accumulator 내 buffer에 쌓이고, sender thread가 이 data를 가져가서 broker로 전송한다)
- Producer에서는 broker로 data를 보낼 때, 압축 옵션을 지정할 수 있다.(기본값은 미압축), 압축을 하는 작업 자체가 CPU/Memory resources를 사용하기 때문에 필요 시에 적용하는 것이 중요하다. 여기서 압축을 할 경우에 Consumer에서도 동일하게 압축에 대한 처리가 필요

**Producer 주요 옵션**

**필수 옵션**

- `bootstrap.servers` : producer가 data를 전송할 대상 kafka cluster에 속한 broker의 hostname:port를 1개 이상 작성
- `key.serializer` , `value.serializer`: record의 message key, value를 serialize하는 class

**선택 옵션**

- `acks` : producer가 전송한 data가 broker들에 정상적으로 저장되었는지, 성공 여부를 확인하는데 사용하는 option (0, 1, -1)로 설정 가능
- `buffer.memory` : broker로 전송할 data를 batch로 모으기 위해 설정할 buffer memory양을 지정, default 값은(32MB)
- `retries` : produer가 broker로부터 error를 받고 난 뒤, 재전송을 시도하는 횟수를 지정, default 값은 (2147483647)
- `batch.size` : batch로 전송할 record 최대 용량을 지정, 너무 작게 설정하면 producer가 broker로 더 자주 보내기 때문에 network 부담이 있고, 너무 크게 지정하면 memory를 더 사용하게 되기 때문에 적당한 선에서 조정, default 값은 (16384)
- `linger.ms` : batch를 전송하기 전 까지 기다리는 최소 시간, default 값은 0
- `partitioner.class` : record를 partition에 전송할 때, 적용하는 partitioner class, default는 `DefaultPartitioner` 이다.
- `enable.idempotence` : 멱등성 producer로 작동할 지 여부를 설정하는 option
- `transactional.id` : producer가 record를 전송할 때, record를 transaction 단위로 묶을 지 여부를 설정

**Message key를 가진 data를 전송하는 producer**

Message key가 포함된 record를 전송하고자 한다면 ProducerRecord 생성 시, parameter로 추가해야 한다.  

```java
// topic name, partition number(option), message key, message value
ProducerRecord<String, String> record = new ProducerRecord<>("test", 1, "topic", "data");
```

message key가 지정된 data는 `kafka-console-consumer` 명령어로 확인할 수 있다. property 옵션의 `print.key`, `key.separator` 값을 줘서 console 화면에서 전송된 data를 확인할 수 있다.

```bash
$ bin/kafka-console-consumer.sh \
--bootstrap-server localhost:9092 \
--topic test \
--property print.key=true \
--property print.separator=" " \
--from-beginning
null test
topic data
```

**Custom Partitioner를 가지는 producer**

DefaultPartitioner 사용 시, **message key의 hash값에 partition을 매칭하여 data를 전송하기 때문에 어느 partition에 data가 들어가는 지 알 수 없다.**

Partitioner interface를 상속받아 custom partitioner를 생성하면, 특정 message key에 대해서 특정 partition으로만 들어가게 설정할 수 있다. 이 경우 topic 내 partition 개수가 변경되더라도 지정한 data는 지정한 partition으로만 들어간다.

**Broker 정상 전송 여부를 확인하는 producer**

`KafkaProducer.send()` 의 경우 Future를 return한다. RecordMetadata의 비동기 결과를 표현하는 것으로 ProducerRecord가 broker에 정상적으로 적재되었는가에 대한 data가 포함되어 있다. `get()` 을 이용해서 이 결과를 동기적으로 가져올 수 있다.

해당 동작의 경우 synchronous로 작동하기 때문에 빠른 전송에 대한 허들이 될 수 있다. 이런 케이스에 있어서 Callback interface를 구현하여 asynchronous로 결과를 확인할 수 있다. 이 방식의 경우 전송 실패 후 재전송 같은 case에서 데이터의 순서를 보장할 수 없기 때문에, **순서가 보장되어야 하는 방식에선 synchronous**로 작동하게 해야 한다.

**Consumer API**

Broker에 적재된 data를 가져와서 처리하는 역할

**간단한 Consumer record 처리 Process**

- Properties 객체 초기화 (bootstrap 정보, serializer/deserializer 정보, consumer group 정보, ...)
- KafkaConsumer 객체 초기화
- `subscribe()` method를 통해서 consumer에 topic 할당 (1개 이상의 topic name 가능)
- `poll(duration)` method를 통해서 record를 가져와서 처리 (parameter의 Duration을 통해서 buffer에서 record를 가져오는 주기 설정)
- `poll()` 의 결과로 가져온 `List<ConsumerRecord>` 들에 대한 처리

**Consumer 중요 개념**

Consumer를 실행하게 되면 `Fetcher` instance가 생성되는데 record들을 미리 queue로 가져오게 되는데, 이후 `poll()` method를 통해 record를 queue에서 꺼내오게 된다.

Consumer를 운영하는 방법은 아래와 같이 2가지 방법이 있다. 

- 1개 이상의 Consumer로 이루어진 consumer group을 통한 운영

    Consumer group으로 운영하는 방법은, Consumer를 각 Consumer group으로부터 격리된 환경에서 안전하게 운영하는 Kafka의 독특한 방식이다. grouping된 consumer들은 topic의 1개 이상의 partition에 할당되어 record를 가져갈 수 있다.

    1개의 partition은 1개의 consumer에 할당 가능하고, consumer는 여러 개의 partition을 가질 수 있다. 그렇기 때문에 consumer group의 consumer 개수는 partition의 개수보다 같거나 작아야 한다.

    **Consumer group은 다른 consumer group과 격리되는 특징을 가지고 있기 때문에, producer가 보낸 data를 각자 다른 역할을 하는 consumer group끼리 영향을 받지 않게 처리할 수 있다는 장점**이 있다. 현재 운영 중인 topic의 data가 어디에 적재되는지, 처리되는지 파악하고 consumer group으로 나눌 수 있는 것에 대해선 최대한 나누는 것이 유리하다.

    Consumer group 내 consumer에 장애가 발생하는 경우, 해당 consumer에 할당된 partition의 경우 다른 consumer로 소유권이 넘어가는데 이를 **rebalancing** 이라고 한다. 크게 아래와 같은 두 가지 경우에서 일어난다.

    - consumer가 추가되는 상황
    - consumer가 제외되는 상황

    rebalancing에 대응하는 code 작성은 항상 필요하다.(해당 과정에서 group 내 모든 consumer는 stop-the-world) **group coordinator는 rebalancing을 발동시키는 역할을 하는데 broker 중 하나가 이 역할**을 수행하게 된다.

    특정 topic 내 record를 어디까지 가져갔나에 대해서 commit을 통해 체크(`poll()` → `commit()`)하게 되는데, record 처리의 중복이 발생하지 않기 위해선 consumer application에서 offset commit을 정상적으로 처리했는 지 검증이 필요하다. 명시적, 비명시적 두 가지 방법이 있는데 특징은 아래와 같다.

    - 명시적

        `poll()` 이후 반환받은 data의 처리가 완료되고 `commitSync()` 를 호출하면 된다. `poll()` 을 통해 반환된 record의 가장 마지막 offset을 기준으로 commit하게 된다. 이 과정의 경우 synchronous하게 동작하기 때문에 consumer의 throughput에 영향을 주게 된다. asynchronous하게 동작하게 처리할 수도 있으나 data의 순서 보장 및 중복 처리에 대한 위험성이 존재한다.

    - 비명시적

        기본 옵션은 `poll()` 수행 시 일정 간격으로 offset을 commit 하도록 `enable.auto.commit=true` 로 설정되어 있다. `auto.commit.interval.ms` 와 같이 사용되는데 계속 `poll()`로 record를 가져오다가 이 옵션에 지정된 시간이 지나면 그 때 까지 읽은 record의 offset을 기록하게 된다. 편하긴 한데 `poll()` 이후 rebalancing이나 consumer 강제 종료 같은 경우, consumer가 관리하는 data가 중복이나 유실될 수 있는 위험성을 가지고 있다.

- Topic의 특정 partition만 subscribe하는 consumer 운영

    `subscribe()` 대신 `assign()` 을 이용해서 구현할 수 있으며, 해당 과정에선 rebalancing이 없기 때문에 간단한 system같은 경우엔 유리

**Consumer 주요 옵션**

**필수 옵션**

- `bootstrap.servers` : producer가 data를 전송할 대상 cluster에 속한 broker의 hostname:port를 1개 이상 작성
- `key.deserializer`, `value.deserializer` : record의 message key, value를 deserialize하는 class

**선택 옵션**

- `group.id` : consumer group id, `subscribe()` 를 이용해서 topic을 구독해서 사용할 경우는 필수값이다.
- `auto.offset.reset` : consumer group이 특정 partition을 read할 때, 저장된 consumer offset이 없을 경우에 어느 offset부터 읽을 지 선택하는 option이고 (latest, earliest, none) 세 가지 중 선택 가능하다. 기본값은 latest다.
- `enable.auto.commit` : 명시적으로 commit을 할 지 선택하는 option이다. 비명시적 commit 처리를 할 경우 false로 설정한다.
- `auto.commit.interval.ms` : 위 옵션(비명시적 commit)인 경우, offset commit 간격을 지정하는 option이며 default는 5s이다.
- `max.poll.records` : `poll()` method call시 반환되는 record 개수를 지정한다. default는 500이다.
- `session.timeout.ms` : consumer가 broker와 연결이 끊기는 최대 시간이다. 해당 시간 내 heartbeat를 broker로 보내지 않는다면 rebalancing이 발생하게 된다. 보통 heartbeat 시간 간격의 3배로 설정한다. default는 10s이다.
- `heartbeat.interval.ms` : heartbeat를 전송하는 간격이다. default는 3s이다.
- `max.poll.interval.ms` : `poll()` 호출하는 최대 시간 간격, 이 시간이 지나면 rebalancing을 수행하게 된다. default는 5m이다.
- `isolation.level` : transaction producer가 record를 transaction단위로 보낼 경우 사용한다. `read_committed` 로 설정하는 경우 commit이 완료된 record만 읽게 되고, `read_uncommitted` 로 설정하게 되면 commit 여부와 상관없이 partition에 있는 모든 record를 읽는다. default는 `read_uncomitted` 로 설정되어 있다.

**Rebalance Listener를 가진 Consumer**

`poll()` 호출 시 반환받은 data를 모두 처리하기 이전에 rebalancing이 이루어지게 된다면 record의 중복 처리 및 유실이 이루어질 수 있다. 이에 대응하기 위해서는 **rebalacing 당시 처리한 data를 기준으로 commit을 시도**해야 한다. 이를 위해서 `ConsumerRebalanceListener` interface를 구현해서 해결할 수 있다. `onPartitionAssigned()` method의 경우 rebalance가 끝난 후 partition이 할당 완료되면 호출되는 method이다. `onPartitionRevoked()` 의 경우 rebalance 직전에 호출되는 method이며 여기에다 logic을 구현하여 마지막 처리한 data를 기준으로 commit을 할 수 있다. 대신 여기서 offset은 +1 해야 다음 번 수행 시 정상적으로 작동하게 된다. 

**Consumer 내 할당된 partition 확인**

`assignment()` method를 통해 현재 consumer에 할당된 partition list를 확인 가능하다.

**Consumer의 graceful shutdown**

정상적으로 종료되지 않은 consumer의 경우 session timeout이 발생할 때 까지 group에 존재하게 된다. 이런 경우 cousumer lag이 늘어나서 지연이 일어나게 된다. `KafkaConsumer` class에서 `wakeup()` 를 호출해서 안전하게 종료할 수 있다. `wakeup()` 호출 시 `poll()` 을 호출하게 되면 WakeupException이 발생하게 되는데, 이후 data 처리를 위해 사용한 자원들을 반환처리 하면 된다. 마지막으로 `close()` 를 호출해서 cluster에 consumer가 안전하게 종료되었음을 명시적으로 알려줄 수 있다.

**Admin API**

실제 운영 환경에서는 Kafka 내 내부 옵션을 확인하고 설정하는 것이 중요한데, 가장 확실한건 console을 통해서 확인하는 것이지만 번거롭다.

Kafka client에서는 `AdminCilent` class를 이용해서 아래와 같은 경우의 cluster option 관련 부분을 자동화 할 수 있다.

- Consumer를 multi thread로 생성할 때 구독하는 topic의 partition 개수만큼 thread를 생성하게 되는 경우에서 thread 생성 전 해당 topic의 partition 개수를 admin API를 통해 가져올 수 있다.
- AdminClient class로 구현된 web dashboard를 통해 ACL이 적용된 cluster의 resource 접근 권한 규칙 추가 가능
- 특정 topic record양이 늘어나는 경우, AdminClient class를 이용해서 해당 topic의 partition을 늘릴 수 있다.
