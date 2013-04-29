package com.pottymouth.toilettalk;

import org.json.JSONArray;
import org.json.JSONException;

import android.app.ListActivity;
import android.app.ProgressDialog;
import android.os.Bundle;
import android.util.Log;

import com.pottymouth.restapihandler.SavedRestroomTask;

public class SavedRestRoomActivity extends ListActivity{

	ProgressDialog progressDialog;
	JSONArray restrooms;
	UserRestroomAdapter adapter;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		
		super.onCreate(savedInstanceState);
		
		progressDialog = new ProgressDialog(SavedRestRoomActivity.this);
		progressDialog.setMessage("Retrieving your restrooms");
		progressDialog.setCancelable(false);
		
		getSavedRestrooms();
	}

	private void getSavedRestrooms() {

		SavedRestroomTask savedRestroomTask = new SavedRestroomTask(SavedRestRoomActivity.this, progressDialog);
		savedRestroomTask.execute();
	}

	public void setSavedRestroom(JSONArray restrooms) {
		this.restrooms = restrooms;
	}

	public void createList() {
		
		try {

		        String[] stringarray = new String[restrooms.length()];
		        for (int i = 0; i < restrooms.length(); i++) {
		            stringarray[i] = restrooms.getString(i);
		            
		            Log.d("SavedRestroomActivity", stringarray[i]);
		        }
		        
		        
		        //ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, stringarray); 
		        //list.setAdapter(adapter);
		} catch (JSONException e) {
		        // handle JSON parsing exceptions...
		}
		
		//adapter = new SavedRestroomAdapter(this, R.layout.activity_savedrestroom, restrooms);
	}
	
}
