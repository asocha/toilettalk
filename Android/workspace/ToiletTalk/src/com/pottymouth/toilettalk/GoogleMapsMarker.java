package com.pottymouth.toilettalk;

import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.RatingBar;
import android.widget.TextView;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.GoogleMap.InfoWindowAdapter;
import com.google.android.gms.maps.GoogleMap.OnInfoWindowClickListener;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;

class GoogleMapsMarker implements InfoWindowAdapter, OnInfoWindowClickListener {
	LayoutInflater inflater=null;

	GoogleMap map;
	
	GoogleMapsMarker(LayoutInflater inflater, GoogleMap map) {
	  this.inflater=inflater;
	  
	  this.map = map;
	  
	  this.map.setOnInfoWindowClickListener(this);
	}

	@Override
	public View getInfoWindow(Marker marker) {
	  return(null);
	}

	@Override
	public View getInfoContents(Marker marker) {
		
		JSONObject json;
		
		View popup;
		
		try {
			json = new JSONObject(marker.getSnippet());
			
			Log.d("Marker", json.toString());
			
			popup=inflater.inflate(R.layout.google_maps_marker, null);
			  
			ImageView imageView = (ImageView)popup.findViewById(R.id.marker_image);
			imageView.setImageResource(R.drawable.icon_placeholder);
			
			TextView textView = (TextView)popup.findViewById(R.id.marker_title);
			textView.setText(json.getString("name"));
			
			textView = (TextView)popup.findViewById(R.id.marker_address);
			textView.setText(json.getString("address"));
			
			RatingBar ratingBar =(RatingBar)popup.findViewById(R.id.marking_rating);
			ratingBar.setRating((float) json.getDouble("final_average"));
			
			boolean babystation = json.getInt("sum(diaper_changing_station)") == 1;
			boolean handycap = json.getInt("sum(handicap_accessible)") == 1;
			boolean unisex = json.getInt("sum(unisex)") == 1;
			boolean money = json.getInt("sum(customer_only)") == 1;
			boolean twentyfourhour = json.getInt("sum(24_hour)") == 1;

			
			if(!babystation)
				popup.findViewById(R.id.button_unisex).setVisibility(View.GONE);
			
			if(!handycap)
				popup.findViewById(R.id.button_handicap).setVisibility(View.GONE);
			
			if(!unisex)
				popup.findViewById(R.id.button_unisex).setVisibility(View.GONE);
			
			if(!money)
				popup.findViewById(R.id.button_money).setVisibility(View.GONE);
			
			if(!twentyfourhour)
				popup.findViewById(R.id.button_24hours).setVisibility(View.GONE);
			
			return(popup);	
			
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		return null;
	}


	@Override
	public void onInfoWindowClick(Marker marker) {
		// TODO Auto-generated method stub
		LatLng latlong = marker.getPosition();
		
		Log.d("Marker", "" + latlong.toString());

	}
}