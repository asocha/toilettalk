//Chintan Patel
//34468165

package com.pottymouth.restapihandler;

import java.io.IOException;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.CookieStore;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.cookie.Cookie;
import org.apache.http.impl.client.AbstractHttpClient;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.ProgressDialog;
import android.net.ParseException;
import android.os.AsyncTask;
import android.util.Log;

import com.pottymouth.toilettalk.SavedRestRoomActivity;

public class SavedRestroomTask extends AsyncTask<Void, Void, JSONArray> {
	
	static String server = "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/";
	
	private ProgressDialog progressDialog;
	private SavedRestRoomActivity activity;
 
	public SavedRestroomTask(SavedRestRoomActivity savedRestRoomActivity, ProgressDialog progressDialog)
	{
		this.activity = savedRestRoomActivity;
		this.progressDialog = progressDialog;
	}
	
	@Override
	protected void onPreExecute()
	{
		progressDialog.show();
	}
	
	@Override
	protected JSONArray doInBackground(Void... params) { 
		
			JSONArray result;
			
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
			
			HttpGet get = new HttpGet(server + "savedrestroomsmobile");
			
			try {
				
				HttpResponse response = client.execute(get);
				HttpEntity entity = response.getEntity();
				
				if (null != entity) {
					result = new JSONArray(EntityUtils.toString(entity));
					Log.d("SavedRestroomTask", result.toString());
					
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
	protected void onPostExecute(JSONArray restrooms)
	{
		progressDialog.dismiss();
		
		activity.setSavedRestroom(restrooms);
		activity.createList();
		
	}//end of onPostExecute
	
}