package com.pottymouth.toilettalk;

import java.util.ArrayList;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;

import com.pottymouth.restapihandler.RegTask;

public class RegActivity extends Activity implements View.OnClickListener {

	boolean state = true;
	
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.registration_activity);
        
        //References buttons
        Button registerButton = (Button) findViewById(R.id.register_button);
        ImageButton genderButton = (ImageButton) findViewById(R.id.gender);
     
        //set onClickListers to buttons
        registerButton.setOnClickListener(this);
        genderButton.setOnClickListener(this);
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    
    @Override
    public void finish()
    {
    	Intent data = new Intent();
    	setResult(RESULT_OK, data);
    	super.finish();
    }

	@SuppressWarnings("unchecked")
	@Override
	public void onClick(View v) {
		
		switch(v.getId()){
		
		case R.id.register_button:
			String[] fieldValues = this.getFieldValues();
			
			ArrayList<NameValuePair> request = new ArrayList<NameValuePair>();
			request.add(new BasicNameValuePair("uname", fieldValues[0]));
			request.add(new BasicNameValuePair("fname", fieldValues[1]));
			request.add(new BasicNameValuePair("lname", fieldValues[2]));
			request.add(new BasicNameValuePair("password", fieldValues[3]));
			request.add(new BasicNameValuePair("email", fieldValues[4]));
			request.add(new BasicNameValuePair("gender", fieldValues[5]));
			
			ProgressDialog progressDialog = new ProgressDialog(RegActivity.this);
			progressDialog.setMessage("Please wait...");
			progressDialog.setCancelable(false);
			
			RegTask regTask = new RegTask(RegActivity.this, progressDialog);
			regTask.execute(request);
			
			break;
			
		case R.id.gender:
			ImageButton genderButton = (ImageButton) findViewById(R.id.gender);
			
			if(state){
				state = !state;
				genderButton.setImageResource(R.drawable.gender_button_woman);
			}
			
			else{
				state = !state;
				genderButton.setImageResource(R.drawable.gender_button_man);
			}
			
			break;
		}
	}
   
	public String[] getFieldValues()
	{
		String[] values = new String[6];
		
		EditText field;
		
		field = (EditText) findViewById(R.id.username);
		values[0] = field.getText().toString();
		
		field = (EditText) findViewById(R.id.fname);
		values[1] = field.getText().toString();
		
		field = (EditText) findViewById(R.id.lname);
		values[2] = field.getText().toString();
		
		field = (EditText) findViewById(R.id.password);
		values[3] = field.getText().toString();
		
		field = (EditText) findViewById(R.id.email);
		values[4] = field.getText().toString();
		
		values[5] = "" + (state ? 1 : 0);
		
		return values;
	}
	
	public void showLoginError(String result)
	{
		AlertDialog.Builder builder = new AlertDialog.Builder(RegActivity.this);
		builder.setPositiveButton(R.string.error_continue, new DialogInterface.OnClickListener()
		{
			public void onClick(DialogInterface dialog, int which) {
				dialog.cancel();
			}
		});
		builder.setMessage(R.string.error_reg);
		AlertDialog alert = builder.create();
		alert.setCancelable(false);
		alert.show();
	}
    
}
