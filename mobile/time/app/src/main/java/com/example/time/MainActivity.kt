package com.example.time

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.ArrayAdapter
import androidx.appcompat.app.AppCompatActivity
import com.example.time.databinding.ActivityMainBinding
import java.util.Locale

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val handler = Handler(Looper.getMainLooper())

    private var running = false
    // Total elapsed time (ms) accumulated before the current run segment.
    private var elapsedBeforePause = 0L
    // Wall-clock time (ms) when the current run segment started.
    private var startTimestamp = 0L

    private var lastLapElapsed = 0L
    private val laps = mutableListOf<String>()
    private lateinit var lapAdapter: ArrayAdapter<String>

    private val tickRunnable = object : Runnable {
        override fun run() {
            binding.tvTime.text = formatTime(currentElapsed())
            handler.postDelayed(this, 10L)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        lapAdapter = ArrayAdapter(this, R.layout.item_lap, laps)
        binding.listLaps.adapter = lapAdapter

        binding.btnStartPause.setOnClickListener {
            if (running) pause() else start()
        }
        binding.btnReset.setOnClickListener { reset() }
        binding.btnLap.setOnClickListener { recordLap() }
    }

    private fun currentElapsed(): Long {
        return if (running) {
            elapsedBeforePause + (System.currentTimeMillis() - startTimestamp)
        } else {
            elapsedBeforePause
        }
    }

    private fun start() {
        running = true
        startTimestamp = System.currentTimeMillis()
        handler.post(tickRunnable)

        binding.btnStartPause.text = getString(R.string.pause)
        binding.btnStartPause.backgroundTintList =
            getColorStateList(R.color.accent_pause)
    }

    private fun pause() {
        running = false
        elapsedBeforePause = currentElapsed()
        handler.removeCallbacks(tickRunnable)

        binding.btnStartPause.text = getString(R.string.start)
        binding.btnStartPause.backgroundTintList =
            getColorStateList(R.color.primary)
    }

    private fun reset() {
        running = false
        handler.removeCallbacks(tickRunnable)
        elapsedBeforePause = 0L
        lastLapElapsed = 0L
        laps.clear()
        lapAdapter.notifyDataSetChanged()

        binding.tvTime.text = getString(R.string.default_time)
        binding.btnStartPause.text = getString(R.string.start)
        binding.btnStartPause.backgroundTintList =
            getColorStateList(R.color.primary)
    }

    private fun recordLap() {
        if (!running) return
        val total = currentElapsed()
        val split = total - lastLapElapsed
        lastLapElapsed = total
        val lapNumber = laps.size + 1
        laps.add(0, getString(R.string.lap_format, lapNumber, formatTime(total), formatTime(split)))
        lapAdapter.notifyDataSetChanged()
    }

    private fun formatTime(millis: Long): String {
        val totalCentis = millis / 10
        val minutes = (totalCentis / 100) / 60
        val seconds = (totalCentis / 100) % 60
        val centis = totalCentis % 100
        return String.format(Locale.getDefault(), "%02d:%02d:%02d", minutes, seconds, centis)
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(tickRunnable)
    }
}
