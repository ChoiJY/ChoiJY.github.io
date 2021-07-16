---
title: (Kafka) Introduce Kafka
category: "Kafka"
cover: kafka.png
author: Jun Young Choi
---
### 탄생 배경

LinkedIn의 파편화 된 내부 service간 data flow를 개선하기 위해서 탄생

Before

- 각 단위 시스템 끼리 직접 통신하며 데이터 처리
- 각 단위 시스템 간 소스 관리 및 버전 관리에서 문제가 발생

After

- 각 시스템에서 발생한 데이터를 한 곳에 모아 실시간 처리
- src application과 target application간 decoupling 달성

### Kafka의 기본 구조

- 카프카 내부의 데이터가 저장되는 partition의 동작은 FIFO 방식의 Queue와 유사하며, Queue에 데이터를 보내는 쪽이 아래 그림의 가장 좌측에 존재하는 Producer, Queue에서 Data를 꺼내가는 것이 우측의 Consumer이다.

<img src="https://media.vlpt.us/images/king3456/post/406b380b-3aee-4901-855f-04a9cc414a07/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-02-14%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%204.06.46.png" width="100%" alt="kafka architecture"/>

Kafka Producer, Broker, Consumer Architecture

- 전달 가능한 Data format의 경우 사실상 제한이 없다. Serialize, Deserialize를 통해 ByteArray로 통신하기 떄문에 모든 Java Object를 지원한다. (기본적으로 Kafka client에선 ByteArray, ByteBuffer, Double, Long, String에 대응한 Serialize, Deserialize class가 제공됨, 기타 Class의 경우 Serializer<T>, Deserializer<T>를 상속받아 구현 가능)
- 기본적으로 Kafka의 경우 최소 3대 이상의 Broker에서 분산 운영을 하며, File System에 전송받은 Data를 저장하게 된다. 또한 Batch 전송을 통해 bulk로 Data를 처리하기 때문에 High Throughput, Low Delay를 보장할 수 있다.

### Big Data Pipeline에서의 Kafka의 역할

Big data를 저장하고 활용하기 위해서 현대 IT 서비스에서는 생성된 모든 수집 가능한 비정형, 정형 데이터에 대해서 일단 Data Lake를 만든다. (Data Warehouse와는 다르게 일단 Data Lake의 경우 필터링되거나 패키지화 되지 않은 Raw data를 모두 저장)

Data pipeline이란 end to end 방식의 데이터 수집/적재를 개선하고 안정성을 추구하며, 유연하면서도 확장 가능하게 자동화 한 것 (데이터 추출 - 데이터 변경 - 데이터 변경)

Kafka가 Data pipeline으로 적합한 이유는 아래와 같다.

**높은 처리량**

- Kafka의 경우 producer가 broker로 data를 전송할 때, consumer가 broker로부터 data를 받을 때 모두 bulk 로 처리
- Partition단위를 통해 동일 목적의 data를 여러 partition에 분배하고 data를 병렬 처리할 수 있음 (Partition 개수만큼 consumer 개수를 늘림)

**확장성**

- Broker의 무중단 scale in/out이 가능하기 때문에 안정적인 운영이 가능

**영속성**

- 전송받은 data를 File System에 저장하기 때문에, 장애로 Kafka가 내려가더라도 안전하게 data를 다시 처리할 수 있음
- OS level에서 page cache를 메모리에 별도로 생성해서 File I/O 성능 향상(Page cache 메모리 영역을 사용해서 한 번 읽은 내용을 메모리에 저장했다가 다시 사용하는 방식)

**고가용성**

- Kafka cluster는 기본적으로 3개 이상의 서버로 구성되어 있기 때문에, 특정 server에 장애가 발생하더라도 무중단으로 data를 처리할 수 있다. Kafka cluster의 경우 producer로부터 전달받은 data를 여러 broker 중 1개에만 저장하는 것이 아닌 다른 broker에도 저장(replication)
- 기본적으로 Kafka cluster를 구축할 때, broker 개수의 제한은 없다. 2대로 운영할 경우, 다른 한 대의 broker에서 장애가 발생했을 경우 broker간 data가 복제되는 time lag때문에, 일부 data가 유실될 가능성이 존재, 유실을 막기 위해 `min.insync.replicas` 옵션을 이용해서 최소 n대 이상의 broker에 data를 복제하는 것을 보장할 수 있는데 이 옵션 값 보다 적은 수의 broker가 존재할 때는 topic에 더 이상 data를 넣을 수 없다.

### Data lake architecture

**Lambda Architecture**

Legacy data 수집 platform을 개선하기 위해 구성한 architecture, 3단계 layer 구조를 이용

**Before**

- 기존 각 System에서 data 수집 platform으로 각자 data 전송
- Data history 파악이 힘듦, 수집 관련 정책 따르기 어려움

**After**

- Speed layer를 구성해서 실시간 data ETL 작업
- Serving layer을 이용해서 가공된 data를 사용자, service가 사용할 수 있도록 저장
- Batch layer에서 data를 모아서 특정 시간에 처리

**단점**

- 각각의 layer에 data 분석, 처리에 대한 logic이 모두 존재해야 함
- Batch data와 real time data를 융합해서 처리할 때는, 유연하지 못한 pipeline을 생성해야 함
- 이러한 logic 파편화에 대한 문제를 해결하기 위한 추상화된 logic을 제공해서 batch, speed layer가 공통으로 사용하게 하는 서밍버드가 있었으나 결국 compile 이후에 각 layer에 배포해야 했기 때문에 완벽한 해결책이 아님

**Kappa Architecture**

Lambda architecture의 문제를 해결하기 위해서 등장, batch layer를 제거하고 모든 data를 speed layer에 넣어 처리

하지만 이는 서비스에서 생성되는 모든 종류의 data를 stream 처리해야 가능한데, data를 모두 log로 바라보는 접근을 채택(특정 시점의 모든 snapshot 데이터(전체)를 저장하는 것이 아니라, 변환 기록을 일정 기간 이상 가지고 있으면서 각 시점의 변환된 기록을 시간 순서대로 기록) - Kafka의 partition, record, offset 개념

speed layer의 경우, SPOF가 될 수 있기 때문에 반드시 내결함성과 장애 허용 특성을 가지고 있어야 한다. (Kafka의 특성)

최근 Streaming data lake architecture가 제안 됐는데 이는 serving layer 자체도 없애버리고 그냥 speed layer에서 모든 것을 다 하는 구조, 굳이 speed layer에서 data를 처리하고 이를 다시 serving layer에 넣을 필요가 없다는 것에서 착안(with. hadoop, S3, minio)

위 Streaming data lake architecture가 완벽해지기 위해서는 데이터 플랫폼(ex. ksqlDB)같은게 필요한데 아직 모든 data형태와 format을 지원하는 것은 아니기 때문에 한계가 있음

### References

- how-to-use-apache-kafka-messaging-in-net  
([https://www.inetservices.com/blog/how-to-use-apache-kafka-messaging-in-net/](https://www.inetservices.com/blog/how-to-use-apache-kafka-messaging-in-net/))
- 아파치 카프카 어플리케이션 프로그래밍 with 자바 (최원영 저)
