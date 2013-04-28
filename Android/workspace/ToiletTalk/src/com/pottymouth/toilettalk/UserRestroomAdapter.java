package com.pottymouth.toilettalk;

import android.content.Context;
import android.widget.ArrayAdapter;

public class UserRestroomAdapter extends ArrayAdapter<String>{

	@SuppressWarnings("unused")
	private Context context;
	@SuppressWarnings("unused")
	private int layout;
	@SuppressWarnings("unused")
	private int view;
	@SuppressWarnings("unused")
	private String[] restrooms;

	public UserRestroomAdapter(Context context, int resource, String[] objects) {
		super(context, resource, objects);
		
		this.context = context;
		this.layout = resource;
		this.view = resource;
		this.restrooms = objects;
	}

}
