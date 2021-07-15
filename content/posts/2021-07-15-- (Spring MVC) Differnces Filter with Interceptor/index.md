---
title: (Spring MVC) Differences Filter with Interceptor
category: "Spring"
cover: spring.png
author: Jun Young Choi
---
## Problem

Spring MVC를 이용해서 특정 request에 대한 전처리, 후처리가 필요한 경우가 있는데,  
유사한 기능을 가진 Filter, Interceptor에 대한 작동 원리와 차이를 정확히 알아보자

전체적인 Spring MVC request life cycle은 아래 그림과 같다.  

![mvc request life cycle](mvc_request.png)

## Commonality

Filter와 interceptor 모두 request에 대한 pre/post handling을 수행하는 interface

## Differences

- 실행 시점의 차이

    Filter의 경우, WebApplication에 등록하고, Interceptor의 경우 Spring의 Context에 등록, 즉 Filter는 Servlet 처리 전후를 다룰 수 있음

    Filter에서 Exception이 발생할 경우에는, WebApplication에서 처리해야한다. (ex. tomcat의 경우 error page) 혹은 `request.getRequestDispatcher(String)` 와 같이 에러 처리를 위임해야 함

    반면에 Interceptor의 경우 ServletDispathcer 내에 있기 때문에, `@ControllerAdvice` 와 `@ExceptionHandler` 를 이용해서 Exception 처리를 할 수 있다. 

    전후 처리 로직에서 Exception을 global하게 처리하고 싶다면 interceptor를 사용하는 것이 나을 것 같음

- Interface의 차이

    당연하게도 위 2개의 interface는 다르다. view rendering(GNB)등을 처리하기 위해서는 interceptor를 사용

## References

- Exception Handling in Spring MVC 
([https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc](https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc))
