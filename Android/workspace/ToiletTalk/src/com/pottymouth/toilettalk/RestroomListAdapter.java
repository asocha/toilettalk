package com.pottymouth.toilettalk;

import java.util.ArrayList;

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.RatingBar;
import android.widget.TextView;

import com.google.android.gms.maps.model.Marker;

public class RestroomListAdapter extends ArrayAdapter<Marker>{

    Context context; 
    int layoutResourceId;    
    ArrayList<Marker> data = null;
    
    public RestroomListAdapter(Context context, int layoutResourceId) {
        super(context, layoutResourceId);
        this.layoutResourceId = layoutResourceId;
        this.context = context;
        this.data = MainActivity.restroomMarkers;
        
        Log.d("List", "contructor called");
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
    	 Log.d("List", "called getView");
    	 
        View row = convertView;
        MarkerHolder holder = null;
        
        if(row == null)
        {
            LayoutInflater inflater = ((Activity)context).getLayoutInflater();
            row = inflater.inflate(layoutResourceId, parent, false);
            
            holder = new MarkerHolder();
            holder.imgIcon = (ImageView)row.findViewById(R.id.marker_image);
            holder.txtTitle = (TextView)row.findViewById(R.id.marker_title);
            holder.ratingBar = (RatingBar)row.findViewById(R.id.marking_rating);
            
            row.setTag(holder);
        }
        else
        {
            holder = (MarkerHolder)row.getTag();
        }
        
        Marker marker = data.get(position);
        holder.txtTitle.setText(marker.getTitle());
        holder.imgIcon.setImageResource(R.drawable.icon_placeholder);
        holder.ratingBar.setRating((float) Double.parseDouble(marker.getSnippet()));

        Log.d("List", "end getview");

        return row;
        
    }
    
    static class MarkerHolder
    {
        ImageView imgIcon;
        TextView txtTitle;
        RatingBar ratingBar;
    }
}