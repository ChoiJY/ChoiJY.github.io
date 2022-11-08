---
title: (Test) TDD와 BDD의 간단한 소개와 차이점
category: "TDD"
cover: tdd.png
author: Jun Young Choi
---

TDD와 BDD, 누구나 다 중요하다고 생각하고 필요하다고 생각하는데 막상 이 둘의 개념이 정확히 무엇이고 둘 간의 차이가 어떤건지에 대해서는 명확하게 답할 수 없었다.

Kakao if에서 TDD와 BDD의 개념에 대해서 잘 설명해주고 둘 간의 차이점이 무엇인지, 어떤 부분에서 좋은 지에 대해 잘 설명해준 session을 보게 되어서 아래와 같이 정리하였다.

### TDD?

TDD란 test를 먼저 작성하고 나서, 이를 기반으로 실제 product의 code를 작성해 나가는 개발 방식이라고 할 수 있다. 흔히들 test code를 작성하고 있다면 나는 TDD를 적용해서 개발하고 있다 라는 생각을 하기 쉬운데 아래와 같이 정리할 수 있다.

- Test를 한다 ≠ TDD
- Test code를 기반으로 실제 product code를 작성한다 == TDD

**TDD의 장점**

testable한 코드를 작성할 수 있음, testable하게 코드를 짠다는건 필연적으로 module의 크기와 응집도를 최소화하는 과정을 거치게 되는데 이러한 과정을 통해서 좀 더 잘 만든 code를 작성할 수 있다.

대부분의 개발자들이 TDD의 중요성은 너무나도 잘 알고 있지만, 막상 프로젝트에 적용하려고 한다면 비용이 생각 외로 많이 크다.(test 유지보수 및 작성에 드는 시간) 하지만 잘 작성된 TDD 프로젝트를 본다면 다르지 않을까?

### BDD?

BDD는 TDD에서 파생된 개발 방법으로, 개발자와 비개발자간의 협업 과정을 녹여낸 방법이라고 할 수 있다. 그렇기 때문에 기획서 기반으로 사용자의 행위를 작성하고 결과를 검증하는 과정으로 이루어진다.

잘 정리된 기획서가 있다면 흔히 아래와 같은 scenario가 있을거고 흔히 기획서를 기반으로 Given/When/Then을 이용해서 code로 직접 녹여내게 된다. 잘 만든 BDD 기반의 프로젝트는 그 자체가 훌륭한 기획서가 될 수도 있을 것 같다.

```textmate
상품 등록 시나리오

- 등록 필수 조건 (Given)
	- 정상적으로 로그인 한 판매자가 상품 등록 페이지에 접근.
	- 판매자는 관리자로부터 인증받아야만 한다.
- 입력 사항 (When)
	- 판매자는 등록할 상품의 사진을 input에 등록한다.
	- 판매자는 등록할 상품의 가격, 기본 정보를 input, textarea에 등록한다.
- 기대 결과 (Then)
	- 사진, 가격, 기본 정보가 모두 올바른 경우 상품이 정상적으로 등록되고, main page로 redirect.
```

**BDD의 장점**

TDD의 경우 기획이 변경되어 설계를 변경해야 하는 경우, 아래 그림의 기획 → 설계 → 코드 작성까지 모두 이루어진 상태기 때문에 많은 부분이 변경되어야 한다. (비용이 큼)

하지만 BDD의 경우 아래와 같이 실제 product의 code를 생산하기 전인 설계 단계에서 대응이 가능하기 때문에 수정 시 비용이 적게 드는 장점을 가지고 있다.

![BDD의 장점](https://velog.velcdn.com/images/silmxmail/post/b90844e4-7bdb-42fd-b926-3de2ce6eb9f8/image.png)

### TDD와 BDD의 차이점

TDD와 BDD 모두 특정 scenario에 대한 검증을 한다는 점에서는 공통점을 지닌다. 하지만 이 둘은 아래와 같은 차이를 가지고 있다.

![TDD와 BDD 차이점](https://velog.velcdn.com/images/ecvheo1/post/530d81f8-61b4-4a7d-9b97-e7c874222514/image.png)

### References

- kotest가 있다면 TDD 묻고 BDD로 가! ([https://tv.kakao.com/v/414004682](https://tv.kakao.com/v/414004682))
