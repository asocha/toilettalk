package com.pottymouth.toilettalk;

import android.app.ListActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ListView;

public class RestroomListActivity extends ListActivity{
	
	RestroomListAdapter adapter;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		
		adapter = new RestroomListAdapter(this, R.layout.google_maps_marker);
		setListAdapter(adapter);
	}

	@Override
	protected void onListItemClick(ListView l, View v, int position, long id) {
		super.onListItemClick(l, v, position, id);
		
	}
	
	@Override
    public void finish()
    {

    	super.finish();
    }

}

