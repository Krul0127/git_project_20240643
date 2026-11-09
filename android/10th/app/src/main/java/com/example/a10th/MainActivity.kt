package com.example.a10th

import android.os.Bundle
import android.os.LocaleList
import android.view.View
import android.widget.EditText
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import java.util.Locale

class MainActivity : AppCompatActivity() {

    lateinit var nameObj: EditText    // 성명 객체변수
    lateinit var pwObj: EditText      // 비밀번호 객체변수
    lateinit var emailObj: EditText   // 이메일 객체변수
    lateinit var birthObj: EditText   // 생년월일 객체변수
    lateinit var phoneObj: EditText   // 연락처 객체변수
    lateinit var resultObj: TextView  // 결과 출력 텍스트뷰 객체변수

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // 위젯연결
        nameObj = findViewById(R.id.editName)
        pwObj = findViewById(R.id.editPw)
        emailObj = findViewById(R.id.editEmail)
        birthObj = findViewById(R.id.editBirth)
        phoneObj = findViewById(R.id.editPhone)
        resultObj = findViewById(R.id.textResult)

        // 성명 입력 시 한국어 키보드 우선
        nameObj.imeHintLocales = LocaleList(Locale.KOREA)
    }

    // 버튼클릭 시 입력 값 출력
    fun onButton(v: View) {
        if (v.id == R.id.btnResult) {
            if (nameObj.text.toString().isEmpty() ||
                pwObj.text.toString().isEmpty() ||
                emailObj.text.toString().isEmpty() ||
                birthObj.text.toString().isEmpty() ||
                phoneObj.text.toString().isEmpty()) {
                resultObj.text = "모든 항목을 입력하세요"
            } else {
                resultObj.text = "이름: ${nameObj.text}\n" +
                        "비밀번호: ${pwObj.text}\n" +
                        "이메일: ${emailObj.text}\n" +
                        "생년월일: ${birthObj.text}\n" +
                        "연락처: ${phoneObj.text}"
            }
        }
    }
}
