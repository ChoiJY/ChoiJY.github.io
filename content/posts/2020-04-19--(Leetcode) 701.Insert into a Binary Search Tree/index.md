---
title: (Leetcode) 701. Insert into a Binary Search Tree 
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---

### Description:  

Given the root node of a binary search tree (BST) and a value to be inserted into the tree, insert the value into the BST. Return the root node of the BST after the insertion. It is guaranteed that the new value does not exist in the original BST.

Note that there may exist multiple valid ways for the insertion, as long as the tree remains a BST after insertion. You can return any of them.

#### Example:  

~~~bash
Given the tree:

        4
       / \
      2   7
     / \
    1   3

And the value to insert: 5
~~~

~~~bash
You can return this binary search tree:

         4
       /   \
      2     7
     / \   /
    1   3 5
~~~

~~~bash  
This tree is also valid:

         5
       /   \
      2     7
     / \   
    1   3
         \
          4
~~~

#### Code
~~~java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public TreeNode insertIntoBST(TreeNode root, int val) {
        
        if(root == null) {
            return new TreeNode(val);
        }
        
        TreeNode currentNode = root;
        
        while(true) {
            if(currentNode.val < val) {
                if(currentNode.right != null) {
                    currentNode = currentNode.right;
                }
                else{
                    currentNode.right = new TreeNode(val);
                    break;
                }
            }else {
                if(currentNode.left != null){
                    currentNode = currentNode.left;
                }
                else{
                    currentNode.left = new TreeNode(val);
                    break;
                }
            }
        }
        
        return root;
    }
}
~~~
