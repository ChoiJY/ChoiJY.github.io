---
title: (Java) Introduce Garbage Collection
category: "Java"
cover: java.jpg
author: Jun Young Choi
---
### Garbage Collector?

C와는 다르게 JAVA는 code상에서 임의로 memory를 명시적으로 해제하지 않는다. Heap내의 Object 중 Garbage를 검색하고, 이를 처리해서 Heap의 Memory를 회수하는 기능

### Garbage Collection Flow

Garbage Collector는 아래 두 가지 전제 조건(Weak Generation Hypothesis)을 기반으로 만들어졌다.

- 대부분의 Object는 곧 unreachable
- 오래 된 Object → 젊은 Object로의 참조는 아주 적게 존재

HotSpot VM에서는 위 가설을 기반으로 메모리를 크게 2개의 물리적 공간으로 나누었다. 

- Young Generation, 새롭게 생성되는 Object의 대부분이 이 구역에 존재, 이 영역에서 Object가 정리될 때 Minor GC가 일어난다고 함
- Old Generation, Young Generation에서 Unreachable한 상태로 되지 않고 살아남은 Object들이 여기로 간다. 일반적으로 Young Generation보다 큰 용량을 할당하며, 여기서 Object들이 정리될 때 Major(Full) GC가 일어난다고 한다. Minor GC에 비해 발생 빈도가 적다.

<img src="https://d2.naver.com/content/images/2015/06/helloworld-1329-1.png" width="100%" height="50%" alt="GC Generation 및 Data flow">

위 그림에서 Perm Generation(Method Area), Object나 intern된 문자열 정보를 저장하는 곳이며, Old Generation에서 살아남은 Object가 영원히 남아 있는 영역은 아니다. 여기서 발생한 GC도 Major GC이다.

Old Generation의 Object가 Young Generation의 Object를 참조하는 경우를 처리하기 위해서 Old Generation에는 512B의 chunk로 되어 있는 card table이 존재한다. Card table에는 Old Generation의 Object가 Young Generation의 Object를 참조할 때 마다 정보가 표시되는데, Minor GC 실행 때는 Old Generation의 모든 Object의 참조를 확인하는 것이 아닌 이 테이블만 뒤져서 GC 대상인지 식별한다.

<img src="https://d2.naver.com/content/images/2015/06/helloworld-1329-2.png" width="100%" height="50%" alt="Card table architecture">

Card table은 write barrier를 사용해서 관리하는데, 이는 Minor GC를 빠르게 할 수 있도록 하는 목적이다. 약간의 overhead는 있으나 전체적인 GC 소요시간은 줄어들게 된다.

### Young Generation GC

Young Generation은 크게 3개의 영역으로 나뉜다.

- Eden 영역
- Survivor(S0, S1)

flow는 아래와 같다.

- 새로 생성된 대부분의 Object는 Eden 영역으로 감
- Eden 영역이 꽉 차고 Minor GC가 발생, 살아남은 Object는 S0으로 이동, S0가 꽉 찰 때 까지 계속 여기로 쌓임
- S0가 가득 차게 되면, 여기서 살아남은 Object를 S1로 이동(S0는 비어 있는 상태)
- 이 과정을 반복하고, 끝까지 살아남은 Object는 Old Generation으로 이동

HotSpot VM에서는 좀 더 빠른 Memory 할당을 위해서 아래 두 가지 기술을 사용한다.

- bump-the-pointer

    Eden Generation에 할당된 마지막 Object를 추적한다. 마지막 Object는 Eden Generation의 top에 존재하는데, 다음 Object가 생성될 때, 이 Object의 크기가 Eden Generation에 들어갈 수 있는 지만 체크한다. 새로운 Object를 생성할 때, Eden Generation의 가장 마지막만 체크하면 되기 때문에, Memory 할당이 빨라지는 효과를 가져온다.

- TLABs(Thread-Local Allocation Buffers)

    Multi-thread 환경에서 Thread-safe를 위해서는 여러 thread에서 사용하는 Object를 Eden Generation에 저장하려면 lock이 발생하고 성능 저하가 발생하는데, 이를 각각의 Thread가 각각의 몫에 해당하는 Eden Generation의 영역을 가질 수 있도록 하는 방법을 통해 해결한다. 각 Thread는 자기가 가진 TLAB에만 접근하기 때문에 lock이 없이도 memory 할당이 가능하다.

