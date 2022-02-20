---
title: (Microservice Pattern) 5. Business logic 설계
category: "Microservice Pattern"
cover: microservice.png
author: Jun Young Choi
---

Business logic이 여러 Service에 산재하는 MSA에서는 복잡한 business logic을 개발하기가 Monolith에 비해서 훨씬 까다롭다. 대표적인 골치 아픈 문제는 아래와 같다.

- Domain model은 대부분 서로 연결된 Class가 거미줄처럼 엮여있음.

  Monolith에서는 크게 문제가 되지 않는 문제이나, Class가 여러 Service로 흩어져 존재하는 MSA에서는 Service boundary를 넘나드는 Class reference를 제거해야 한다. (ex. Entity 내 class reference)

- MSA 특유의 transaction 관리 제약 조건 하에서도 정상적으로 작동되는 business logic을 설계해야 함.

  ACID transaction이 Service 내부에서 보장되면 이상적이겠으나, 불가능하기에 Saga pattern을 이용해서 Data consistency를 보장해야 한다.


위 두 문제는 이번 장에서 설명할 DDD aggregate pattern을 이용해서 해결할 수 있다.

Aggregate란, 한 단위로 취급 가능한 Class를 모아놓은 것이다. 이를 통해서 Object reference가 Service boundary를 넘어갈 일이 없다. 또한 하나의 transaction을 이용해서 aggregate를 생성/수정하기 때문에 transaction 제약 조건에 부합한다.

### 5.1 Business logic 구성 pattern

일반적으로 Business logic은 service에서 가장 복잡한 부분이며, 절차적 transaction script pattern과 OOP Domain model pattern 두 가지로 구현될 수 있다.

**Transaction script pattern**

Transaction script라는 method를 작성해서 presentation layer에서 들어온 request를 처리하는 방법이다. 이 방법은 동작과 상태를 보관하는 class가 별도로 존재한다는 특징이 존재한다.

OOP적 접근 방식이 좋기는 하지만, business에 따라서 over engineering이 될 수도 있다. 이런 경우에는 Transaction script pattern을 이용해서 절차적인 code를 작성하는 것이 합리적인 선택이 될 것이다.

**Domain model pattern (OOD)**

Business logic을 상태와 동작을 가진 class로 구성된 Object model로 구성하는 pattern.

전자의 절차적인 방법은 별 생각 없이 간단한 system을 만드는데는 유리하지만, business logic이 복잡해지는 경우 유지보수가 힘들어진다는 문제가 있다.

OOP로 구성된 business logic은 비교적 작은 class들이 그물망처럼 얽힌 Object model로 구성된다. Service method는 Domain class를 생성/호출하고 business logic 처리를 위임하기 때문에 Service method가 상대적으로 단순해지게 된다는 특징을 가지며, 아래의 장점을 가지게 된다.

- 설계를 이해/관리하기 쉬움
- Test에 용이
- 잘 알려진 DP를 적용해서 확장하기 쉬움

### 5.2 Domain model 설계 : DDD aggregate pattern

DDD란 복잡한 business logic을 개발하기 위해서 OOD를 개선해서 만든 pattern이다. Sub domain과 이와 연관된 bounded context개념은 DDD의 핵심 전략이다.

아래는 DDD에서 domain model을 구축하는데 흔히 쓰이는 building block이다. 각 class가 domain model에서 수행하는 역할과 class의 특징은 아래와 같다.

- Entity

  영속적인 신원을 가진 object로, entity는 value가 아닌 Id를 기준으로 동일 class인지를 구분한다. (JPA에선 `@Entity`)

- VO

  여러 value를 모아놓은 object. property value가 동일한 object는 서로 바꾸어서 사용 가능.

- Factory

  Default constructor로 직접 만들기에 복잡한 class 생성 logic이 구현된 class or method. Encapsulation을 이용해서 구체적인 class를 감출 수 있으며, class 내 static method로 구현.

