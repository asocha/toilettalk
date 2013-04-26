//Chintan Patel
//34468165

package com.pottymouth.toilettalk;

import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import android.app.ActionBar;
import android.app.ProgressDialog;
import android.content.Intent;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

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

public class MainActivity extends SlidingActivity implements View.OnClickListener {
	
	SlidingMenu menu;
	ArrayList<Marker> locations;
	LocationManager locManager;
	LocationHandler locHandler;
	LocationResult locationResult;
	Location currentLocation;
	ProgressDialog progressDialog;
	
	GoogleMap map;

    @Override
    public void onCreate(Bundle savedInstanceState) {
    	
    	ActionBar actionBar = getActionBar();
    	View mActionBarView = getLayoutInflater().inflate(R.layout.action_bar, null);
    	actionBar.setCustomView(mActionBarView);
    	actionBar.setDisplayOptions(ActionBar.DISPLAY_SHOW_CUSTOM);
    	actionBar.setDisplayShowHomeEnabled(false);
    	actionBar.setBackgroundDrawable(getResources().getDrawable(R.drawable.stroke_actionbar_underline_yellow));
    	
        super.onCreate (savedInstanceState);
    	
    	/*
    	 * Main Activity Page
    	 */
    	setContentView(R.layout.activity_main);
    	setBehindContentView(R.layout.activity_menu);
    	
    	setupMenu();        
        getLocation();

    }

	private void startMap() {

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
            	startMap();
            }
        };
	        
        locHandler = new LocationHandler();
        boolean locationGot = locHandler.getLocation(this, locationResult);
	     
        progressDialog = new ProgressDialog(MainActivity.this);
		progressDialog.setMessage("Logging in...");
		progressDialog.setCancelable(false);
		
		Log.d("location", "locationGot: " + locationGot);
	}

	private void setupMenu() {
		menu = getSlidingMenu();
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

	
	public void onGroupItemClick(MenuItem item) {
	    // One of the group items (using the onClick attribute) was clicked
	    // The item parameter passed here indicates which item it is
	    // All other menu item clicks are handled by onOptionsItemSelected()
		
		switch(item.getItemId()){
		
			//creates new review
			case R.id.button_compose_review:
				Intent it = new Intent(getApplicationContext(), ComposeReviewActivity.class);
				startActivityForResult(it, 1);
				break;
				
		}//end of switch
	}
	
	public void toggleMenu(View item) {
	    // One of the group items (using the onClick attribute) was clicked
	    // The item parameter passed here indicates which item it is
	    // All other menu item clicks are handled by onOptionsItemSelected()
		
		menu.toggle();
	}
}
