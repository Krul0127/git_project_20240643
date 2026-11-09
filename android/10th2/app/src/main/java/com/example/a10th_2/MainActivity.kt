package com.example.a10th_2

import android.graphics.Color
import android.os.Bundle
import android.view.MotionEvent
import android.widget.Button
import android.widget.ImageView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val imgObj = findViewById<ImageView>(R.id.imgCat)  // 이미지 객체변수
        val btnObj = findViewById<Button>(R.id.btnCat)     // 버튼 객체변수

        // 버튼 상태에 따라 이미지·버튼색·버튼이름 변경
        btnObj.setOnTouchListener { v, e ->
            if (e.action == MotionEvent.ACTION_DOWN) {          // 누른상태
                imgObj.setImageResource(R.drawable.cat3); v.setBackgroundColor(Color.RED)
                btnObj.text = "누른상태"
            } else if (e.action == MotionEvent.ACTION_UP) {     // 선택된상태 <-> 기본상태
                v.isSelected = !v.isSelected
                imgObj.setImageResource(if (v.isSelected) R.drawable.cat2 else R.drawable.cat)
                v.setBackgroundColor(if (v.isSelected) Color.BLUE else Color.GRAY)
                btnObj.text = if (v.isSelected) "선택된상태" else "기본상태"
            }
            false
        }
    }
}
