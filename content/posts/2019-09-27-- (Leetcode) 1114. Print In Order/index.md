---
title: (Leetcode) 1114. Print in Order 
category: "Algorithm"
cover: algorithm.jpg
author: Jun Young Choi
---

### Description

Suppose we have a class:
~~~java
public class Foo {
  public void first() { print("first"); }
  public void second() { print("second"); }
  public void third() { print("third"); }
}
~~~
The same instance of Foo will be passed to three different threads. Thread A will call first(), thread B will call second(), and thread C will call third(). Design a mechanism and modify the program to ensure that second() is executed after first(), and third() is executed after second().

Example 1:
~~~java
Input: [1,2,3]
Output: "firstsecondthird"
Explanation: There are three threads being fired asynchronously. The input [1,2,3] means thread A calls first(), thread B calls second(), and thread C calls third(). "firstsecondthird" is the correct output.
~~~
Example 2:
~~~java
Input: [1,3,2]
Output: "firstsecondthird"
Explanation: The input [1,3,2] means thread A calls first(), thread B calls third(), and thread C calls second(). "firstsecondthird" is the correct output.
~~~

Note:

We do not know how the threads will be scheduled in the operating system, even though the numbers in the input seems to imply the ordering. The input format you see is mainly to ensure our tests' comprehensiveness.

### Code
~~~java
class Foo {

    Semaphore r2, r3;
    Integer limit = 0;
    
    public Foo() {
        r2 = new Semaphore(limit);
        r3 = new Semaphore(limit);
    }

    public void first(Runnable printFirst) throws InterruptedException {
        
        printFirst.run();
        r2.release();
    }

    public void second(Runnable printSecond) throws InterruptedException {
        
        r2.acquire();
        printSecond.run();
        r3.release();
    }

    public void third(Runnable printThird) throws InterruptedException {
        
        r3.acquire();
        printThird.run();
    }
}
~~~

### Solve Stratgedy

1. 차라리 직접 main class 부터 내가 설계 할 수 있게 judge system이 변했으면 다양한 시도를 할 수 있을 것 같다.

2. Semaphore을 이용해서 자원이 반납 되었을 때 method를 실행 시키게 하는 방법을 선택

