---
title: (Spring) Custom Serializer를 활용해서 Response object를 jsonarray 형태로 바꾸기
category: "Spring"
cover: spring.png
author: Jun Young Choi
---

### Problem

Spring에서 API를 개발할 때 흔히 DTO를 ResponseEntity안에 넣어서 반환한다.

하지만 요구사항에 따라서 DTO의 특정 항목을 제외시키거나, 추가하거나, Class의 구조와는 전혀 다른 형태로 Response를 내려줘야 할 때가 존재한다.

특정 항목을 제외하거나, 이름을 바꾸거나 하는 간단한 작업은 Jackson 내의 `@JsonIgnore`, `@JsonView` 등의 annotation을 이용해서 간단하게 처리가 가능하다. 기존 Class구조와는
다르게 Response class를 Serialize하는 custom serializer를 구현하여 해결하였다.

기본적인 field명 변경이나 특정 field를 unwrap하는 예제는 많이 나와 있으니 상대적으로 reference가 적은 간단한 DTO Object를 JsonArray형태로 Serialize하는 Custom
Serializer를 구현하여 문제를 해결해보자.

### Code Example

간단한 예제이기 때문에 Controller, Response DTO class, custom serializer만을 구현하였다.
현업에서는 이렇게 간단한 구조보다는 좀 더 복잡한 구조를 가지고 있을 가능성이 높은데, 이런 경우에는 Serializer를 좀 더 유연하게 만드는 경우로 해결할 수 있을 것 같다.


**Custom Serializer**

```java
public class ResponseCustomSerializer extends StdSerializer<TestResponse> {

	protected ResponseCustomSerializer(Class<TestResponse> t) {
		super(t);
	}

	@Override
	public void serialize(TestResponse value, JsonGenerator gen, SerializerProvider provider) throws IOException {
		gen.writeStartArray();
		for (Response each : value.getResponses()) {
			gen.writeObject(each);
		}
		gen.writeEndArray();
	}
}
```


**DTO**

```java
@RequiredArgsConstructor
@Getter
@JsonSerialize(using = ResponseCustomSerializer.class)
public class TestResponse {

	private final List<Response> responses;

	public TestResponse() {
		this.responses = Arrays.asList(new Test("test", 1), new Test("test2", 2));
	}

	@RequiredArgsConstructor
	@Getter
	private static class Test implements Response {
		private final String name;
		private final Integer id;
	}
}
```

**Controller**

```java
@GetMapping("/test")
public ResponseEntity<Response> getJsonArray() {
	return ResponseEntity.ok(new TestResponse());
}
```

**결과**

```json
// Serializer 적용 전
{
  responses: [
    {
      ~~~
    },
    {
      ~~~
    }
  ]
}
```

```java
// Serializer 적용 후
[
	{~~~}. {~~~}
]
```
