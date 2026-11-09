package com.example.a10th_4

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {

    lateinit var textHistory: TextView
    lateinit var textResult: TextView

    var history = ""   // 입력한 순서
    var input = ""     // 지금 입력하는 숫자
    var result = 0.0   // 계산 결과
    var op = ""        // 연산자

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        textHistory = findViewById(R.id.textHistory)
        textResult = findViewById(R.id.textResult)
    }

    // 숫자 버튼
    fun onNum(v: View) {
        val btn = v as Button
        input = input + btn.text
        textResult.text = input
    }

    // + - × ÷ 버튼
    fun onOp(v: View) {
        if (input == "") return

        calc()
        val btn = v as Button
        op = btn.text.toString()
        history = history + input + " " + op + " "
        input = ""

        textHistory.text = history
        textResult.text = show(result)
    }

    // = 버튼
    fun onEqual(v: View) {
        if (input == "" || op == "") return

        calc()
        history = history + input + " ="
        textHistory.text = history
        textResult.text = show(result)

        history = ""
        input = ""
        op = ""
    }

    // C 버튼 (전부 지우기)
    fun onClear(v: View) {
        history = ""
        input = ""
        result = 0.0
        op = ""
        textHistory.text = ""
        textResult.text = "0"
    }

    // 계산하기
    fun calc() {
        val num = input.toDouble()
        if (op == "+") {
            result = result + num
        } else if (op == "-") {
            result = result - num
        } else if (op == "×") {
            result = result * num
        } else if (op == "÷") {
            result = result / num
        } else {
            result = num
        }
    }

    // 정수면 .0 빼고 보여주기
    fun show(num: Double): String {
        if (num % 1 == 0.0) {
            return num.toInt().toString()
        }
        return num.toString()
    }
}