- Repository

  Entity를 CRUD하는 DB access logic을 capsulation한 object.

- Service

  Entity, VO에 속하지 않은 Business logic object로 adaptor에 해당된다.

- Aggregate

  Aggregate는 한 단위로 취급 가능한 boundary 내부의 domain object들로 정의할 수 있다.


OOP에 기반한 domain model의 경우, class와 class 간 관계를 모아놓은 것이다. 이 model의 경우, business object의 경계가 애매하다. 그렇기 때문에 MSA에서 이 model을 도입할 경우 아래와 같은 문제가 생길 수 있다.

**불분명한 boundary 문제**

Order라는 Business object에 어떤 작업을 수행한다고 가정했을 때, 관련된 연관 data가 어디까지인지 기존의 OOD model에서는 알아보기 힘들고, 대략적으로 짐작할 수 밖에 없다. 이러한 상황에서 business object를 update할 때 문제가 생길 수 있다.

Business object는 보통 invariant를 가지고 있고 준수해야 하는 business logic이 존재한다. Business Object의 일부를 직접 update하게 된다면, 결과적으로는 business logic를 위반하는 경우가 존재한다. 이런 case에서 DDD의 aggregate는 좋은 해결책이 될 수 있다.

**Aggregate는 boundary가 분명하다**

Aggregate는 한 단위로 취급 가능한 boundary 내부의 domain object들로 정의할 수 있다. 기본적으로 하나의 root entity + VO로 구성되며 business object들은 대부분 aggregate로 modeling한다. (ex. 2장에서 FR에서 noun단위로 domain model을 생성했는데 여기서 Order, Customer등이 aggregate)

Aggregate는 보통 DB에서 통째로 가져오는 단위로 묶여있기 때문에, lazy loading/cascading 전략 같은 문제를 신경 쓸 필요가 없다.

**Aggregate 규칙**

Aggregate에는 몇 가지 지켜야 할 규칙이 존재하는데, 이러한 규칙을 통해서 aggregate는 자신의 invariant를 강제할 수 있는 self-contained 단위가 된다.

**Aggregate root만 참조하라**

외부 class는 근본적으로 aggregate의 root entity만 참조할 수 있도록 제한한다. client는 항상 aggregate의 root method를 이용해서 aggregate를 update할 수 있으며, 이러한 규칙을 통해서 aggregate는 자신의 invariant를 강제할 수 있다.

**Aggregate간 reference는 항상 반드시 PK를 사용하라**

Aggregate는 object reference대신 PK를 이용해서 서로를 참조하게 된다. (cf. OOD에서는 FK를 이용) 이러한 방식을 채택하게 된다면, aggregate는 loose coupling을 달성할 수 있고, boundary가 분명해지기 때문에 혹여 실수로 다른 aggregate를 잘못 건드릴 일은 일어나지 않는다.

DB 확장 측면에서도 aggregate를 sharding하는 편이 더 명확하다는 장점 또한 존재한다.

**하나의 Transaction으로 하나의 Aggregate를 생성/수정하라**

단일 transaction을 통해서 하나의 aggregate를 생성/수정해야 한다. RDBMS가 아닌 NoSQL을 쓸 때도 잘 들어맞기도 하는 장점을 가지고 있기 때문이다. 다만 이러한 규칙을 준수하기 위해서는 여러 aggregate를 생성/수정하는 작업을 구현하기가 조금 까다로워진다는 문제가 존재하나, Saga pattern을 이용한다면 해결 가능하다.

Service 하나에서 여러 aggregate에 걸쳐서 data consistency를 유지하는 방법 중 또 다른 하나는, 여러 aggregate를 하나의 transaction으로 update하는 방법이다. (ex. OrderService에서 Order, Ticket aggregate를 하나의 transaction으로 update)

**Aggregate 입도**

