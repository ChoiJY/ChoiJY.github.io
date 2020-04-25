---
title: (Leetcode) 912. Sort an array 
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---

### Description  

Given an array of integers `nums`, sort the array in ascending order.

### Note  

1. 1 <= A.length <= 10000
2. -50000 <= A[i] <= 50000

### Code  

~~~Javascript
let sortArray = (nums) => {
    nums.sort((e1, e2) => {
        if( isNaN(e1 - e2) ) 
            throw Error("Argument type is wrong.");
        return e1 - e2;
    });
    return nums;
};
~~~

### Another Solve Strategy

1. 성능과 상관없다면, 처음 생각한건 `map()`으로 직접 Sorting을 구현 (like. bubble sort, quick sort...)
