//Chintan Patel

package com.pottymouth.restapihandler;

import java.io.IOException;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import android.os.AsyncTask;
import android.util.Log;

public class RestClientV2 {
	
	static String server = "http://toilettalkapiv1.apiary.io/index.php/api/toilettalkapi/";
	
	public static void login(List<NameValuePair>... param)
	{
		
		String encodedParam = URLEncodedUtils.format(param[0], "utf-8");
		
		LoginAPI api = new LoginAPI();
		api.execute(encodedParam);
	}//end of login
	
	private static class LoginAPI extends AsyncTask<String, Void, String> { 

		protected String doInBackground(String... params) { 
			String result;
			
			HttpClient client = new DefaultHttpClient();
			HttpPost post = new HttpPost(server + "login");
			
			try {
				HttpResponse response = client.execute(post); 
				HttpEntity entity = response.getEntity();
				
				if (null != entity) {
					result = EntityUtils.toString(entity); 
					Log.d("CRR", result);
					return result;
				}
				} catch (ClientProtocolException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				}
			
			return null;
		}

		protected void onPostExecute(String result) { 
			
		}
	}
	
}//end of class RestClientV2
