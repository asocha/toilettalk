package com.pottymouth.toilettalk;

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
		View popup=inflater.inflate(R.layout.google_maps_marker, null);
  
		ImageView imageView = (ImageView)popup.findViewById(R.id.marker_image);
		imageView.setImageResource(R.drawable.icon_placeholder);
		
		TextView textView=(TextView)popup.findViewById(R.id.marker_title);
		textView.setText(marker.getTitle());
		
		RatingBar ratingBar =(RatingBar)popup.findViewById(R.id.marking_rating);
		ratingBar.setRating((float) Double.parseDouble(marker.getSnippet()));
  
		return(popup);	
	}


	@Override
	public void onInfoWindowClick(Marker marker) {
		// TODO Auto-generated method stub
		LatLng latlong = marker.getPosition();
		
		Log.d("Marker", "" + latlong.toString());

	}
}