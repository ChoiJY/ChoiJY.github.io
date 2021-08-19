---
title: (Leetcode) 177. Nth Highest Salary
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---

### Description:  

Write a SQL query to get the nth highest salary from the Employee table.

```textmate
+----+--------+
| Id | Salary |
+----+--------+
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |
+----+--------+
```

For example, given the above Employee table, the nth highest salary where n = 2 is 200. If there is no nth highest salary, then the query should return null.

```textmate
+------------------------+
| getNthHighestSalary(2) |
+------------------------+
| 200                    |
+------------------------+
```  


#### Code:
~~~sql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  DECLARE EMP_INDEX INT;
  SET EMP_INDEX = N - 1;
  RETURN (
      # Write your MySQL query statement below.
      IFNULL((
          SELECT DISTINCT Salary
          FROM Employee
          ORDER BY Salary DESC
          LIMIT EMP_INDEX, 1)
      , NULL)
  );
END
~~~
