---
title: (Java) Java Basic Study
category: "Java"
cover: java.png
author: Jun Young Choi
---

### Primitive Type

1. 몇 가지 Java Primitive Type의 이름을 제시하고, 해당 Type이 JVM에서 어떻게 처리될 지 설명하라
    
    boolean, int, double와 같은 Primitive type이 존재한다.  
    JVM은 해당 Type에 대해서 Object로 알려진 Reference Type과는 다른 방식으로 처리한다.  
    Primitive Type의 경우 항상 값이 존재해야하기 떄문이다(!=null) 
    
    아래 표는 Primitive Type의 종류와 크기를 나타낸 표이다.
    
    Type | Size
    -----|-----
    boolean | 1
    short | 16
    int | 32
    long | 64
    float | 32
    double | 64
    char | 16  
    
    char type의 경우에는 unsigned이다. char값의 범위는 unicode값이기 떄문에, 0-65535(2^16)까지 표현 가능하다.  
    원시 type을 정의할 때, 값이 할당되지 않았다면 해당 변수는 아래와 같이 default값으로 지정되게 된다.
    
    - Boolean : false
    - Other Type : 0 (int : 0, float: 0.0f)
    
    Compiler는 필요한 경우 Primitive Type을 적절한 Type으로 변경할 수 있다. (ex. int <-> Integer, int -> long)  
    상위 -> 하위 타입(ex. long -> int)으로 명시적 표현을 통해 변환이 가능하긴 하나 설계 시 적절한 타입을 지정하지 않았다는 경우이다.
    
2. 왜 Integer.MIN_VALUES에 대응하는 양수가 존재하지 않을까?

   short, int, long type의 binary 값 저장소는 memory에서 (-/+)가 나뉘지 않고 유일하게 0의 표현을 하기 위해서 2의 Complement(!= Mathematical)를 사용한다.  
   표현가능한 자리수가 정해져 있기 떄문에 MIN_VALUES의 범위를 넘는 Integer를 사용할 경우, overflow가 발생하게 된다.
   



    
    
