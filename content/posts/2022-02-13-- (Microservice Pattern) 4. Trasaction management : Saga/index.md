# 4. Trasaction management : Saga

MSA 기반의 Application을 만드는 과정에서 가장 중요한게 ACID한 Transaction을 보장하는 것이다. MSA에서는 구조적인 한계 때문에 ACID Transaction 대신 Saga라는 message driven 방식의 local transaction을 사용한다.

Saga는 ACID에서 격리성이 빠진 ACD만 보장하고 격리가 되지 않기 때문에 Concurrency anamoly의 영향을 방지하거나 줄일 수 있는 설계 기법을 적용해야 한다.

이 Chapter에서는 MSA에서 transaction 관리가 어려운 이유를 먼저 알아보고, 기존 distributed transaction 관리 방식을 사용할 수 없는 이유를 찾게 된다. 이후, Saga를 이용해 data consistency를 유지하는 방법을 살펴보고 Saga의 두 가지 기법을 알아보게 된다.

### 4.1 MSA에서의 transaction 관리

단일 DB에 접근하는 monolithic application의 transaction 관리는 어렵지 않다. 하지만 다중 DB, 다중 message broker를 사용하는 monolithic application이나 자체 DB를 가진 여러 Service로 구성된 MSA는 transaction 관리가 어렵기 때문에 좀 더 정교한 방법이 필요하다.

**Distributed transaction의 문제점**

예전에는 X/Open DTP model이 distributed transaction 처리의 표준이었다. 2PC를 이용해서 transaction 참여자는 commit 혹은 rollback이 보장되게 하였다. SQL DB 대부분은 XA와 호환되며, message broker도 일부는 호환된다. 하지만 아래와 같은 문제점을 가지고 있다.

- NoSQL이나 Kafka, RabbitMQ의 경우 Distributed transaction을 지원하지 않기 때문에 distributed transaction이 필수라면 선택하지 못할 수 있다.
- Synchronous IPC 형식이라 Availability가 떨어지는 문제점이 존재한다. 참여한 Service가 모두 live중이어야 commit이 가능하다. (**전체 availability = (participant의 availability)^n)**
- CAP theorem에 따르면 System은 consistency, availability, partition tolerance 중 2가지만 가질 수 있는데, 최근 AA들은 consistency보다는 availability를 더 중요시하는 경향을 보임

**Data consistency 유지: Saga pattern**

Saga란, MSA에서 distributed transaction없이 data consistency를 보장하는 mechanism이다. 여러 service의 data를 update하는 command마다 saga를 하나씩 정의하게 된다.(일련의 local transaction이라고 보면 편함)

Saga와 ACID transaction의 차이는 아래의 두 가지 차이를 가지게 된다.

- ACID에는 있는 격리성(I)이 Saga에는 없다.
- Saga는 local transaction마다 update분을 commit하므로, 이에 대한 compensate transaction을 걸어 rollback해야함.

Saga pattern에서의 command는 아래와 같은 process를 따라서 처리되게 된다.

![Untitled](4%20Trasaction%20management%20Saga%205c625067ea7e45ba8f5a09f12a71be7c/Untitled.png)

1. 주문 서비스: Order를 APPROVAL_PENDING 상태로 생성.
2. 소비자 서비스: 주문 가능한 소비자인지 확인.
3. 주방 서비스: 주문 내역을 확인하고, Ticket을 CREATED_PENDING 상태로 생성.
4. 회계 서비스: 소비자 신용카드를 승인 처리.
5. 주방 서비스: Ticket 상태를 AWAIT_ACCEPTANCE로 변경.
6. 주문 서비스: Order 상태를 APPROVED로 변경.

**보상 transaction을 통해서 update분을 rollback**

위의 process는 언뜻 보기엔 직관적이고 아무 문제가 없어 보인다. 하지만, 저 과정 중 error가 발생할 경우, 어떻게 update분을 rollback할 수 있을지에 대한 숙제가 존재한다.

기본적으로 Saga는 단계별로 local DB에 commit을 하기 때문에, 자동 rollback은 불가능하다. 그렇기 때문에 예를 들어 4번째 Txn(신용카드 승인)이 실패한다고 하면, 이전 Txt1~3을 undo할 수 있는 보상 transaction이 필요하다. 