Domain model에서 aggregate의 크기를 결정하는 일은 매우 중요하다. 기본적으로 aggregate의 단위는 작으면 작을수록 좋다. 각 aggregate의 update는 serialize되기 때문에, 작으면 작을수록 application이 동시에 처리할 수 있는 request 수가 늘고 확장성이 좋아진다.

다른 한 편으로는 aggregate를 transaction의 단위로 잡았기 때문에 어떤 update를 atomic하게 처리해야 하는 경우에는 해당 aggregate의 크기를 크게 잡아야 할 수도 있다. (ex. Order안에 Consumer를 넣을 지, 아니면 별개의 단위로 잡을 지)

확장성과 처리의 용이성의 trade-off를 잘 따져서 boundary를 잡는 것이 중요하나 기본적으로 책에서는 MSA에서는 최대한 aggregate의 단위를 작게 가져가는 것을 best practice로 보고 있다.

**Business logic 설계: Aggregate**

MSA business logic은 대부분 aggregate로 구성되고 나머지는 domain service와 saga에 위치하게 된다. Saga가 local transaction을 orchestration하여 data consistency를 맞추고, inbound adaptor는 service를 호출한다. service는 repository로 DB에서 aggreagte를 생성/조회하게 된다.

repository는 각각 DB에 접근하는 outbound adaptor로 구현하게 된다.

### 5.3 Domain event publish

DDD context에서 domain event는 aggregate에 발생한 사건이다. 대부분 domain event는 class로 표현되고 특정한 상태 변경을 나타내게 된다.(ex. 주문 생성, 취소, 배달)

Aggregate는 상태가 전이될 때마다 이에 관련된 consumer들을 위해 event를 publish하게 된다. Application DB에서의 aggregate 상태 전이가 이 모든 상황에서 알림을 trigger하는 장본인이다.

**Domain event란 무엇인가?**

Domain event는 과거 분사형 동사로 명명한 class이다. Event에 의미를 부여하는 property들이 있는데, primitive type 내지는 VO이다. (ex. OrderCreated class에는 orderId property가 존재)

Domain event에는 meta data도 포함되기는 하는데, 관점에 따라서 상위 class에 정의된 event object의 일부이거나, event object를 감싼 envelope object에 존재하게 된다.

```java
interface DomainEvent {}

interface OrderDomainEvent extends DomainEvent {}

class OrderCreatedEvent implements OrderDomainEvent {}

interface DomainEventEnvelope<T extends DomainEvent> {
	String getAggregateId();
	...
	T getEvent();
}
```

위의 예제 코드에서 DomainEvent/OrderDomainEvent  interface는 자신을 구현한 class가 domain event임을 알리는 marker interface이다.

**Event enrichment**

주문 event를 처리하는 consumer를 작성한다고 가정했을 때, 발생한 Event 자체는 OrderCreatedEvent class에 다 담겨 있지만, consumer가 event를 받아서 처리하는 경우에는 주문 내역 또한 필요하다.

필요한 정보를 OrderService에서 직접 가져올 수도 있지만, consumer가 직접 service를 조회해서 aggregate를 조회하는 것은 overhead가 크다. 이러한 문제를 해결하기 위해서 cousumer에 필요한 정보를 event가 가지고 다니는 Event enrichment 기법을 사용하게 된다.

아래 예제 code와 같이 Order aggregate는 주문 내역까지 OrderCreatedEvent에 넣어서 표현할 수 있다.

```java
class OrderCreatedEvent implements OrderEvent {
	...
	private DeliveryInformation deliveryInformation; // consumer가 필요로 하는 데이터
	private long restaurantId;
	private String restaurantName;
	...
}
```

Event enrichment는 consumer를 단순화하는 이점이 있지만, consumer쪽 변경사항이 생기면 event class 또한 같이 변경되어야 하기 때문에 안정성은 떨어진다는 단점이 존재한다. 그러나 대부분의 경우에서 event안에 포함되어야 하는 property는 명백하다.

**Domain event 식별**

