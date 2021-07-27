---
title: (Basic concept) Topic, Partition, Record
category: "Kafka"
cover: kafka.png
author: Jun Young Choi
---

### Topic, Partition

**Topic**은 Kafka에서 data를 구분하기 위해 사용하는 단위이며,  Topic은 **1개 이상의 partition**을 가지고 있다.

Partition에는 producer들이 보낸 data들이 저장되어 있는데 이를 **record**라고 한다. partition은 Kafka의 병렬 처리의 핵심으로써 consumer group 내 consumer들이 record를 병렬로 처리할 수 있도록 matching된다.

Partition은 queue와 비슷한 구조라고 생각하면 되는데, 먼저 들어간 record는 consumer가 먼저 가져가게 된다(일반적인 queue와의 차이는 **pop된 record를 삭제하지는 않는다는 것**), 그렇기 때문에 여러 **consumer group들이 topic의 data를 여러 번 가져갈 수 있다**.

**Topic명 제약 조건**

- '' 빈 String은 지원하지 않음
- topic명을 마침표 `.` 나 `..` 로 생성할 수 없음
- topic명의 길이는 249자 미만
- 허용 가능한 문자는 `a-z, A-Z, 0-9, ., _, -` 의 조합
- `_consumer_offsets`, `_transaction_state` 는 당연하게도 불가능
- Topic명에 `.` 와 `-` 가 동시에 존재할 수 없다. (Error는 아니고 Warning이 뜨지만, 하지 말 것)
- 기존에 존재하는 topic명 내 `.` 와 `_` 가 존재할 경우, 신규 topic 생성 시 저것만 교환해도 같은 것으로 인식하기 때문에 불가능 (ex. t.opic이 존재할 경우 t_opic은 생성 불가능)

**의미있는 Topic명 작성 방법**

- Camel case 보다는 kebab-case, snake_case를 권장함(human error 방지)
- 구분자에 특수문자를 이용하자 (ex. `.` , `-`, `_`)
- Topic명의 변경은 지원하지 않기 때문에 생성할 때 잘 만드는 것이 중요하다, 변경하고자 할 때는 기존 topic을 모두 복사해서 그걸 다시 넣어야 하는 방법 뿐

**Record**

**Record**는 **Timestamp, message key, message value, offset**으로 이루어져 있다. Producer가 생성한 record가 broker로 전송될 때, offset과 timestamp가 지정되어 저장되며 broker에 이미 저장된 record의 경우 수정할 수 없고, log retension 기간이나 용량(`log.segment.bytes`나 `log.segment.ms`)에 따라서만 지워진다.

record에 저장되는 **timestamp**의 경우 broker 기준의 unix timestamp가 설정되는데, producer가 별도로 record를 생성할 때 임의의 timestamp를 지정 가능하다.

**message key**는 message value를 순서대로 처리하거나 message value의 종류를 나타내기 위해서 사용한다. message key 사용 시 producer는 topic에 record를 보낼 때, **message key의 hash값을 기준으로 partition을 지정**하게 되기 때문에 동일한 message key의 경우 동일 partition에 저장되게 된다.

**Message key, value 생성 시 주의점**

- Message key를 지정할 때, 어느 partition에 들어갈 지는 알 수 없고 partition 개수가 변경되는 경우 message key와 partition matching이 달라지기 때문에 주의 필요
- `Message key==null` 인 경우, record는 producer 기본 설정 partitioner에 따라서 partition에 분배되어 적재
- Message key, value의 경우 serialize되어 broker로 전송되기 때문에, consumer에서 이용할 때 serialize되었던 형태와 비슷하게 deserialize 처리를 해야 한다. record의 offset은 직접 지정할 수 없고, 이전에 전송되었던 `record의 offset + 1` 로 자동으로 생성
