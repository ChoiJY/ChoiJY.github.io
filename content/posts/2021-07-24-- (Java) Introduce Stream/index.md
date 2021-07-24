---
title: (Java) Introduce Stream
category: "Java"
cover: java.jpg
author: Jun Young Choi
---

### Stream이란?

Data 처리 연산을 지원하도록 source에서 추출된 연속된 요소들이라고 정의 가능하다.

Java 8에 새로 추가된 기능으로 선언적으로 collection 데이터를 처리할 수 있게 코드를 짤 수 있다. 별도 multi-thread 코드를 구현하지 않고서도 투명하게 병렬 처리 가능(ex. `.parallel()`) 

주요 장점은 아래와 같다

- 선언적, 간결하고 가독성이 높은 코드 생성
- 조립 가능, 유연하게 코드 작성 가능
- 병렬화, 높은 성능 달성

단점

- Stream API 자체가 상대적으로 비싼 연산

특징

- Pipelining, 대부분의 stream 연산은 chaining이 가능하다. 그렇기 때문에 laziness, short-circuit같은 최적화가 가능
- inner iteration, 반복자를 이용해서 명시적으로 반복하는 Collection과 다르게 내부 반복을 지원

### Collection과 Stream

Stream과 Collection과 모두 연속된 요소 형식의 값을 저장하는 자료구조의 interface를 제공한다. 

이 둘의 차이는 collection은 data 자체에 focus, Stream은 계산에 focus를 둔다는 것도 있지만 **가장 중요한 차이는 data를 언제 계산하느냐**가 가장 큰 차이다.

Collection의 경우 모든 요소가 collection에 추가되기 전에 계산되어야 한다. (모든 요소를 메모리에 저장해야 하며, 추가하고자 하는 요소는 미리 계산되어야 함)

Stream의 경우, 이론적으로 **요청이 있을 때만 요소를 계산**하는 고정된 자료구조이다.(Stream에 요소를 추가하거나, 제거 불가능)

### 내부 반복과 외부 반복

Collection interface를 사용하려면 사용자가 직접 요소를 반복해야 한다(ex. `for(...)`). 이를 **외부 반복**이라고 말한다. 반면에 Stream은 함수에 어떤 작업을 추가할 것인가에 대해서만 생각하면 되고 반복을 알아서 처리한다. 이를 **내부 반복**이라고 한다.

내부 반복의 장점은 병렬성 관련 설정을 사용자가 아닌 시스템에 맡긴다는 점이다. (`synchronized` 같이 피곤한 작업에 대해 신경 쓸 필요가 없다) 

### 중간 연산과 최종 연산

Stream의 연산은 아래와 같이 두 가지로 나눌 수 있다.

**Intermediate operation(중간 연산)**

`filter()`, `map()`, `limit()` 와 같은 연산으로 결과로 다른 stream을 반환한다. Stream pipeline을 실행하기 전에는 어느 연산도 수행하지 않는다는 **laziness**한 특징이 있다.

lazy한 특성 때문에, loop fusion과 short circuit과 같은 기법이 사용되며 최적화를 이룰 수 있다.

**terminal operation(최종 연산)**

Stream pipeline에서 결과를 도출해 내는 역할(ex. `collect()`, `forEach()`)

### References

- Modern Java in Action