### Old Generation GC

Old Generation은 기본적으로 data가 가득차면 GC를 수행한다. GC algorithm에 따라서 처리 절차가 달라지는데 GC 방식은 JDK 7 기준으로 5가지 방법이 있다.

- Serial GC (Low Memory, Single Core PC에서만 사용)

    mark-sweep-compact라는 algorithm을 사용한다. 먼저 Old Generation에서 살아 있는 Object를 **Mark**한다. 그 다음에 heap의 top부터 확인해서 살아 있는 것만 남기고 **Sweep**한다. 마지막으로 각 Object들이 연속되게 쌓이도록 heap의 가장 top부터 채워서 Object가 존재하는 부분과 없는 부분으로 **Compaction**한다.

- Parallel GC(Throughput GC)

    Serial GC와 동일하게 mark-sweep-compact algorithm을 기반으로 동작한다. 차이점은 GC를 처리하는 Thread가 여러 개라는 점이다.

- Parallel Old GC(`-XX:+UseParallelOldGC`)

    JDK 5 update 6부터 제공한 GC 방식이다. 위의 algorithm과 비교해서 Old Generation의 GC 방식만 다르다. mark-summary-compaction 단계를 거치게 된다. summary 단계에서 앞서 GC를 수행한 영역에 대해서 별도로 살아 있는 object를 식별한다는 점에서 mark-sweep-compaction의 sweep 단계와 다르고 더 복잡한 과정을 가짐

- Concurrent Mark & Sweep GC (CMS) (`-XX:+UseConcMarkSweepGC`)

    <img src="https://d2.naver.com/content/images/2015/06/helloworld-1329-5.png" width="100%" height="50%" alt="Serial GC와 CMS GC">

    Initial Mark 단계에서는 Classloader에서 가장 가까운 Object 중 살아 있는 Object만 찾는 것으로 끝내기 때문에, stop-the-world가 짧다. 

    Concurrent Mark 단계에서는 방금 살아 있다고 확인한 Object에서 참조하고 있는 Object들을 따라 가면서 확인한다. 이 과정은 다른 Thread가 실행 중인 상태에서 동시에 수행된다.

    Remark 단계에선 Concurrent Mark 단계에서 새로 추가되거나 참조가 끊긴 Object를 확인하고, Concurrent Sweep 단계에서는   Garbage를 처리한다. 이 과정도 다른 Thread와 동시에 일어난다.

    하지만 아래와 같은 단점이 존재한다

    - 다른 GC 방식에 비해 자원 소모가 크다(CPU, Memory)
    - Compaction이 기본적으로 제공되지 않는다.

    위와 같은 단점이 존재하기 때문에, Compaction을 수행하면 다른 GC에 비해 stop-the-world가 더 길어질 수 있다. 그렇기 때문에 compaction 작업의 수행 빈도, 시간을 확인해야 한다.

- G1(Garbage First) GC

    <img src="https://d2.naver.com/content/images/2015/06/helloworld-1329-6.png" width="100%" height="50%" alt="G1 GC">

    G1 GC는 CMS GC를 대체하기 위해서 만들어졌다. 기존 GC algorithm과는 다르게 각 영역에 Object를 할당하고 GC를 수행한다. 해당 영역이 꽉 차면 다른 영역에서 동일한 작업을 수행한다. 

    기존의 Young Generation의 세 영역(Eden, S0, S1)에서 Old Generation으로 data가 이동하는 단계가 사라졌다는 점에서 차이를 보인다. JDK 7부터 정식으로 채택했기 때문에 이전 버전을 사용할 땐 주의가 필요하다.

### References

- Java Reference와 GC   
  ([https://d2.naver.com/helloworld/329631](https://d2.naver.com/helloworld/329631))
- Java Garbage Collection   
  ([https://d2.naver.com/helloworld/1329](https://d2.naver.com/helloworld/1329))