하지만 모든 단계에서 보상 transaction이 필요한 것은 아니다. read-only나 항상 성공하는 단계 이후의 transaction의 경우에는 보상 transaction이 필요하지 않다.

위의 그림과 아래 표에 있는 1~3 단계는 실패할 가능성이 있는 단계 다음에 있기 때문에, compensatable transaction, 4번째 단계는 절대 실패하지 않는 단계 이후에 있으므로 pivot transaction, 5~6단계는 항상 성공하기 때문에 retiable transaction이라고 부른다.

![Untitled](4%20Trasaction%20management%20Saga%205c625067ea7e45ba8f5a09f12a71be7c/Untitled%201.png)

### 4.2 Saga 편성

Saga는 단계를 편성하는 logic으로 구성된다. System command가 saga를 시작할 때, 이 편성 logic은 첫 번째 participant를 정해서 local transaction 실행을 지시하고, transaction이 완료되면 그 다음 participant를 호출하는 과정이 모든 단계가 수행될 때까지 반복된다. 이 과정 중 하나라도 local transaction이 실패한다면, compensatable transaction을 역순으로 수행하게 된다.

사가 편성 logic은 아래의 두 가지 종류가 존재한다.

- Choreography: 의사 결정과 순서화를 saga participant 각자에게 맡기는 구조, participant들은 주로 event를 교환하는 방식으로 communication하게 된다.
- Orchestration: Saga 편성 logic을 Orchestrator에게 맡겨 중앙화 하는 방식, Orchestator는 participant에게 command message를 보내 수행할 작업을 지시.

**Choreography Saga**

Saga participant가 서로 event를 subscribing하면서 이에 따라 반응하는 방식이다. 전체적인 flow는 아래의 그림과 같다.

![Untitled](4%20Trasaction%20management%20Saga%205c625067ea7e45ba8f5a09f12a71be7c/Untitled%202.png)

1. 주문 서비스: Order를 APPROVAL_PENDING 상태로 생성 → Order 생성 event publish.
2. 소비자 서비스: Order 생성 event subscribe → Order 가능 여부 확인 → 소비자 확인 event publish.
3. 주방 서비스: Order 생성 event subscribe → Order 내역 확인 → Ticket을 CREATE_PENDING으로 생성 → Ticket 생성 event publish.
4. 회계 서비스: Order 생성 event subscribe → 신용카드 승인을 PENDING으로 생성
5. 회계 서비스: Ticket 생성, 소비자 확인 event subscribe → 신용카드 승인 처리 → 신용카드 승인 완료 event publish.
6. 주방 서비스: 신용카드 승인 event subscribe → Ticket 상태를 AWAITING_ACCEPTENCE로 변경.
7. 주문 서비스: 신용카드 승인 event subscribe → Order 상태를 APPROVED로 변경 → Order 승인 event publish.

**확실한 event 기반 통신**

Choreography Saga에서는 아래의 두 가지 통신 이슈를 고려해야 한다.

- Saga participant가 local DB를 update하고, DB transaction의 일부로 event를 publish하게 해야 한다. 여기서 local DB를 update하는 작업과, event를 publish하는 작업은 모두 atomically하게 진행되어야 하기 때문에 transational messaging을 사용해야 한다.
- Saga participant는 자신이 subscribe한 event와 자신이 가진 data를 연결할 수 있어야 한다. 이걸 위해서는 event와 data를 mapping할 수 있는 ID를 event에 실어 보내는 것이 필요하다.

**Choreography Saga의 장단점**

간단한 Saga의 경우에는 Choreography 방식이 유리하지만, 조금이라도 복잡해질 가능성이 존재한다면 Orchestration 방식을 채택하는게 정신 건강에 좋다.

장점

- Simplicity: Business를 CUD할 때, service가 event를 publish.
- Loose coupling: participant는 event를 subscribe할 뿐, 서로를 직접 알지는 못한다.

단점

