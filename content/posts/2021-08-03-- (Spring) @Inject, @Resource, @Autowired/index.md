---
title: (Spring) DI를 하는 세 가지 방법(@Resource, @Inject, @Autowired)의 차이
category: "Spring"
cover: spring.png
author: Jun Young Choi
---

Bean Object 사이에 DI를 위해서 dependency meta 정보를 작성하는 방법은 크게 두 가지가 있다.

- 명시적으로 구체적인 bean을 지정하는 방법
- 일정한 규칙에 따라 자동으로 선정하는 방법

보통 후자의 방법에서 type 비교를 통해 호환되는 bean을 DI 후보로 삼는 것을 autowiring이라고 한다.

meta 정보를 작성하는 방법도 bean을 등록하는 과정과 같이 XML을 이용한 `<bean>` tag, schema를 가진 전용 tag, annotation, code를 통한 직접적인 DI 설정과 같이 여러 가지 방법이 존재한다.

annotation을 이용해서 DI를 하는 방법 중 `@Resource`, `@Inject`, `@Autowired` 이 세 가지 방식의 차이점은 아래와 같다.

**`@Resource`**

- Class의 setter method, field에 사용 가능

    ```java
    public class Test {
    	@Resource
    	private Target target;
    	...
    	// 아래와 같이 setter method에 지정할 수 있으나, 위 처럼 field에 annotation만 지정해도 됨
    	@Resource(name="target")
    	public void setTarget(Target t) {
    		this.target = t;
    	}
    }
    ```

- 참조할 bean의 **name**을 이용해서 검색, 이름이 없는 경우에 **type**을 검색하게 되는데 이는 `ApplicationContext` 이외에는 권장되지 않는다.

**`@Autowired` / `@Inject`**

- 기본적으로 참조할 bean의 type을 이용하여 autowiring을 시도한다. 둘 다 의미와 사용법은 동일하나 차이점은 아래와 같다.
    - `@Autowired` 의 경우, Spring 2.5 이후 적용된 Spring 전용 annotation
    - `@Inject` 는 JavaEE 6의 JSR-330에 정의되어 있는 표준 spec, required 설정 불가

    보통 Spring에서만 쓸 것이라면 `@Autowired` 를 사용하고, Spring 이외에도 적용이 필요하다면 `@Inject` 를 쓰는 것이 권장된다. 

- Class의 constructor, field, setter, 일반 method에 모두 사용 가능하다.
- `@Resource` 와는 다르게 동일 type을 가지는 bean이 여러 개 존재할 수 있다.(ex. `Datasource`) 이런 경우, Collection을 통해 모두 DI 받을 수 있다.
- Collection을 통해 DI 받는 것 보다는 `@Qualifier` 를 조합해서 활용하는게 더 좋은 방법인데, 아래와 같이 사용할 수 있다.

    ```java
    // 
    @Component
    @Qualifer("h2")
    public class h2DataSource {
    	@Bean
    	public DataSource dataSource;
    	...
    }

    // 동일한 type bean
    @Component
    @Qualifer("mysql")
    public class mysqlDataSource {
    	@Bean
    	public DataSource dataSource;
    	...
    } 

    // DI하는 부분
    ...
    @Autowired
    @Qualifier("mysql")
    private Datasource dataSource;
    ```

- `@Qualifier` 의 경우 setter, field, parameter에만 사용 가능하다.
- `@Resource` 나 `@Autowired` 나 일단 지정한 순간 DI 후보 bean이 존재하지 않으면 에러가 발생한다. 만약에 autowiring 시 bean을 찾지 않아도 된다고 하면, `required=false` 를 설정해주면 된다.
- `@javax.inject.Qualifier` 가 존재하는데 이는 위 Inject처럼 JavaEE 6에서 정의된 것이다. 요건 그 자체로 한정자로 사용해서 `@Inject` 와 같이 쓸 수 없고, 단지 다른 한정자 annotation을 정의하는 용도로만 쓸 수 있다. 결론적으로 말하면, `@javax` 내 inject, qualifier는 Spring에 독립적인 Class를 생성할 목적이 아니라면 안 쓰는게 권장된다.
