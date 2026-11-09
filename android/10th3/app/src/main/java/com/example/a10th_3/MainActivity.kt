package com.example.a10th_3

import android.os.Bundle
import android.os.LocaleList
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import java.util.Locale

class MainActivity : AppCompatActivity() {

    lateinit var editObjs: List<EditText>  // 이름·비밀번호·이메일·생년월일·연락처 객체변수
    lateinit var resultObj: TextView       // 결과 출력 텍스트뷰 객체변수
    val labels = listOf("이름", "비밀번호", "이메일", "생년월일", "연락처")

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
        editObjs = listOf(R.id.editName, R.id.editPw, R.id.editEmail, R.id.editBirth, R.id.editPhone).map { findViewById(it) }
        resultObj = findViewById(R.id.textResult)
        val imgObj = findViewById<ImageView>(R.id.imgCat)

        // 성명 입력 시 한국어 키보드 우선
        editObjs[0].imeHintLocales = LocaleList(Locale.KOREA)

        // 이미지 넘기기: 버튼 누를 때마다 다음 이미지, 마지막이면 처음으로
        val cats = arrayOf(R.drawable.cat, R.drawable.cat2, R.drawable.cat3, R.drawable.cat4, R.drawable.cat5)
        var idx = 0
        findViewById<Button>(R.id.btnCat).setOnClickListener {
            idx = (idx + 1) % cats.size
            imgObj.setImageResource(cats[idx])
        }
    }

    // 버튼클릭 시 입력 값 출력 (빈 칸 있으면 안내)
    fun onButton(v: View) {
        if (editObjs.any { it.text.isEmpty() }) {
            resultObj.text = "모든 항목을 입력하세요"
        } else {
            resultObj.text = labels.indices.joinToString("\n") { "${labels[it]}: ${editObjs[it].text}" }
        }
    }
}
