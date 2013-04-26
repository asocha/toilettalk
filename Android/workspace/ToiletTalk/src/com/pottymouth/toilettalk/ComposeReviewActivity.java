package com.pottymouth.toilettalk;

import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.ToggleButton;

import com.pottymouth.restapihandler.NewRestroomTask;
import com.pottymouth.restapihandler.ReverseGeocodingTask;

public class ComposeReviewActivity extends Activity implements View.OnClickListener {
	
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.compose_review_activity);
        
        Button submitButton = (Button) findViewById(R.id.button_submitreview);
        submitButton.setOnClickListener(this);
        
        updateLocation();
    }

	private void updateLocation() {
		MainActivity.updateLocation(ComposeReviewActivity.this);
	}

	@SuppressWarnings("unchecked")
	@Override
	public void onClick(View v) {
		
		List<NameValuePair> request;
		
		if(v.getId() == R.id.button_submitreview){
			
			ProgressDialog progressDialog = new ProgressDialog(ComposeReviewActivity.this);
			progressDialog.setMessage("Submitting...");
			progressDialog.setCancelable(false);
			
			request = new ArrayList<NameValuePair>();
			request.add(new BasicNameValuePair("uname", "hi"));
			request.add(new BasicNameValuePair("password", "hi"));
			
			
			NewRestroomTask submitTask = new NewRestroomTask(ComposeReviewActivity.this, progressDialog);
			submitTask.execute(request);
			Log.d("Compose", "Submit Button Pushed");
		}
	}
	
	@Override
	public void finish() {
		super.finish();
		
		Log.d("Compose", "Unisex: "+((ToggleButton)findViewById(R.id.button_unisex)).isChecked());
	}

	public void publishAddress(String address) {
		
		TextView myAddress = (TextView)findViewById(R.id.compose_address);
		
		myAddress.setText(address.toString());
				
	}

	public void getAddress() {
		
		ReverseGeocodingTask loginTask = new ReverseGeocodingTask(ComposeReviewActivity.this, getApplicationContext());
		loginTask.execute(MainActivity.currentLocation);
		
	}
	
	public void showErrorMessage(String result)
	{
		AlertDialog.Builder builder = new AlertDialog.Builder(ComposeReviewActivity.this);
		builder.setPositiveButton(R.string.error_continue, new DialogInterface.OnClickListener()
		{
			public void onClick(DialogInterface dialog, int which) {
				dialog.cancel();
			}
		});
		builder.setMessage(R.string.error_generic);
		AlertDialog alert = builder.create();
		alert.setCancelable(false);
		alert.show();
	}

}
