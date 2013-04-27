//Chintan Patel
//34468165

package com.pottymouth.restapihandler;

import java.io.IOException;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.CookieStore;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.cookie.Cookie;
import org.apache.http.impl.client.AbstractHttpClient;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.ProgressDialog;
import android.net.ParseException;
import android.os.AsyncTask;
import android.util.Log;

import com.pottymouth.toilettalk.ComposeReviewActivity;

public class NewRestroomTask extends AsyncTask<List<NameValuePair>, Void, JSONObject> {
	
	static String server = "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/";
	
	private ProgressDialog progressDialog;
	private ComposeReviewActivity activity;
	
	public NewRestroomTask(ComposeReviewActivity composeReviewActivity, ProgressDialog progressDialog) {
		this.activity = composeReviewActivity;
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
			
			if(MyCookieStorageClass.getCookie() != null){
				
				Log.d("Session", "Getting cookie from MyStorageClass");
				
				List<Cookie> cookies = MyCookieStorageClass.getCookie();
				
				CookieStore store = new BasicCookieStore();
				
				for(Cookie cookie : cookies){
					store.addCookie(cookie);
				}
				
				((DefaultHttpClient) client).setCookieStore(store);
				
				Log.d("Session", "Set cookie from MyStorageClass");
				
			}
			
			HttpPost post = new HttpPost(server + "uploadimage");
			
			try {
				post.setEntity(new UrlEncodedFormEntity(params[0], "UTF-8"));
				
				Log.d("API", "Post Entity: " + post.getEntity());
				
				HttpResponse response = client.execute(post);
				HttpEntity entity = response.getEntity();
				
				if (null != entity) {
					
					String responseStr = EntityUtils.toString(entity);
					Log.d("NewRestroomTask", "Entity: " + responseStr);
					result = new JSONObject(responseStr);

					MyCookieStorageClass.setCookie(((AbstractHttpClient) client).getCookieStore().getCookies());
					
					for(Cookie cookie : MyCookieStorageClass.getCookie())
						Log.d("Cookie Values", cookie.toString());
					
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
			if(result.getString("success").equalsIgnoreCase("true")){
				activity.finish();
			}
			else
				activity.showErrorMessage("");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
	}
}