package com.pottymouth.toilettalk;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

public class RegActivity extends Activity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.registration_activity);
        
        //References buttons
        Button registerButton = (Button) findViewById(R.id.register_button);
     
        //set onClickListers to buttons
        registerButton.setOnClickListener(this);
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

	@Override
	public void onClick(View v) {
		
		String[] fieldValues = this.getFieldValues();
		this.register(fieldValues);
		
		//call register(fieldValues) to submit
		
		//test Log
		Log.d("Regristration", "username: " + fieldValues[0] +  " password: " + fieldValues[1] +  " email: " + fieldValues[2]);
		
		this.finish();
	}
   
	public String[] getFieldValues()
	{
		String[] values = new String[3];
		
		EditText field;
		
		field = (EditText) findViewById(R.id.username);
		values[0] = field.getText().toString();
		
		field = (EditText) findViewById(R.id.password);
		values[1] = field.getText().toString();
		
		field = (EditText) findViewById(R.id.email);
		values[2] = field.getText().toString();
		
		return values;
	}
	
	private void register(String[] fieldValues) {
		//connect to api and POST the data
	}
    
}