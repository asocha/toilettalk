//Chintan Patel
//34468165

package com.pottymouth.toilettalk;

import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.Menu;
import android.view.View;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.pottymouth.restapihandler.RestroomTask;
import com.pottymouth.toilettalk.LocationHandler.LocationResult;
import com.slidingmenu.lib.SlidingMenu;
import com.slidingmenu.lib.app.SlidingActivity;

public class MainActivity extends SlidingActivity implements View.OnClickListener, LocationListener {
	
	ArrayList<Marker> locations;
	LocationManager locManager;
	LocationHandler locHandler;
	LocationResult locationResult;
	Location currentLocation;
	ProgressDialog progressDialog;
	
	GoogleMap map;

    @Override
    public void onCreate(Bundle savedInstanceState) {
    	
        super.onCreate(savedInstanceState);
    	
    	/*
    	 * Main Activity Page
    	 */
    	setContentView(R.layout.activity_main);
    	setBehindContentView(R.layout.activity_menu);
    	
    	setupMenu();
        
       
        
        getLocation();
        
        //startMap();
        
        
    }

	private void startMap2() {

		map = ((MapFragment) getFragmentManager().findFragmentById(R.id.map)).getMap();
		map.setMyLocationEnabled(true);
		
		LatLng location = new LatLng(currentLocation.getLatitude(), currentLocation.getLongitude());
		
		map.moveCamera(CameraUpdateFactory.newLatLngZoom(location, 15));
		
		getNearbyRestrooms(currentLocation);
	}

	private void getLocation() {
		
		locations = new ArrayList<Marker>();
	        
        locationResult = new LocationResult(){
            @Override
            public void gotLocation(Location location){
            	Log.d("location", "Got a location: " + location.getLongitude());
            	currentLocation = location;
            	progressDialog.dismiss();
            	startMap2();
            }
        };
	        
        locHandler = new LocationHandler();
        boolean locationGot = locHandler.getLocation(this, locationResult);
	     
		//boolean locationGot = locHandler.getLocation(getApplicationContext(), locationResult);
        progressDialog = new ProgressDialog(MainActivity.this);
		progressDialog.setMessage("Logging in...");
		progressDialog.setCancelable(false);
		
		Log.d("location", "locationGot: " + locationGot);
		
		
		
//		if(currentLocation != null)
//			onLocationChanged(currentLocation);
//		Log.d("location", "Called Location Changed");
		
	}

	private void setupMenu() {
		SlidingMenu menu = getSlidingMenu();
        menu.setMode(SlidingMenu.LEFT);
        menu.setShadowDrawable(R.drawable.shadow);
        menu.setShadowWidth(35);
        menu.setBehindWidth(300);
        menu.setTouchModeAbove(SlidingMenu.TOUCHMODE_MARGIN);
        menu.setFadeDegree(0.35f);
	}
    
    @SuppressWarnings("unchecked")
	private void getNearbyRestrooms(Location location) {
		
    	List<NameValuePair> request = new ArrayList<NameValuePair>();
		request.add(new BasicNameValuePair("latitude", "" + location.getLatitude()));
		request.add(new BasicNameValuePair("longitude", "" + location.getLongitude()));
		request.add(new BasicNameValuePair("radius", "" + 500));
	 	
		ProgressDialog progressDialog = new ProgressDialog(MainActivity.this);
		progressDialog.setMessage("Getting nearby restrooms...");
		progressDialog.setCancelable(false);
		
		RestroomTask restrooomTask = new RestroomTask(MainActivity.this, progressDialog);
		restrooomTask.execute(request);
		
	}

	protected void onResume() {
        super.onResume();
        //locManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, this);
    }
     
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

	@Override
	public void onClick(View v) {

	
	}
	
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    	super.onActivityResult(requestCode, resultCode, data);
    	
    	if(requestCode == 1 && requestCode != resultCode){
    		this.finish();
    	}
    }

	@Override
	public void onLocationChanged(Location location) {
		double lat =  location.getLatitude();
        double lng = location.getLongitude();
        
        LatLng currentLocation = new LatLng(lat, lng);
        map.moveCamera(CameraUpdateFactory.newLatLngZoom(currentLocation, 15));
		
	}

	@Override
	public void onProviderDisabled(String provider) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onProviderEnabled(String provider) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {
		// TODO Auto-generated method stub
		
	}

	public void addFlag(LatLng coordinates, String name, double rating) {
		
		locations.add(map.addMarker(new MarkerOptions()
        .position(coordinates)
        .snippet("I have " + Double.toString(rating) + " stars")
        .title(name)));
		
	}

	public void refreshMap() {
		
		LatLngBounds.Builder builder = new LatLngBounds.Builder();
		for(Marker m : locations) {
		    builder.include(m.getPosition());
		}
		
		builder.include(new LatLng(currentLocation.getLatitude(), currentLocation.getLongitude()));
		
		LatLngBounds bounds = builder.build();
		
		int padding = 30;
		CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, padding);
		
		map.moveCamera(cu);
	}

	public void startMap() {
		map = ((MapFragment) getFragmentManager().findFragmentById(R.id.map)).getMap();
		
		if(locManager == null)
			locManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
		
		boolean gps_enabled = false; 
		boolean network_enabled = false;
		
		if(!gps_enabled && !network_enabled){
			finish();
			return;
		}
		
		try{
			gps_enabled=locManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
			}catch(Exception ex){}
		
        try{
        	network_enabled=locManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
        	}catch(Exception ex){}
        
        if (!locManager.isProviderEnabled(LocationManager.GPS_PROVIDER)){
        	this.finish();
        	
		    Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
		    startActivity(intent);
		    
		    return;
        }
        
        
//        if(gps_enabled)
//        	locManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, locationListenerGps);
//        if(network_enabled)
//        	locManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, locationListenerNetwork);
        
        Location location = locManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        locManager.removeUpdates(this);
        
        int resultCode = GooglePlayServicesUtil.isGooglePlayServicesAvailable(this);
        if (resultCode == ConnectionResult.SERVICE_MISSING ||
            resultCode == ConnectionResult.SERVICE_VERSION_UPDATE_REQUIRED ||
            resultCode == ConnectionResult.SERVICE_DISABLED) {
            Dialog dialog = GooglePlayServicesUtil.getErrorDialog(resultCode, this, 1);
            dialog.show();
        }
        
        map.setMyLocationEnabled(true);
        
        if(location != null)
        	onLocationChanged(location);
        getNearbyRestrooms(location);
        
		
	}
	
}
