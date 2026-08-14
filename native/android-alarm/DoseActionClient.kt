package network.ohc.carepatient.alarm

import android.util.Log
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

object DoseActionClient {
    fun post(baseUrl: String, pathAndQuery: String, jsonBody: String? = null): Boolean {
        val url = URL(baseUrl.trimEnd('/') + pathAndQuery)
        val connection = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            connectTimeout = 15_000
            readTimeout = 15_000
            setRequestProperty("Accept", "application/json")
            setRequestProperty("Content-Type", "application/json")
            doOutput = jsonBody != null
        }
        return try {
            if (jsonBody != null) {
                OutputStreamWriter(connection.outputStream).use { it.write(jsonBody) }
            }
            connection.responseCode in 200..299
        } catch (error: Exception) {
            Log.w(TAG, "POST $pathAndQuery failed", error)
            false
        } finally {
            connection.disconnect()
        }
    }

    private const val TAG = "DoseActionClient"
}
