---
title: (Leetcode Challenge) Sort Colors
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---

### Description:  

Given an array with n objects colored red, white or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white and blue.

Here, we will use the integers 0, 1, and 2 to represent the color red, white, and blue respectively.

Note: You are not suppose to use the library's sort function for this problem.

#### Example :

~~~
Input: [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]
~~~

#### Code:
~~~java
class Solution {
    
    private static final int RED = 0;
    private static final int WHITE = 1;
    private static final int BLUE = 2;
    
    public void sortColors(int[] nums) {
        // Arrays.sort(nums);
        int left = 0;
        int right = nums.length-1;
        
        for(int i=0; i<=right;) {
            if (nums[i] == RED && i > left ) {
                swap(nums, i, left++);
            } else if (nums[i] == BLUE && i < right)
                swap(nums, i, right--);
            else
                i++;
        }
    }

    private void swap(int[] target, int a, int b) {
        int temp = target[a];
        target[a] = target[b];
        target[b] = temp;
    }
}
~~~