- 다소 이해하기 어려움: Orchestartion 방식과는 다르게, Saga를 각 Service 안에 가지고 있기 때문에, System이 복잡해지면 이해하기 어려워진다.
- Service간 cyclic dependency: Participant가 서로 event를 subscribe하는 특성 상, 이러한 문제가 발생하기 쉽다. 항상 문제가 되는 것은 아니지만, 잠재적 문제가 될 수 있음.
- Strongly coupling이 될 가능성: Participant는 각자 자신에게 영향을 미치는 모든 event를 subscrib해야한다. 그렇기 때문에 해당 service에서 변경이 있는 경우 맞춰서 같이 변경되어야 한다.

**Orchestration Saga**

Choreography 방식과는 다르게 Saga Orchestarator class가 async req/res를 주고 받으면서 participant를 호출하게 되고, 해당 처리 과정에 따라서 command message를 전송하는 방식이다. 아래의 그림과 같은 flow를 가지게 된다.

![Untitled](4%20Trasaction%20management%20Saga%205c625067ea7e45ba8f5a09f12a71be7c/Untitled%203.png)

1. 주문 서비스는 먼저 Order 및 Order 생성 Saga orchestrator를 생성하게 된다.
2. Saga orchestrator가 소비자 확인 command를 소비자 service에 전송한다.
3. 소비자 서비스는 소비자 확인 message를 response로 내려준다.
4. Orchestrator는 Ticket 생성 command를 주방 서비스에 전송.
5. 주방 서비스는 Ticket 생성 message를 response로 내려준다.
6. Orchestrator는 신용카드 승인 message를 회계 서비스에 publish.
7. 회계 서비스는 신용카드 승인 message를 response로 내려준다.
8. Orchestrator는 Ticket 승인 command를 주방 서비스에 publish.
9. Orchestrator는 Order 승인 command를 주문 서비스에 publish.

제일 마지막 9단계에서, Orchestrator는 자신이 하나의 Service인것처럼 작동하게 된다. 물론 Order 생성 Saga가 직접 Order를 update해서 승인 처리해도 무방하나, 일관성 차원에서 주문 서비스가 마치 다른 participant인 것처럼 취급한다.

이러한 과정을 수행하는 Orchestator를 FSM으로 구현하게 된다면 테스트, 설계, 구현이 모두 편해지는 장점이 있기 때문에 아래에서 다룰 FSM으로 modeling하는 방식이 추천되고 있다.

**Orchestrator를 FSM으로 modeling**

FSM은 간단하게 state와 event에 의해 trigger되는 state transition으로 구성된다. Transition이 발생할 때마action이 일어나게 되는데 여기서의 action은 다른 participant를 호출하는 작용이다.

State간 transition은 participant가 local transaction을 완료하는 시점에 trigger되게 되고, local transaction의 상태와 결과에 따라서 어떻게 할 지에 대해 결정되게 된다.

![Untitled](4%20Trasaction%20management%20Saga%205c625067ea7e45ba8f5a09f12a71be7c/Untitled%204.png)

위 그림의 flow를 간단하게 설명하면 아래와 같다.

1. 소비자 확인: 초기 상태, Saga는 소비자 서비스가 주문 가능한 소비자인지 확인할 때 까지 기다린다.
2. Ticket 생성: Saga는 Ticket 생성 command에 대한 response를 기다린다.
3. 신용카드 승인: 회계 서비스가 소비자 신용카드를 승인할 때까지 기다린다.
4. Order 승인: Saga가 성공적으로 완료되었음을 나타내는 최종 상태.
5. Order 거부: Participant 중 하나가 Order를 거부했음을 나타내는 최종 상태.

**Orchestration Saga의 장단점**

Orchestartion Saga의 장단점은 아래와 같다.

장점

- 의존 관계 단순화: Orchestartor만이 participant를 호출하는 단방향 흐름으로 진행되기 때문에 cyclic dependency가 존재하지 않는다.
- Loose coupling: 모든 service는 orchestrator가 호출하는 API만 구현하면 되기 때문에, 다른 participant가 publish하는 event에 대해서 알지 못해도 된다.
- 관심사를 더 분리하고 business logic을 단순화: Saga 편성 logic이 orchestrator에만 있기 때문에 domain object는 더 간단해지고, 자신이 참여한 Saga에 대해선 알지 못한다. (ex. Saga 단계에 해당하는 중간 상태가 필요 없음)

단점

