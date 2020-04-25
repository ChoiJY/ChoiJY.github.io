---
title: (Leetcode) 627. Swap Salary 
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---

### Description

Given a table salary, such as the one below, that has m=male and f=female values. Swap all f and m values (i.e., change all f values to m and vice versa) with a single update statement and no intermediate temp table.

Note that you must write a single update statement, DO NOT write any select statement for this problem.

Schema:
~~~sql
create table if not exists salary(id int, name varchar(100), sex char(1), salary int)
Truncate table salary
insert into salary (id, name, sex, salary) values ('1', 'A', 'm', '2500')
insert into salary (id, name, sex, salary) values ('2', 'B', 'f', '1500')
insert into salary (id, name, sex, salary) values ('3', 'C', 'm', '5500')
insert into salary (id, name, sex, salary) values ('4', 'D', 'f', '500')
~~~
Example:
~~~sql
| id | name | sex | salary |
|----|------|-----|--------|
| 1  | A    | m   | 2500   |
| 2  | B    | f   | 1500   |
| 3  | C    | m   | 5500   |
| 4  | D    | f   | 500    |
~~~

After running your update statement, the above salary table should have the following rows:

~~~sql
| id | name | sex | salary |
|----|------|-----|--------|
| 1  | A    | f   | 2500   |
| 2  | B    | m   | 1500   |
| 3  | C    | f   | 5500   |
| 4  | D    | m   | 500    |
~~~

### Code

~~~sql

UPDATE salary
SET sex = 
        CASE 
            WHEN sex = "f"
            THEN "m"
            WHEN sex = "m"
            THEN "f"
        END;

~~~

### Solve Stratgedy

1. 단순한 table update 문제

    ~~~sql
    select 
        id,
        name,
        case 
            when sex = "f"
            then "m"
            when sex = "m"
            then "f"
        end as sex,
        salary
    from salary
    ~~~

    하지만 문제는 query result를 원하는 것이 아니라, table 자체에서 update가 되길 원하는 문제 (+ 간단하게 분기 처리 할 줄 아냐)
    
    그렇기 때문에 위 쿼리를 `run code` 아무리 해봐도 원래 salary table 그 자체만 나오는 현상을 겪을 수 있었다. 서버가 잘못된 줄 알고 Discussion 탭을 눌렀는데 동일한 현상을 겪었다는 사람들을 많이 볼 수 있었다.
    
    결론 -> 문제를 제대로 읽자
