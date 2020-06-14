---
title: (Leetcode) 704. Binary Search
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---

### Description:  

Given a **sorted (in ascending order)** integer array nums of n elements and a target value, write a function to search target in nums.  
  
If target exists, then return its index, otherwise return -1.

#### Example 1 :

```
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4
```

#### Example 2 :
```text
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1
```


#### Code:
~~~java
class Solution {
    
    public int search(int[] nums, int target) {
        
        int result = -1;
        
        // exception case
        if(nums.length == 0) {
            return result;
        }
        
        int left = 0;
        int right = nums.length - 1;
        int mid;
        
        while(left <= right) {
            
            mid = (left + right) / 2;
            int current = nums[mid];
            
            if(target == current) {
                result = mid;
                return result;
            }
            // 찾는 값이 현재 중앙값보다 작다면
            else if(target < current) {
                right = mid - 1;
            } 
            // 찾는 값이 현재 중앙값보다 크다면
            else {
                left = mid + 1;
            }
        }
        
        return result;
    }
}
~~~