- Business logic을 orchestrator안에 과도하게 중앙화할 경우, Service들이 깡통 서비스가 될 수 있음. 이러한 문제를 방지하기 위해서는 Orchestrator는 순서화만 담당하고 다른 business logic은 가지지 않게 설계하여야 한다.

### 4.3 비격리 문제 처리

앞서 Saga에서는 ACID에서 격리성(I)을 보장하지 못한다는 문제점이 존재하였다. 격리성(I)는 동시에 실행 중인 여러 transaction의 결과가 어떤 순서대로 실행된 결과와 동일함을 보장하는 속성이다.

ACID transaction이 보장된다면 DB data에 배타적으로 접근하듯이 동작하고, 개발자는 동시 실행되는 여러 busniess logic을 쉽게 작성할 수 있다.

Saga에서는 한 transaction에서 commit한 update분에 대해서 바로 다른 Saga가 바라볼 수 있는데, 이는 아래와 같은 두 가지 문제를 가지게 된다. 

- 한 Saga가 실행 중에 접근하는 data를 도중에 다른 Saga가 변경할 수 있다.
- 한 Saga가 update하기 전 data를 다른 Saga가 읽어서 data consistency가 깨질 수 있다.

위와 같은 문제점때문에 Saga를 동시에 실행한 결과와 순차적으로 실행한 결과가 달라질 수 있다. 하지만, 이 문제는 Saga에서만 발생하는 문제가 아니다. (ex. DB isolation level 설정에 따라서도 같은 문제가 발생 가능, 일반적으로 full isolation을 걸어놓지 않는다면)

**Anamoly 개요**

비격리 문제에 의해서 생기는 Anamoly는 아래와 같이 정리가 가능하다.

- Lost updates: 한 Saga의 update분을 다른 Saga가 미처 못 읽고 덮어쓰는 문제.
- Dirty reads: Saga update를 하지 않은 update분을 다른 transaction이나 Saga가 읽는 문제.
- Fuzzy/Non-repeatable reads: 한 Saga의 상이한 두 단계가 같은 data를 읽어도 결과가 달라지는 현상, 이는 다른 Saga가 그 사이 update를 진행했기 때문이다.

**Lost updates**

아래와 같은 상황에서 발생 가능하다.

1. Order 생성 Saga 첫 번째 단계에서, Order를 생성한다.
2. Saga 실행 중, Order 취소 Saga가 Order를 취소한다.
3. Order 생성 Saga 마지막 단계에서 Order를 승인한다.

위 과정에서 소비자는 자신이 취소하였던 Order에 대한 음식을 배달받게 되는 문제가 발생한다.

**Dirty reads**

아래와 같은 상황에서 발생 가능한 문제이다.

Order 취소 Saga는 아래와 같은 transaction으로 구성되어 있다.

1. 소비자 서비스: 신용 잔고를 늘린다.
2. 주문 서비스: Order를 취소 상태로 변경.
3. 배달 서비스: 배달을 취소한다.

Order 취소 Saga와, Order 생성 Saga의 실행이 서로 겹쳐서 실행 중인데, 소비자가 배달을 취소하기에는 너무 늦어서 Order 취소가 rollback되는 경우, 아래와 같이 transaction 순서가 꼬일 수 있다.

1. Order 취소 Saga: 신용 잔고를 늘린다.
2. Order 생성 Saga: 신용 잔고를 줄인다.
3. Order 취소 Saga: 신용 잔고를 줄이는 compensable transaction이 작동.

위 flow의 시나리오가 발생할 경우, 사용자는 자신의 잔고 총액보다 더 비싼 음식을 주문할 수 있는 Order를 만들어 낼 수 있는 문제가 발생한다.

**비격리 대책**

위에서 설명하였던 문제들을 해결하기 위해서 비격리 대책을 세울 필요가 존재한다. ***_PENDING으로 만들어진 상태도 이러한 문제를 해결하기 위한 전략 중 하나이다.(Sementic lock countermeasure). 해당 전략을 제시한 논문에서는 이외에도 아래와 같은 전략을 제시하고 있다.

