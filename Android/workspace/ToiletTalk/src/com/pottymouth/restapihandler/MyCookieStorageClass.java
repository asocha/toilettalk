//Chintan Patel
//34468165

package com.pottymouth.restapihandler;

import java.util.List;

import org.apache.http.cookie.Cookie;

public class MyCookieStorageClass{

	static private List<Cookie> cookies = null;
	
	public static List<Cookie> getCookie() {
		
		return cookies;
	}
	
	public static void setCookie(List<Cookie> list) {
		
		cookies = list;
		
	}
}
