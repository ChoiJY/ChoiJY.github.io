---
title: (Leetcode Challenge) Power Of Two 
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---


### Description:
Given an integer, write a function to determine if it is a power of two.

#### Example:
~~~
Input: 1
Output: true 
Explanation: 20 = 1
~~~

#### Example2:
~~~
Input: 16
Output: true
Explanation: 24 = 16
~~~

#### Example3:
~~~
Input: 218
Output: false
~~~  

#### Code:
~~~java
class Solution {
    public boolean isPowerOfTwo(int n) {
     
        boolean result = false;
        
        do {
            if (n == 1) {
                result = true;
                break;
            } else {
                if (n % 2 == 0) {
                    n = n / 2;
                } else {
                    break;
                }
            }
        } while (n >= 1);
        
        return result;
    }
}
~~~
