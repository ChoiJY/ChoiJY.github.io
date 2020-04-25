---
title: (Leetcode) 1329. Sort the Matrix Diagonally 
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---

### Description:  

Given a m * n matrix mat of integers, sort it diagonally in ascending order from the top-left to the bottom-right then return the sorted array.

#### Example 1:  

~~~bash
Input: mat = [[3,3,1,1],[2,2,1,2],[1,1,1,2]]
Output: [[1,1,1,1],[1,2,2,2],[1,2,3,3]]
~~~

#### Constraints:  

- m == mat.length
- n == mat[i].length
- 1 <= m, n <= 100
- 1 <= mat[i][j] <= 100

#### Code:  

~~~java
class Solution {
    public int[][] diagonalSort(int[][] mat) {

        int rowMax = mat.length;
        int colMax = mat[0].length;

        Map<Integer, PriorityQueue<Integer>> diagonalList = new HashMap<>();

        for (int row = 0; row < rowMax; row++) {
            for (int col = 0; col < colMax; col++) {
                diagonalList.putIfAbsent(row - col, new PriorityQueue<>());
                diagonalList.get(row - col).add(mat[row][col]);
            }
        }
        for (int row = 0; row < rowMax; row++) {
            for (int col = 0; col < colMax; col++) {
                mat[row][col] = diagonalList.get(row - col).poll();
            }
        }
        return mat;
    }
}
~~~
