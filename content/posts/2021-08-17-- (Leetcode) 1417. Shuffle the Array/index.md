---
title: (Leetcode) 1417. Shuffle the Array
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---

### Description:  

Given the array nums consisting of `2n` elements in the form `[x1,x2,...,xn,y1,y2,...,yn]`.

Return the array in the form `[x1,y1,x2,y2,...,xn,yn]`.

#### Example 1:  

~~~textmate
Input: nums = [2,5,1,3,4,7], n = 3
Output: [2,3,5,4,1,7] 
Explanation: Since x1=2, x2=5, x3=1, y1=3, y2=4, y3=7 then the answer is [2,3,5,4,1,7].
~~~

#### Example 2:  

~~~textmate
Input: nums = [1,2,3,4,4,3,2,1], n = 4
Output: [1,4,2,3,3,2,4,1]
~~~
  
#### Example 3:

~~~textmate
Input: nums = [1,1,2,2], n = 2
Output: [1,2,1,2]
~~~
#### Constraints

- `1 <= n <= 500`
- `nums.length == 2n`
- `1 <= nums[i] <= 10^3`


#### Code:
~~~java
class Solution {
    public int[] shuffle(int[] nums, int n) {
        int[] result = new int[n * 2];
		// array는 무조건 반으로 나눠짐
		for (int idx = 0; idx < n; idx++) {
			result[idx * 2] = nums[idx];
		}
		int jdx = 1;
		for (int idx = n; idx < nums.length; idx++, jdx++) {
			result[jdx * 2 - 1] = nums[idx];
		}
		return result;
    }
}
~~~
