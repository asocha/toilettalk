package com.pottymouth.restapihandler;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;

import android.os.AsyncTask;
import android.util.Log;

public class RestClient {
	
	String server = "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/";
	String get = "GET";
	String post = "POST";
	String put = "PUT";
	String delete = "DELETE";
	
	public RestClient(){
		
	}
	
	public JSONArray get(String function){
		
		String request = server + function;
		//String response;
		
		getApi api = new getApi(this);
		api.execute(request);
		
				
		return null;
	}
	
	public JSONArray get(String function, List<NameValuePair> parameters){
		
		String request = server + function;
		String paramString = URLEncodedUtils.format(parameters, "utf-8");
		Log.d("RestClient GET w/Params", "QueryString: " + paramString);
		
		request += "?";
		request += paramString;
		
		Log.d("RestClient GET w/Params", "URL: " + request);
		
		getApi api = new getApi(this);
		api.execute(request);
		
		return null;
	}
	
	
	private class getApi extends AsyncTask<String, Void, JSONArray> {
	
		RestClient caller;
		
		getApi(RestClient caller) {
	        this.caller = caller;
	    }

		protected JSONArray doInBackground(String... urls) {
			JSONArray jArr = null;
			String json = "";
			
			HttpClient client = new DefaultHttpClient();
			HttpGet get = new HttpGet(urls[0]);
			InputStream is = null;
			
			try {
				HttpResponse response = client.execute(get); 
				HttpEntity entity = response.getEntity();
			
				if(entity == null)
					Log.d("CNP", "NULL Entity");
				else
					is = entity.getContent();
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			} catch (ClientProtocolException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			
			try {
	            BufferedReader reader = new BufferedReader(new InputStreamReader(
	                    is, "iso-8859-1"), 8);
	            StringBuilder sb = new StringBuilder();
	            String line = null;
	            while ((line = reader.readLine()) != null) {
	                sb.append(line + "\n");
	            }
	            is.close();
	            json = sb.toString();
	        } catch (Exception e) {
	            Log.e("Buffer Error", "Error converting result " + e.toString());
	        }
	 
	        // try parse the string to a JSON object
	        try {
	            jArr = new JSONArray(json);
	        } catch (JSONException e) {
	            Log.e("JSON Parser", "Error parsing data " + e.toString());
	        }
	 
	        // return JSON String
	        return jArr;
			
		}//end of doInBackground
		    /** The system calls this to perform work in the UI thread and delivers
		      * the result from doInBackground() */
		protected void onPostExecute(JSONArray result) { 
			Log.d("AsyncTask onPostExecute", result.toString());
		} 
	}
	
	
}
