package com.example.a2tn

import android.util.Log
import androidx.core.graphics.component4
import org.junit.Test
import org.junit.Assert.*

/**
 * Example local unit test, which will execute on the development machine (host).
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
class ExampleUnitTest {
    @Test
    fun addition_isCorrect() {
        assertEquals(4, 2 + 2)

        val myName = "조성민"
        val age: Int = 27

        println("코틀린: 불변 변수 val 나의 이름은 $myName, 나의 나이 : $age")
        /*시험에 나올 수 있음 */
        var numOne = 1                
        var numTwo = 3000000000
        var myByte : Byte = 1 
        var myInt : Int = 20
        var myLong = 25L

        println("numone : $numOne\n numtwo : $numTwo\n mybyte : $myByte\n mtint : $myInt\n mylong $myLong\n")

        var myFloat: Float = 30.2F
        var myDouble: Double = 35.4

        println("코틀린 : 실수 자료형, Float : $myFloat")
        println("코틀린 : 실수 자료형, Double : $myDouble")

        var myBoolean : Boolean = true
        println("코틀린 : 부울린 자료형, Boolean : $myBoolean\n")

        var myChar1: Char = 'K'
        var myChar2: Char = 'o'
        var myChar3: Char = 't'
        var myChar4: Char = 'l'
        var myChar5: Char = 'i'
        var myChar6: Char = 'n'

        println("코틀린 : 문자 자료형, Char : $myChar1$myChar2$myChar3$myChar4$myChar5$myChar6\n")


        var myString1 : String = "Kotlin\n"
        var myString2 : String = "Java"

        println("String : $myString1")
        println("String : $myString2")

        var myArray : IntArray = intArrayOf(1,2,3,4,5)
        println("배열의3번째 값 : " + myArray[2])

        var myX: Int = 100
        var myY: Float = myX.toFloat()

        println("코틀린 : 자료형 변환 Int : $myX")
        println("코틀린 : 자료형 변환 Float : $myY")


        var x : Int = 5
        var y : Int = 10
        println("코틀린 : 산술 연산자 x + y = " + (x+y))
        println("코틀린 : 산술 연산자 x - y = " + (x-y))
        println("코틀린 : 산술 연산자 x / y = " + (x/y))
        println("코틀린 : 산술 연산자 x * y = " + (x*y))
        println("코틀린 : 산술 연산자 x % y = " + (x%y))
        println("코틀린 : 비교 연산자 x > y = " + (x>y))
        println("코틀린 : 비교 연산자 x < y = " + (x<y))

        println("코틀린 : 비교 연산자 x >= y = " + (x>=y))
        println("코틀린 : 비교 연산자 x <= y = " + (x<=y))
        println("코틀린 : 비교 연산자 x == y = " + (x==y))
        println("코틀린 : 비교 연산자 x != y = " + (x!=y))
        y+= x
        println("코틀린 : 할당 연산자 x += y => y =" + (y))
        y-=x
        println("코틀린 : 할당 연산자 x -= y =>  y = " + (y))
        y*=x
        println("코틀린 : 할당 연산자 x *= y =>  y = " + (y))
        y/=x
        println("코틀린 : 할당 연산자 x /= y =>  y = " + (y))
        y%=x
        println("코틀린 : 할당 연산자 x %= y =>  y = " + (y))

        println("코틀린 : 증감 연산자 ++x = = " + (++x))

        println("코틀린 : 증감 연산자 --x = = " + (--x))

        var num: Int = 10
        if (num % 2 == 0) {
            println("코틀린 : if-else 조건문 숫자 $num 은 짝수")
        } else {
            println("코틀린 : if-else 조건문 숫자 $num 은 홀수")
        }

        var num1: Int = -10
        var result: String

        if (num1 > 0) {
            result = "숫자" + num1 + "은 양수"
        } else if (num1 == 0) {
            result = "숫자" + num1 + "은 0"
        } else {
            result = "숫자" + num1 + "은 음수"
        }

        println("코틀린 : if-else if 조건문 $result")

        var num2: Int = 10
        var result1: String

        if (num2 > 0){
            if(num2 % 2 ==0 ){
                result1 = "숫자" + num2 + "은 양수이고 짝수"
            }else{
                result1 = "숫자" + num2 + "은 양수이고 홀수"
            }
        }else{
            if (num2 % 2==0){
                result1 = "숫자" + num2 + "은 음수이고 짝수"
            } else {
                result1 = "숫자" + num2 + "은 음수이고 홀수"
            }
        }
        println("코틀린 : 중첩 if 조건문 $result1")

        var day : Int = 2
        var result2 : String
        when (day) {
            1 -> result2 = "Monday"
            2 -> result2 = "Tuesday"
            3 -> result2 = "Wednesday"
            4 -> result2 = "Thursday"
            5 -> result2 = "Friday"
            6 -> result2 = "Saturday"
            7 -> result2 = "Sunday"
            else -> result2 = "Invalid day"
        }
        println("코틀린 : when 조건문 $result2")

        for(i in 5 downTo 1 ){
            println("코틀린 : for 반복문 반복변수 : $i")
        }
        for(i in 5 downTo 1 step 2){
            println("코틀린 : for 반복문 반복변수 : $i")
        }
        var numbers = arrayOf(1,2,3,4,5)
        for (i in numbers){
            if (i % 2 == 1){
                println("코틀린 : for 반복문 반복변수 : $i")
            }
        }

        var score: Int = 80
        var attendance: Int = 90
        var result3: String

        if (attendance < 80) {
            result3 = "F학점 - 출석률 미달"
        } else if (score >= 95 && attendance >= 80) {
            result3 = "A+학점 - 장학생 선발 대상"
        } else if (score >= 90 && attendance >= 80) {
            result3 = "A학점"
        } else if (score >= 80 && attendance >= 80) {
            result3 = "B학점"
        } else if (score >= 70 && attendance >= 80) {
            result3 = "C학점"
        } else {
            result3 = "F학점"
        }

        println("점수: $score")
        println("출석률: $attendance%")
        println("결과: $result3")

    }

}
