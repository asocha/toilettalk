package com.pottymouth.toilettalk;

import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.RatingBar;
import android.widget.TextView;

import com.google.android.gms.maps.GoogleMap.InfoWindowAdapter;
import com.google.android.gms.maps.model.Marker;

class GoogleMapsMarker implements InfoWindowAdapter {
	LayoutInflater inflater=null;

	GoogleMapsMarker(LayoutInflater inflater) {
	  this.inflater=inflater;
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
}