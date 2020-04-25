---
title: (Leetcode) 620. Not Boring Movies 
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---

### Descrption

X city opened a new cinema, many people would like to go to this cinema. The cinema also gives out a poster indicating the movies’ ratings and descriptions.
Please write a SQL query to output movies with an odd numbered ID and a description that is not 'boring'. Order the result by rating.

For example, table cinema:
~~~sql
+---------+-----------+--------------+-----------+
|   id    | movie     |  description |  rating   |
+---------+-----------+--------------+-----------+
|   1     | War       |   great 3D   |   8.9     |
|   2     | Science   |   fiction    |   8.5     |
|   3     | irish     |   boring     |   6.2     |
|   4     | Ice song  |   Fantacy    |   8.6     |
|   5     | House card|   Interesting|   9.1     |
+---------+-----------+--------------+-----------+
~~~
For the example above, the output should be:
~~~sql
+---------+-----------+--------------+-----------+
|   id    | movie     |  description |  rating   |
+---------+-----------+--------------+-----------+
|   5     | House card|   Interesting|   9.1     |
|   1     | War       |   great 3D   |   8.9     |
+---------+-----------+--------------+-----------+
~~~  

### Code
~~~sql
SELECT
    id, 
    movie, 
    description, 
    rating
FROM
    cinema
WHERE
    MOD(id, 2) <> 0 AND description <> 'boring'
ORDER BY rating DESC;
~~~
### Solve Strategy
1. MOD 함수를 쓸 수 있는가 없는가를 묻는 문제
