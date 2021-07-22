---
title: (Leetcode) 1. Two Sum
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---

### Description:  

Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
    
You may assume that each input would have exactly one solution, and you may not use the same element twice.  

You can return the answer in any order.

#### Example 1:  

~~~textmate
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Output: Because nums[0] + nums[1] == 9, we return [0, 1].
~~~

#### Example 2:  

~~~textmate
Input: nums = [3,2,4], target = 6
Output: [1,2]
~~~

#### Example 3:

~~~textmate
Input: nums = [3,3], target = 6
Output: [0,1]
~~~
  
#### Constraints

- 2 <= nums.length <= 104
- 109 <= nums[i] <= 109
- 109 <= target <= 109
- Only one valid answer exists.
- **Can you come up with an algorithm that is less than O(n2) time complexity?**

#### Code:
~~~java
class Solution {
    
    private static final int ANSWER_SIZE = 2;
    
    public int[] twoSum(int[] nums, int target) {
        int[] result = new int[ANSWER_SIZE];
		Map<Integer, Integer> map = new HashMap<>();
		for (int idx = 0; idx < nums.length; idx++) {
			if (map.containsKey(target - nums[idx])) {
                result[0] = map.get(target - nums[idx]);
                result[1] = idx;
			}
			map.put(nums[idx], idx);
		}
		return result;
    }
}
~~~