- Sementic lock: Application 수준의 lock.
- Commutative updates: Update 작업은 어떤 순서로 실행되어도 되게 설계.
- Pessimistic view: Saga 단계 순서를 재조정하여, business risk를 최소화.
- Reread value: Data를 update할 때, 그 전에 update된 내용은 없는지 값을 다시 읽고 확인해서 dirty writes를 방지. (update된 내용이 있는 경우, Saga를 중지하고 나중에 재시작)
- Version file: 순서를 재조정할 수 있게 update를 기록. (noncommutative → commutative)
- By value: Request별 business risk를 기준으로 concurrency mechanism을 동적으로 선택. (정합성이 중요한 logic 같은 경우에는 distributed transaction을 채택)

**Symentic lock을 이용한 전략**

Compensatable transaction이 insert/update하는 record에 무조건 flag를 설정하는 방법이다. 이를 통해 다른 transaction이 record에 접근하지 못하도록 lock을 걸거나, 다른 transaction이 해당 record를 처리할 때, warning을 보내줄 수 있다. 

Flag는 repeatable transaction(Saga 완료) 또는 compensating transaction(Saga rollback)에 의해서 해제된다. (ex. Order.state)

Lock뿐만 아니라, 잠금된 record를 어떻게 Saga로 처리할 지 아래와 같이 사례별로 결정해야 한다.

- 잠금된 record에 접근 시 실패 처리하고 re-try 유도,  re-try logic을 구현해야 하기 때문에 복잡해 질 수 있다.
- Lock이 해제될 때까지 해당 요청을 blocking, Application 단에서 lock을 관리하는 부담은 있지만, 관련 logic이 simple해짐. (deadlock에 대한 방안 필요)

### 4.4 Order Service 및 Order Creation Saga 설계

주문 서비스는 아래의 그림과 같이 business logic이 포함된 OrderSerivce, Order등의 class와 Adaptor인 OrderCommandHandlers같은 class, Orchestrator인 CreateOrderSaga 등의 class로 구성된다.

![Untitled](4%20Trasaction%20management%20Saga%205c625067ea7e45ba8f5a09f12a71be7c/Untitled%205.png)

여기서 Orchestrator인 OrderService는 그 자신이 Saga participant이기도 한 Service이다. participant proxy는 해당 participant들의 messaging API가 정의된 class이다.

**OrderService Class**

Order 생성/관리를 담당하는 Class로, 여기서 SagaManager는 eventuate tram saga framework에서 기본으로 제공되는, Orchestrator와 participant를 작성하는 class이다.

![Untitled](4%20Trasaction%20management%20Saga%205c625067ea7e45ba8f5a09f12a71be7c/Untitled%206.png)

createOrder는 간단하게 아래와 같은 code로 구현이 가능하다.

```java
@Transactional // 서비스 메서드에 트랜잭션을 적용
public class OrderService {

@Autowired 
private SagaManager<CreateOrderSagaState> createOrderSagaManager;

@Autowired
private OrderRepository orderRepository;

@Autowired
private DomainEventPublisher eventPublisher;

public Order createOrder(OrderDetails orderDetails) {
		...
    ResultWithEvents<Order> orderAndEvents = Order.createOrder(…); // Order 생성
    Order order = orderAndEvents.result;
    OrderRepository.save(order); // DB에 Order 저장
		eventPublisher.publish(Order.class, 
													Long.toString(order.getId()), 
													orderAndEvents.events); // 이벤트 발행

		createOrderSagaState data = 
										new CreateOrderSagaState(order.getId(), 
																							orderDetails); // CreateOrderSaga 생성

		createOrderSagaManager.create(data, Order.class, order.getId());

		return order;
}
```

**Order 생성 Saga 구현**

Order 생성 Saga의 각 class는 아래와 같은 역할을 담당한다.

- CreateOrderSaga: Saga의 FSM을 정의한 Singleton class로 command message를 생성하고, participant proxy class가 지정한 channel을 통해 message 전송.
- CreateOrderSagaState: Saga의 저장 상태, command message를 생성.
- Saga participant proxy class: Proxy class마다 command channel, command message type, return type으로 구성된 participant의 messaing API 정의.

**CreateOrderSaga orchestrator**

Eventuate tram saga framework에서 제공되는 DSL을 사용하고 있으며, 아래와 같은 code로 정의가 가능하다.

