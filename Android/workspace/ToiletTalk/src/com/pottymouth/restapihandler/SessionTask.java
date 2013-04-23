package com.pottymouth.restapihandler;

import java.io.IOException;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.CookieStore;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.cookie.Cookie;
import org.apache.http.impl.client.AbstractHttpClient;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.AsyncTask;
import android.util.Log;

public class SessionTask extends AsyncTask<Void, Void, Void> {
	
	static String server = "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/";

	@Override
	protected Void doInBackground(Void... params) { 
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
			
			HttpGet get = new HttpGet(server + "session");
			
			try {
				
				HttpResponse response = client.execute(get); 
				HttpEntity entity = response.getEntity();
				
				if (null != entity) {
					result = new JSONObject(EntityUtils.toString(entity));
					Log.d("SessionResponse", result.toString());
					
					if(response.getFirstHeader("set-cookie") != null)
						Log.d("setcookie-header", "getValue:" + response.getFirstHeader("set-cookie").getValue());
					
					else
						Log.d("setcookie-header", "set-cookie not present");
					
					MyCookieStorageClass.setCookie(((AbstractHttpClient) client).getCookieStore().getCookies());
					
					for(Cookie cookie : MyCookieStorageClass.getCookie())
						Log.d("Cookie Values", cookie.toString());


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

}