---
title: (Leetcode) 442. Find All Duplicates in an Array 
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---

### Description  

Given an array of integers, `1 ≤ a[i] ≤ n (n = size of array)`, some elements appear twice and others appear once.

Find all the elements that appear `twice` in this array.

Could you do it without extra space and in `O(n)` runtime?

### Code  

~~~Javascript
let findDuplicates = (nums) => {
    
    let reArrangeAry = new Array(nums.length);
    let result = [];
    
    nums.forEach((el, idx) => {
        if( isNaN(reArrangeAry[el - 1]) ) reArrangeAry[el - 1] = el;
        else result.push(el);
    });
    
    return result;
};
~~~

### Solve Strategy

1. 주어진 O(n) + without extra space에 맞게 코딩하는게 가장 까다로운 조건이라고 생각했다. without extra space + O(n)이 없었다면 그냥 `filter()`, `reduce()`만 가지고 쉽게 해결할 수 있었던 문제라고 생각한다.
