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
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.cookie.Cookie;
import org.apache.http.impl.client.AbstractHttpClient;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.ProgressDialog;
import android.net.ParseException;
import android.os.AsyncTask;
import android.util.Log;

import com.google.android.gms.maps.model.LatLng;
import com.pottymouth.toilettalk.MainActivity;

public class RestroomTask extends AsyncTask<List<NameValuePair>, Void, JSONArray> {
	
	static String server = "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/";
	
	private ProgressDialog progressDialog;
	private MainActivity activity;
 
	public RestroomTask(MainActivity mainActivity, ProgressDialog progressDialog)
	{
		this.activity = mainActivity;
		this.progressDialog = progressDialog;
	}
	
	@Override
	protected void onPreExecute()
	{
		progressDialog.show();
	}
	
	@Override
	protected JSONArray doInBackground(List<NameValuePair>... params) { 
		
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
			
			String paramString = URLEncodedUtils.format(params[0], "utf-8");
			HttpGet get = new HttpGet(server + "restrooms" + "?" + paramString);
			
			try {
				
				HttpResponse response = client.execute(get);
				HttpEntity entity = response.getEntity();
				
				if (null != entity) {
					result = new JSONArray(EntityUtils.toString(entity));
					Log.d("RestroomTask", result.toString());
					
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

		if(restrooms != null)
			for(int x = 0; x < restrooms.length(); x++){
				
				JSONObject location = restrooms.optJSONObject(x);
				
				try {
					double latitude = location.getDouble("latitude");
					double longitude = location.getDouble("longitude");
					String name = location.getString("restroom_id");
					double rating = location.getDouble("final_average");
					
					LatLng coordinates = new LatLng(latitude, longitude);
					
					Log.d("RestroomTask", "Putting into map latitude: " + latitude);
					Log.d("RestroomTask", "Putting into map longitude: " + longitude);
					Log.d("RestroomTask", "Putting into map name: " + name);
					Log.d("RestroomTask", "Putting into map rating: " + rating);
					
					activity.addFlag(coordinates, name, rating);
					
				} catch (JSONException e) {
					e.printStackTrace();
				}
				
			}//end of for
		
		activity.refreshMap();
		
	}//end of onPostExecute
	
}