```java
...
private SagaDefinition<CreateOrderSagaState> sagaDefinition;

public CreateOrderSaga(...) {
	this.sagaDefinition = 
		step().withCompensation(orderService.reject, 
						CreateOrderSagaState::makeRejectOrderCommand)
		.step()
		.invokeParticipant(consumerService.validateOrder,
						CreateOrderSagaState::makeValidateOrderByConsumercommand)
		...
		.build()
}
```

`step()`, `invokeParticipant()`, `onReply()`, `withCompoensation()` 은 eventuate tram framework에서 제공하는 DSL의 일부이다.

**CreateOrderSagaState class**

Saga instance의 상태를 나타내는 class이다. 아래의 code와 같이 구현될 수 있으며, OrderService가 이 class의 instance를 생성하고, framework가 이 instance를 DB에 저장한다. 

```java
public class CreateOrderSagaState {

  private Long orderId;
  private OrderDetails orderDetails;
  private long ticketId;

  public Long getOrderId() {
    return orderId;
  }

  private CreateOrderSagaState() {
  }

  public CreateOrderSagaState(Long orderId, OrderDetails orderDetails) { ← Orderservice가 호출하여 CreateOrdersagastate 인스턴스를 생성 
    this.orderId = orderId;
    this.orderDetails = orderDetails;
  }

  CreateTicket makeCreateTicketCommand() {  // CreateTicket 커맨드 메시지 생성
    return new CreateTicket(getOrderDetails().getRestaurantId(),
                  getOrderId(), makeTicketDetails(getOrderDetails()));
  }

  void handleCreateTicketReply(CreateTicketReply reply) {  // 새로 만든 티켓 ID 저장
    logger.debug("getTicketId {}", reply.getTicketId());
    setTicketId(reply.getTicketId());
  }

  CancelCreateTicket makeCancelCreateTicketCommand() {  // CancelCreateTicket 커맨드 메시지 생성
    return new CancelCreateTicket(getOrderId());
  }

  ...
```

CreateOrderSaga는 CreateOrderSagaState를 호출해서 command message를 생성하고, 이 message를 KitchenServiceProxy와 같은 endpoint로 전달하게 된다.

**KitchenServiceProxy class**

주방 서비스의 command message 3개의 endpoint를 정의하는 class이며 아래와 같은 code로 구현될 수 있다.

- create: Ticket 생성.
- confirmCreate: Ticket 생성 확인.
- cancel: Ticket 취소.

```java
public class KitchenServiceProxy {

public final CommandEndpoint<CreateTicket> create =
      CommandEndpointBuilder
          .forCommand(CreateTicket.class)
          .withChannel(
              KitchenServiceChannels.kitchenServiceChannel)
          .withReply(CreateTicketReply.class)
          .build();

public final CommandEndpoint<ConfirmCreateTicket> confirmCreate =
      CommandEndpointBuilder
          .forCommand(ConfirmCreateTicket.class)
          .withChannel(
              KitchenServiceChannels.kitchenServiceChannel)
          .withReply(Success.class)
          .build();

public final CommandEndpoint<CancelCreateTicket> cancel =
      CommandEndpointBuilder
          .forCommand(CancelCreateTicket.class)
          .withChannel(
              KitchenServiceChannels.kitchenServiceChannel)
          .withReply(Success.class)
          .build();
}
```

위와 같은 proxy class는 필수적인건 아니지만, 이렇게 IF를 정해놓고 만드는 것이 테스트, 유지보수에 유리하기 때문에 권장되고 있다.

**Eventuate tram saga framework**

Saga orchestrator 및 participant를 모두 작성할 수 있는 framework로 transactional messaging을 활용하고 있으며 아래와 같은 구조를 가지고 있다.

![Untitled](4%20Trasaction%20management%20Saga%205c625067ea7e45ba8f5a09f12a71be7c/Untitled%207.png)

sagas.orchestration package는 이 framework의 core라고 볼 수 있으며 기초 interface SimpleSaga, instance를 생성/관리하는 Sagamanager가 포함되어 있다.

OrderService가 Saga를 생성하는 과정은 다음의 그림과 같다. 

![Untitled](4%20Trasaction%20management%20Saga%205c625067ea7e45ba8f5a09f12a71be7c/Untitled%208.png)

