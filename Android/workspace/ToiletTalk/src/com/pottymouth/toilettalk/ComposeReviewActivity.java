package com.pottymouth.toilettalk;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.location.Location;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.ToggleButton;

import com.pottymouth.restapihandler.NewRestroomTask;
import com.pottymouth.restapihandler.ReverseGeocodingTask;

public class ComposeReviewActivity extends Activity implements View.OnClickListener {
	
	int CAMERA_REQUEST = 1387;
	ImageView imageView;
	Bitmap photo;
	
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.compose_review_activity);
        
        Button submitButton = (Button) findViewById(R.id.button_submitreview);
        submitButton.setOnClickListener(this);
        
        imageView = (ImageView) findViewById(R.id.compose_image);
        imageView.setOnClickListener(this);
        
        photo = imageView.getDrawingCache(true);
        
        updateLocation();
    }

	private void updateLocation() {
		MainActivity.updateLocation(ComposeReviewActivity.this);
	}
	
	@Override
	public void onClick(View v) {
		
		
		
		if(v.getId() == R.id.button_submitreview){
			
			submitReview();
		}
		
		if(v.getId() == R.id.compose_image){
			Log.d("Compose", "Image Button Pushed");
			
			Intent cameraIntent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE); 
            startActivityForResult(cameraIntent, CAMERA_REQUEST); 
		}
	}

	@SuppressWarnings("unchecked")
	private void submitReview() {
		Log.d("Compose", "Submit Button Pushed");
		
		List<NameValuePair> request = new ArrayList<NameValuePair>();
		
		ProgressDialog progressDialog = progressDialog();
		Log.d("Compose", "Progress dialog started");
		
		String image_str = getImage();
		Log.d("Compose", "Image inserted into request");
		
		String name = getName();
		Log.d("Compose", "Name inserted into request: " + name);
		
		String address = retrieveAddress();
		Log.d("Compose", "Address inserted into request: " + address);
		
		double[] latlong = getLatLong();
		Log.d("Compose", "LatLong inserted into request: " + latlong[0] + ", " + latlong[1]);
		
		String comment = getComment();
		Log.d("Compose", "Comment inserted into request: " + comment);
		
		float rating = getRating();
		Log.d("Compose", "Rating inserted into request: " + rating);
		
		int[] icons = getIcons();
		Log.d("Compose", "Icons inserted into request: " + Arrays.toString(icons));
		
		request.add(new BasicNameValuePair("image", image_str));
		request.add(new BasicNameValuePair("name", name));
		request.add(new BasicNameValuePair("address", address));
		request.add(new BasicNameValuePair("lat", "" + latlong[0]));
		request.add(new BasicNameValuePair("long", "" + latlong[1]));
		request.add(new BasicNameValuePair("comment", "" + comment));
		request.add(new BasicNameValuePair("reviewstarrating", "" + rating));
		request.add(new BasicNameValuePair("des", "" + icons[0]));
		request.add(new BasicNameValuePair("ha", "" + icons[1]));
		request.add(new BasicNameValuePair("unisex", "" + icons[2]));
		request.add(new BasicNameValuePair("co", "" + icons[3]));
		request.add(new BasicNameValuePair("24", "" + icons[4]));
		
		NewRestroomTask submitTask = new NewRestroomTask(ComposeReviewActivity.this, progressDialog);
		submitTask.execute(request);
		
		Log.d("Compose", "Submited NewRestroomTask request");
	}

	private int[] getIcons() {
		int[] icons = new int[5];
		ToggleButton buttonView = (ToggleButton) findViewById(R.id.button_babystation);
		icons[0] = buttonView.isChecked() ? 1 : 0;
		
		buttonView = (ToggleButton) findViewById(R.id.button_handicap);
		icons[1] = buttonView.isChecked() ? 1 : 0;
		
		buttonView = (ToggleButton) findViewById(R.id.button_unisex);
		icons[2] = buttonView.isChecked() ? 1 : 0;
		
		buttonView = (ToggleButton) findViewById(R.id.button_money);
		icons[3] = buttonView.isChecked() ? 1 : 0;
		
		buttonView = (ToggleButton) findViewById(R.id.button_24hours);
		icons[4] = buttonView.isChecked() ? 1 : 0;
		return icons;
	}

	private float getRating() {
		RatingBar ratingView = (RatingBar) findViewById(R.id.compose_ratingbar);
		float rating = ratingView.getRating();
		return rating;
	}

	private String getComment() {
		EditText commentView = (EditText) findViewById(R.id.compose_comment);
		String comment = commentView.getText().toString();
		return comment;
	}

	private double[] getLatLong() {
		Location location = MainActivity.currentLocation;
		double longitude = location.getLongitude();
		double latitude = location.getLatitude();
		double[] latlong = {latitude, longitude};
		return latlong;
	}

	private String retrieveAddress() {
		TextView addressView = (TextView) findViewById(R.id.compose_address);
		String address = addressView.getText().toString();
		return address;
	}

	private String getName() {
		EditText nameView = (EditText) findViewById(R.id.compose_location_name);
		String name = nameView.getText().toString();
		return name;
	}

	private String getImage() {
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		photo.compress(Bitmap.CompressFormat.PNG, 100, bos);
		byte[] byteArray = bos.toByteArray();
		String image_str = Base64.encodeToString(byteArray, Base64.DEFAULT);
		return image_str;
	}

	private ProgressDialog progressDialog() {
		ProgressDialog progressDialog = new ProgressDialog(ComposeReviewActivity.this);
		progressDialog.setMessage("Submitting...");
		progressDialog.setCancelable(false);
		return progressDialog;
	}
	
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {  
        if (requestCode == CAMERA_REQUEST && resultCode == RESULT_OK) {  
            photo = (Bitmap) data.getExtras().get("data"); 
            imageView.setImageBitmap(photo);
        }  
    } 
	
	@Override
	public void finish() {
		super.finish();
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