Domain event는 여러 가지 방법으로 식별할 수 있다. FR에서는 알림이 필요한 시나리오를 “X가 발생 시 Y를 수행한다"라는 방식으로 보통 기술하게 된다. 결국 여기서 알림 요건은 곧 Domain event가 필요하다라는 뜻으로 해석할 수 있다.

보통 최근의 추세는 event storming이라는 방법을 많이 사용하고 있다. 복잡한 domain을 이해하기 위해서 event 중심으로 workshop을 진행하는 것이며 아래의 3단계를 거치게 된다.

- Event brainstorming

  Domain event를 머릿속에서 짜내는 단계. 보통 메모지로 구분된 domain event를 modeling화면에 대략 그려 놓은 timeline에 맞춰 배치한다.

- Event trigger 식별

  각각의 event를 일으키는 trigger(사용자 액션, 외부 시스템, 기타 domain event, 시간 경과, ...)를 식별한다.

- Aggregate 식별

  각 Command 소비 후, 적절한 event를 발생시키는 aggregate를 식별해서 노란색 메모지로 표시.


이러한 event storming의 경우 domain model을 신속하게 구축할 수 있는 유용한 기법이다.

**Domain event 생성 및 publish**

Domain event를 이용한 통신은 async messaging 형태를 가지고 있지만, business logic이 domain event를 MQ에 발행하려면 먼저 domain event를 생성해야 한다.

**Domain event 생성**

개념적으로 domain event는 aggregate가 publish한다. aggregate는 자신의 상태가 변경되는 시점과 그 결과 어떤 event가 publish될 지 알고 있다. aggregate가 직접 messaging api를 호출하는 방법도 있지만, 인프라 관심사와 business logic이 섞여버릴 수 있는 문제점이 존재한다.

그렇기 때문에 aggregate와 호출하는 service는 책임이 분리되어야 한다. (ex. DI) 아래의 예제 code와 같이 구현할 수있다.

```java
public class Ticket {

	public List<TicketDomainEvent> accept(LocalDateTime readyBy) {
		...
		this.acceptTime = LocalDateTime.now(); // Ticket update
		this.readyBy = readyBy;
		return singletonList(new TicketAcceptedEvent(readyBy)); // event 반환
	}

}

@Service
@RequiredArgsConstructor
public class KitchenService {

	private final TicketRepository ticketRepository;
	private final TicketDomainEventPublisher domainEventPublisher;

	public void accept(long ticketId, LocadDateTime readyBy) {
			Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(()->new ~~~Exception));
			List<TicketDomainEvent> events = ticket.accept(readyBy);

			domainEventPublisher.publish(Ticket.class, orderId, events); // domain event 발행
	}
}
```

Aggregate root의 특정 field에 event를 차곡차곡 쌓아두고 service가 event를 꺼내서 publish하는 방법도 있다. (ex. Spring Data Release Ingalls에서는 실제로 이렇게 ApplicationContext에 event를 자동으로 publish하는 방법을 사용)

**Domain event를 확실하게 publish하는 방법**

Message를 local DB transaction의 일부로 확실하게 전송하는 방법은 3장에서 다루었는데, domain event 또한 다를게 없다. Eventuate tram framework에서는 이러한 메커니즘이 구현되어 있는데, DB transaction의 일부로 event를 outbox table에 넣고 commit된다면 이 table에 들어간 event를 broker에 publish하게 된다.

**Domain event 소비**

Domain event는 결국 Message의 형태로 바뀌어서 MQ에 publish된다. 보통 broker에서 제공하는 저수준의 client API를 이용해서 구현할 수도 있지만, framework에서 제공되는 고수준의 API를 이용해서 적절한 handler method로 dispatch하는게 다양한 처리에 대해서 좀 더 편하게 구현할 수 있다.

### 5.4 주방 Service business logic

KitchenService는 음식점이 주문을 관리할 수 있게 해주는 service이다. Restaurant/Ticket aggregate가 이 service의 main aggregate이다.

