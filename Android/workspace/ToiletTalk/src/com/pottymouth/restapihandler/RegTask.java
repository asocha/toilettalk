package com.pottymouth.restapihandler;

import java.io.IOException;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.ProgressDialog;
import android.os.AsyncTask;
import android.util.Log;

import com.pottymouth.toilettalk.RegActivity;

public class RegTask extends AsyncTask<List<NameValuePair>, Void, JSONObject> {
	
	static String server = "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/";
	
	private ProgressDialog progressDialog;
	private RegActivity activity;
 
	public RegTask(RegActivity regActivity, ProgressDialog progressDialog)
	{
		this.activity = regActivity;
		this.progressDialog = progressDialog;
	}
	
	@Override
	protected void onPreExecute()
	{
		progressDialog.show();
	}
	
	@Override
	protected JSONObject doInBackground(List<NameValuePair>... params) { 
			JSONObject result;
			
			HttpClient client = new DefaultHttpClient();
			HttpPost post = new HttpPost(server + "user");
			
			try {
				post.setEntity(new UrlEncodedFormEntity(params[0], "UTF-8"));
				
				Log.d("CNP", post.getEntity().toString());
				
				HttpResponse response = client.execute(post); 
				HttpEntity entity = response.getEntity();
				
				if (null != entity) {
					result = new JSONObject(EntityUtils.toString(entity));
					Log.d("CNP", result.toString());
					return result;
				}
				} catch (ClientProtocolException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				} catch (ParseException e) {
					e.printStackTrace();
				} catch (JSONException e) {
					e.printStackTrace();
				}
			
			return null;
	}
	
	@Override
	protected void onPostExecute(JSONObject result)
	{
		progressDialog.dismiss();
		try {
			if(result.getString("success").equalsIgnoreCase("true"))
				activity.finish();
			else
				activity.showLoginError("");
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
}