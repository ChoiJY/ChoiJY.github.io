---
title: (Spring Data JPA) Entity의 PK를 비즈니스 값으로 잡으면 안되는 이유
category: "Spring"
cover: spring.png
author: Jun Young Choi
---

### Problem

보통 Entity를 설계할 때 PK를 어떤걸로 잡을 지 고민하는 경우가 많다. 종종 비즈니스 로직 상의 unique key나 이러한 여러 key값을 조합하여 composite key를 생성해서 PK를 설정하는 경우를
볼 수 있었다.
하지만 아래 서술하게 될 이유들로 인해서 Entity의 PK를 비즈니스 value가 아니라 별도의 Long type의 auto_increment를 잡는 것이 좀 더 유리하다는 사실을 알게 되었다.

- FK를 맺을 때, 다른 table에서 composite key 전체를 들고 있거나, 중간 table을 별도로 만들어야 하는 상황이 발생
- index에 악영향을 끼침
- unique한 조건이 변경될 경우, PK 전체를 수정해야함

### Conclusion

- 주민등록번호나, composite key 같은 것은 PK가 아닌 unique key로 별도로 추가하는 것이 좀 더 좋은 설계라고 할 수 있을 것 같다.

### References

- 스프링 부트와 AWS로 혼자 구현하는 웹 서비스(이동욱 저)