Restaurant aggregate는 음식점 메뉴 및 운영 시간을 알고 있는 상태에서 주문을 검증, Ticket aggregate는 배달원이 픽업할 수 있게 음식점이 미리 준비해야 할 주문을 나타낸다.

KitchenService에는 위의 두 aggregatee를 수정하는 method가 존재하며, Repository에는 각각의 aggregate(entity)를 저장하는 method들이 존재한다.

**Ticket aggregate**

Ticket aggregate는 음식점 주방 관점에서 주문에 해당되는 aggregate이다. 음식점 주방이 배달원이 픽업할 주문을 준비하는 데에만 집중하고 있다. (배달 정보, 지불 내역등 소비자와 관련된 정보는 존재하지 않음)

Ticket class는 기존 OOD model에서 익숙한 entity class의 구조를 가지고 있으나, 다른 점은 다른 aggregate(entity)를 참조하는 부분이 class reference가 아닌 PK 자체를 들고 있는다는 점이다.

**Ticket aggregate 동작**

Ticket을 생성하는 static factory method create()를 비롯해서 음식점이 주문 상태를 업데이트하기 위해 호출하는 아래와 같은 method를 여러 개 가지고 있다.

- accept(): 음식점이 주문을 접수.
- preparing(): 음식점이 주문을 준비하기 시작. 해당 주문은 더 이상 변경/취소가 불가능.
- readyForPickup(): 주문 픽업 준비가 완료.

**KitchenService domain service**

KitchenService는 주방 service의 inbound adaptor에 의해서 호출된다. `accept()` , `reject()` , `preparing()` 등의 method는 각각의 aggregate를 가져와서 root에 존재하는 method를 호출하고 domain event를 publish하게 된다.

```java
@Service
@RequiredArgsConstructor
public class KitchenService {

	private final TicketRepository ticketRepository;
	private final TicketDomainEventPublisher domainEventPublisher;

	public void accept(long ticketId, LocalDateTime readyBy) {
		Ticket ticket = ticketRepository.findById(ticketId);
		List<TicketDomainEvent> events = ticket.accept(readyBy);
		domainEventPublisher.publish(ticket, events); // domain event publish
	}

}
```

위 예제 code의 `accept()` 는 음식점에서 새 주문을 접수할 때, Ticket aggregate를 가져와서 accept()를 호출하게 된다. 그리고 생성된 event를 publish하게 된다.

**KitchenServiceCommandHandler class**

주문 service에 구현된 saga가 전송한 command message를 처리하는 adaptor이다. KitchenService를 호출해서 Ticket을 생성/수정하는 handler method가 command별로 정의되어 있다.

```java
@RequiredArgsConstructor
@Service
public callass KitchenServiceCommandHandler {

	private final KitchenService kitchenService;

	public commandHandlers commandHandlers() { // command message를 handler에 mapping
		return SagaCommandHandlersBuilder
			.fromChannel(KitchenServiceChannels.kitchenServiceChannel)
			.onMessage(CreateTicket.class, this::createTicket)
			.onMessage(ConfirmCreateTicket.class, this::confirmCreateTicket)
			...
			.build();
	}

	private Message createTicket(CommandMessage<CreateTicket> cm) {
		CreateTicket command = cm.getCommand();
		long restaurantId = command.getRestaurantId();
		Long ticketId = command.getOrderId();
		TIcketDetails ticketDetails = command.getTicketDetails();

		try {
			// Service를 호출해서 Ticket 생성
			Ticket ticket = kitchenService.createTicket(restaurantId, ticketId, ticketDetails);
			return withSuccess(new CreateTicketReply(ticket.getId())); // 성공 응답 반환
		} catch(Exception e) {
			return withFailure(); // 실패 응답 반환
		}
	}
}
```

### 5.5 주문 Service business logic

주문 service는 주문을 생성, 수정, 취소하는 API를 제공하는 서비스이다. 비즈니스 로직은 Order/Restaurant aggregate 이외에도 여러 Saga로 구성되어 있다.

