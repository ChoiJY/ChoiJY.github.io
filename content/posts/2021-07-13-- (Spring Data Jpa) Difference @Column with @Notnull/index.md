---
title: (Spring Data Jpa) @Column(nullable=false)와 @NotNull의 차이
category: "Spring"
cover: spring.png
author: Jun Young Choi
---

### Problem

Entity Class를 작성하면서, field값들에 대한 Validation check를 해야 할 필요가 있는데,  
이러한 경우 사용되는 `@Column`과 `@NotNull` 두 annotation에 대한 정확한 비교를 해 보자

둘 다 해당 field에 null값이 할당될 수 없게 하려는 것이 목적(공백 문자열 ''은 체크 대상이 아님)  
nullable은 명시적으로 ddl에 NOT NULL을 걸어준다.
Insert 기준 field에 null값을 넣을 경우

- `@Column(nullable=false)` DataIntegrityViolationException 발생 → insert/update이 일어나며 exception 발생 (ddl에 not null만 걸어줌)
- `@NotNull`ConstraintViolationException 발생 → insert/update 이전 Application단에서 실제 dml 수행 전 체크

### Conclusion

- 목적은 동일한 annotation이지만, 직접 DB에 access하기 전에 체크해주는 `@NotNull`을 사용하자

### Refernces

- Hibernate Tips: What’s the difference between @Column(nullable = false) and @NotNull ([https://thorben-janssen.com/hibernate-tips-whats-the-difference-between-column-nullable-false-and-notnull/](https://thorben-janssen.com/hibernate-tips-whats-the-difference-between-column-nullable-false-and-notnull/))
