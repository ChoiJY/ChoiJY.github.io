---
title: (Leetcode) 69. Sqrt(x) 
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---

### Description
Implement int sqrt(int x).

Compute and return the square root of x, where x is guaranteed to be a non-negative integer.

Since the return type is an integer, the decimal digits are truncated and only the integer part of the result is returned.

Example 1:
~~~javascript
Input: 4
Output: 2
~~~
Example 2:
~~~javascript
Input: 8
Output: 2
//Explanation: The square root of 8 is 2.82842..., and since 
//             the decimal part is truncated, 2 is returned.
~~~
### Code
~~~javascript
let mySqrt = (x) => {
    
    let result = 0;
    
    while(result <= x){
        let tempValue = result * result;
        
        if(tempValue < x) {
            result += 1;
        }
        else {
            if(tempValue !== x) result -= 1;
            break;
        }
    }
    
    // truncate decimal digits
    return Math.floor(result);
};
~~~
### Solve Stratgedy
1. 자연스럽게 input이 0인 경우를 생각하지 못해서 오답을 제출했었다.
2. 쉬운 문제라고 쉽게 생각하지 말고 경우의 수를 끝까지 생각해볼 것
3. bf로 풀었었는데 사실 bst가 최적
~~~javascript
r = x;
while (r*r > x)
    r = ((r + x/r) / 2) | 0;
return r;
~~~