**Order aggregate**

Order aggregate는 소비자가 한 주문을 나타내며 구조는 아래와 같다.

Order class(root aggregate) 아래에 OrderLineItem, DeliveryInfo, PaymentInfo등 여러 VO가 존재한다. Consumer와 Restaurant는 서로 다른 aggregate이기 때문에 PK값을 이용해서 상호 참조하게된다.

```java
@Entity
@Table
@Access(FIELD)
public class Order {

	@Id
	private Long id;

	@Version
	private Long version; // optimistic locking

	private Long consumerId;

	@Embedded
	private OrderLineItems orderLineItems; // vo

	@Embedded
	private Money orderMinimum = new Money(MAX_VALUE);

}
```

**Order aggregate FSM**

주문을 생성/수정하기 위해서 OrderService는 다른 service와 saga를 통해서 협력해야 한다. pending 상태를 두어서 symentic lock을 적용하여 격리성을 보장하였다.

`revise()` , `cancel()` 등 다양한 service method는 일단 Order를 pending 상태로 만들고 saga를 이용해서 해당 작업이 수행 가능한지, 아닌지 확인하고 다음 상태로 전이시킨다.

**Order aggregate method**

Order class에는 각각 하나의 saga에 대응하는 method가 여럿 있다. 아래 예제 code는 생성 과정에서의 method를 모아놓은 code이다.

```java
public class Order {
	...
	public static ResultWithDomainEvents<Order, OrderDomainEvent> createOrder(long consumerId, Restaurant restaurant, List<OrderLineItem> orderLineItems) {
		Order order = new Order(consumerId, restaurnant.getId(), orderLineItems);
		List<OrderDomainEvent> events = singletonList(new OrderCreatedEvent(
			new OrderDetails(consumerId, restaurant.getId(), orderLineItems, order.getOrdetTotal()),
					restaurant.getName()));
		return new ResultWithDomainEvents<>(order, events);
	}

	public Order(long consumerId, long restaurantId, List<OrderLineItem> orderLineItems) {
		this.consumerId = consumerId;
		this.restaurantId = restaurantId;
		this.orderLineItems = orderLineItems;
		this.state = APPROVAL_PENDING:
	}

	...

}
```

**OrderService class**

OrderService class는 business logic의 entry point이다. Order를 생성/수정하는 method가 모두 이 class안에 존재하며, 대부분의 method가 saga를 만들어 Order aggregate 생성/수정을 orchestration하기 때문에 KitchenService에 비해서 좀 더 복잡하다.

```java
@Transactional
@Service
@RequiredArgsConstructor
public class OrderService {

	private final OrderRepository orderRepository;
	private SagaManager<CreateOrderSagaState> createOrderSagaManager;
	...

	public Order createOrder(long consumerId, long restaurantId, List<MenuItemIdAndQuality> lineItems) {
		Restaurant restaurant = restaurantRepositroy.findById(restaurantId);
		List<OrderLineItem> orderLineItems = makeOrderLineItems(lineItems, restaurant); // order aggregate 생성
		...
		orderRepository.save(order); // order 저장
		orderAggregateEventPublisher.publish(order, orderAndEvents.events); // domain event publish
		...
		createOrderSagaManager.create(data, Order.class, order.getId()); // createOrderSaga 생성
		return order;
	}

	...

}
```

위와 같은 예제들을 본다면 기존 monolith와 완전히 다른 구조가 아니라 비슷비슷한 구조를 가지고 있다는 것을 알 수 있다. 물론 다양한 설계 제약 조건이 부과된 DDD aggregate로 domain model을 구성하고, object reference가 아닌 PK를 쓴다는 점, transaction은 꼭 하나의 aggregate를 생성/수정할 수 있다는 제약 조건이 있다는 점은 다르긴 하다.

### References

- 마이크로서비스 패턴 (크리스 리차드슨 저)
