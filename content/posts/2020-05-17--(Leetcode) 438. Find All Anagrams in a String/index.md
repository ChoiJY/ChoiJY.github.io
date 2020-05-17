---
title: (Leetcode) 438. Find All Anagrams in a String 
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---


### Description:
Given a string s and a non-empty string p, find all the start indices of p's anagrams in s.

Strings consists of lowercase English letters only and the length of both strings s and p will not be larger than 20,100.

The order of output does not matter.

#### Example:
~~~
Input:
s: "cbaebabacd" p: "abc"

Output:
[0, 6]

Explanation:
The substring with start index = 0 is "cba", which is an anagram of "abc".
The substring with start index = 6 is "bac", which is an anagram of "abc".
~~~

#### Example2:
~~~
Input:
s: "abab" p: "ab"

Output:
[0, 1, 2]

Explanation:
The substring with start index = 0 is "ab", which is an anagram of "ab".
The substring with start index = 1 is "ba", which is an anagram of "ab".
The substring with start index = 2 is "ab", which is an anagram of "ab".
~~~

#### Code:
~~~java
public List<Integer> findAnagrams(String s, String p) {

        List<Integer> list = new ArrayList<>();
        int[] hash = new int[256];
        
        if (s == null || s.length() == 0 || p == null || p.length() == 0) return list;

        for (char c : p.toCharArray()) {
            hash[c]++;
        }
        
        int left = 0, right = 0, count = p.length();
        while (right < s.length()) {
            if (hash[s.charAt(right++)]-- >= 1) count--;
            if (count == 0) list.add(left);
            if (right - left == p.length() && hash[s.charAt(left++)]++ >= 0) count++;
        }
        return list;
    }
~~~

### References:
https://discuss.leetcode.com/topic/30941/here-is-a-10-line-template-that-can-solve-most-substring-problems