**1.** OrderService가 CreateOrderSagaState를 생성.

**2.** OrderService는 SagaManager를 호출하여 saga instance를 생성.

**3.** SagaManager는 Saga definition의 첫 번째 단계를 실행.

**4.** CreateOrderSagaState를 호출하여 command message를 생성.

**5.** SagaManager는 command message를 소비자 서비스에게 보냅니다.

**6.** SagaManager는 saga instance를 DB에 저장합니다.

위의 그림과는 반대로 SagaManager가 소비자 서비스의 response를 받을 때, 생기는 event 순서는 다음과 같다.

![Untitled](4%20Trasaction%20management%20Saga%205c625067ea7e45ba8f5a09f12a71be7c/Untitled%209.png)

**1.** tram은 소비자 서비스의 응답을 SagaManager에 전달.

**2.** SagaManager는 DB에서 saga instance를 조회.

**3.** SagaManager는 그다음 Saga definition 단계를 실행.

**4.** CreateOrderSagaState를 호출하여 command message를 생성.

**5.** SagaManager는 command message를 주방 서비스에게 전송.

**6.** SagaManager는 updated saga instance를 DB에 저장.

**OrderCommandHandlers class**

OrderService는 자기 자신의 saga에도 참여하게 된다. CreateOrderSaga는 Order를 승인/거부하기 위해서 OrderService를 호출하며, command message를 handling하는 것은 이 class에 작성하게 된다.

```java
public class OrderCommandHandlers {

  @Autowired
  private OrderService orderService;

  public CommandHandlers commandHandlers() { // 커맨드 메시지를 각각 적절한 핸들러 메서드로 라우팅
    return SagaCommandHandlersBuilder
      .fromChannel("orderService")
      .onMessage(ApproveOrderCommand.class, this::approveOrder)
      .onMessage(RejectOrderCommand.class, this::rejectOrder)
      ...
      .build();
  }

  public Message approveOrder(CommandMessage<ApproveOrderCommand> cm) {
    long orderId = cm.getCommand().getOrderId(); 
    OrderService.approveOrder(orderId);  // Order를 승인 상태로 변경
    return withSuccess();  // 제네릭 성공 메시지 반환
  }

  public Message rejectOrder(CommandMessage<RejectOrderCommand> cm) {
    long orderId = cm.getCommand().getOrderId();
    OrderService.rejectOrder(orderId); // Order를 거부 상태로 변경
    return withSuccess();
  }

}
```

Saga에 참여한 다른 Service도 이러한 command handler class를 두고 자신의 domain class를 update하게 된다.

**OrderServiceConfiguration class**

간단하게 설명하면, 아래의 예제 code는 OrderService의 Spring bean들이 정의된 class이다. 

```java
@Configuration
public class OrderServiceConfiguration {

@Bean
  public OrderService orderService(RestaurantRepository restaurantRepository,
    …
    SagaManager<CreateOrderSagaState> createOrderSagaManager,
  …) {
    return new OrderService(restaurantRepository,
      …
      CreateOrderSagaManager
      …);
  }

@Bean
  public SagaManager<CreateOrderSagaState> createOrderSagaManager(
    CreateOrderSaga saga) {
    return new SagaManagerImpl<>(saga);
  }

@Bean
  public CreateOrderSaga createOrderSaga(OrderServiceProxy orderService,
    ConsumerServiceProxy consumerService, …) {
    return new CreateOrderSaga(orderService, consumerService, …);
  }

@Bean
  public OrderCommandHandlers orderCommandHandlers() {
    return new OrderCommandHandlers();
  }

@Bean
  public SagaCommandDispatcher orderCommandHandlersDispatcher(
    OrderCommandHandlers orderCommandHandlers) {
    return new SagaCommandDispatcher(“orderService”,
      orderCommandHandlers.commandHandlers());
  }

@Bean
  public KitchenServiceProxy kitchenServiceProxy() {
    return new KitchenServiceProxy();
  }

@Bean
  public OrderServiceProxy orderServiceProxy() {
    return new OrderServiceProxy();
  }

…
}
```

**References**

- 마이크로서비스 패턴 (크리스 리차드슨 저)