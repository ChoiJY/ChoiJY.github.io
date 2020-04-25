---
title: (Kotlin) Kotlin Basic Syntax Study 
category: "Kotlin"
cover: kotlin.jpg
author: Jun Young Choi
---

### Define Variables

- var / val  

    ES6의 let/const와 유사한 느낌이나, Type checking 역시 존재  
    변수의 타입을 명시적으로 선언하지 않았을 경우에는 compile 당시에 추론되어짐  
    사용 예는 아래와 같다.  

    ~~~kotlin
    // var
    var intVar = 3 // Int type inferred when compile time
    var intVar2 : Int = 4 // immediate assignment

    // val
    val intVal = 3
    val stringVal : String = "sds"
    ~~~

- Types

    - Numbers 

        코틀린이 Numbers를 다루는건 java랑 유사하지만 다른 부분도 있다.  
        타입은 아래와 같다.  

        Type | Bit width(Byte)
        ---- | ----
        Double	| 64(8)
        Float | 32(4)
        Long | 64(8)
        Int	| 32(4)
        Short | 16(2)
        Byte | 8(1)  

        - _를 활용해서 Numeric value 표기를 쉽게 할 수도 있다.

            ~~~kotlin
            var intType : Int = 1_000_000
            var bytes = 0b11010100_01111110
            var hexByte = 0xFF_EC_AB_1E  // Octal is not supported in kotlin
            ~~~
    
        - Boxing
            
            kotlin의 경우 java랑 다르게 nullable이랑 generics가 포함돼서 이러한 경우에 numbers는 boxed된다

            **box된 Number의 경우 비교시 동일하지 않을 수 있다**

        - Explicit conversions

            Represention이 다르기 떄문에 smaller type -> bigger type이 불가능함(ex. byte -> int) 이런 경우에는 명시적으로 변환 필요

            ~~~kotlin
            val a : Byte = 1
            var conv : Int = a.toInt()
            ~~~

        - Floating type comparison

            아래와 같이 세줄 요약

            - NaN is considered equal to itself
            - NaN is considered greater than any other element including POSITIVE_INFINITY
            - 0.0 is considered less than 0.0

    - Characters, Booleans 

        Java/js와 비교했을 때 큰 차이점이 없음, boolean의 경우 boxing된 변수 참조 시 boxing된다는 거 정도가 특이점

    - Arrays

        Array를 만드는 방법은 아래와 같이 3가지가 존재  
        
        - arrayOf()  
        - arrayOfNulls()  
        - constructor  

        ~~~kotlin
        val asc = Array(5) { i -> (i * i).toString() }
        asc.forEach { println(it) }
        
        val ary2 = arrayOf(1,2,3)
        ary2.forEach{ println(it) }
        
        var ary3 = arrayOfNulls<Int>(4)
        ary3.forEach{ println(it) } // null null null null
        ~~~

        - Primitive type array

            Boxing overhead를 줄이기 위해서 제공,  
            {type}Array, {type}ArrayOf, {type}ArrayOfNulls와 같이 사용가능


    - Unsigned Integers

        Not stable, 아래와 같은 두 가지 방법이 있음

        - **to propagate experimentality**, either annotate declarations which use unsigned integers with @ExperimentalUnsignedTypes or pass -Xexperimental=kotlin.ExperimentalUnsignedTypes to the compiler (note that the latter will make all declaration in compiled module experimental)

        - **to opt-in without propagating experimentality**, either annotate declarations with @UseExperimental(ExperimentalUnsignedTypes::class) or pass -Xuse-experimental=kotlin.ExperimentalUnsignedTypes

    - String Literals / String templates

        ES6와 유사하게 아래와 같이 사용 가능

        ~~~kotlin
        val text = "blahblahblah\nhehehehe"

        val text2 = """
                    blahblahblah
                    hehehehe
                    """                 // escaping char x

        val text3 = """
                    |blahblahblah
                    |hehehehe
                    """.trimMargin()    // to remove leading whitespace 


        val a = 1
        println("a is a ${a}")

        val str = "abcd"
        println("$str is a ${str.length}")
        ~~~

### Define Packages

- Packages

    Package declaration이 없을 경우, default로 지정됨(no name)

- Default Imports

    아래와 같은 packages는 모든 .kt 파일에 default로 들어감
    - kotlin.*
    - kotlin.annotation.*
    - kotlin.collections.*
    - kotlin.comparisons.* (>= 1.1)
    - kotlin.io.*
    - kotlin.ranges.*
    - kotlin.sequences.*
    - kotlin.text.*

        JVM의 경우
        - java.lang.*
        - kotlin.jvm.*

        JS의 경우
        - kotlin.js.*

- Imports

    import static이 없고, Alias (as) 이외에도 아래의 특징이 있다

    - top-level functions and properties
    - functions and properties declared in object declarations
    - enum constants

- Visable Modifiers

### Define Functions
함수의 경우에는, `fun` keyword 사용
