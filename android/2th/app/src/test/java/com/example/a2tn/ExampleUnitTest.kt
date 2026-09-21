package com.example.a2tn

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

    }
}
