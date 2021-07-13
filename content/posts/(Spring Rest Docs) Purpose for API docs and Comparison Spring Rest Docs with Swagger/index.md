---
title: (Spring Rest Docs) Purpose for API docs and Comparison Spring Rest Docs with Swagger
category: "Spring"
cover: spring.png
author: Jun Young Choi
---
### Purpose for API doc

서비스 운영, 개발 환경에서 API spec이 바뀌거나 하는 경우가 생기는데, 실제 API와 Docs 상의 차이가 발생하는 경우가 있어 혼선을 겪는 경우가 존재

API 문서를 수기로 작성하는 것이 아닌 자동화 하여 제공하게 된다면 좀 더 효율적인 업무 진행이 가능

### Spring Rest Docs?

Asciidoctor를 사용하여 HTML를 생성, Spring MVC test framework로 생성된 snippet을 이용해서 올바르지 않은 경우 생성된 test가 실패하고 정확성을 보장해줌

### Spring Rest Docs vs Swagger

Spring Rest Docs  
- Test가 성공해야 Doc이 작성됨 (좀 더 확실한 API 문서 제공 가능)
- 실제 Code에 영향이 없다
- Swagger에 비해 적용하기 어렵다  

Swagger  
- 상대적으로 적용하기 쉽다.
- API를 테스트 해 볼 수 있는 화면을 제공
- 실제 Code 내에 annotation을 적용해야 함
- 실제 Code와 동기화가 안 맞는 경우가 생김 (비즈니스 로직이 변경돼도 실제 문서는 갱신되지 않음, 정상적인 Response에 대한 specification일 뿐, 다른 status code에 대해서 정의가 힘듦)

### Conclusion

Swagger의 경우, API 동작을 테스트 해보는 경우에 사용하는 측면에 특화, Spring Rest Docs은 진짜 말 그대로 API specification 생성에 특화

### References

- Spring REST Docs  
  ([https://cheese10yun.github.io/spring-rest-docs/](https://cheese10yun.github.io/spring-rest-docs/))

- Spring Rest Docs 적용 | 우아한형제들 기술블로그  
  ([https://techblog.woowahan.com/2597/](https://techblog.woowahan.com/2597/))
