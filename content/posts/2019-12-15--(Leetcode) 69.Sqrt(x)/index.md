---
title: (Leetcode) 69.Sqrt(x) 
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---

### Description:  

There are n people whose IDs go from 0 to n - 1 and each person belongs exactly to one group. Given the array groupSizes of length n telling the group size each person belongs to, return the groups there are and the people's IDs each group includes.

You can return any solution in any order and the same applies for IDs. Also, it is guaranteed that there exists at least one solution. 

#### Example 1:
~~~bash
Input: groupSizes = [3,3,3,3,3,1,3]
Output: [[5],[0,1,2],[3,4,6]]
Explanation: 
Other possible solutions are [[2,1,6],[5],[0,4,3]] and [[5],[0,6,2],[4,3,1]].
~~~

#### Example 2:
~~~bash
Input: groupSizes = [2,1,3,3,3,2]
Output: [[1],[0,5],[2,3,4]]
~~~

#### Constraints:  
- groupSizes.length == n
- 1 <= n <= 500
- 1 <= groupSizes[i] <= n

### Code:  
~~~javascript
let groupThePeople = (groupSizes)=>{
    
    let totalPeople = groupSizes.length;
    let result = [];
    
    let tempResult = [];
    let tempList = [];
    
    let countList = [];
    let tempCountList = [];
    
    for(let idx=0; idx<totalPeople; idx+=1){
        if (!tempList.includes(groupSizes[idx])){
            tempCountList[groupSizes[idx]] = 1;
            countList[groupSizes[idx]] = groupSizes[idx];
            tempResult[groupSizes[idx]] = [];
        }
    }
    
    // traditional loop
    for(let idx=0; idx<totalPeople; idx+=1){
        
        let now = groupSizes[idx];
        
        tempResult[now].push(idx);
        
        if (now === 1) {
            result.push(tempResult[now]);
            tempResult[now] = [];
        } else{
            if(countList[now] === tempCountList[now]){
                tempCountList[now] = 1;
                result.push(tempResult[now]);
                tempResult[now] = [];
            } else{
                tempCountList[now] += 1;
            }
        }
    }
    return result;
};
~~~

