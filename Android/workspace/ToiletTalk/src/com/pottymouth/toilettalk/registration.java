package com.pottymouth.toilettalk;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.Button;

public class registration extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.registration_activity);
        
        //References buttons
        Button registerButton = (Button) findViewById(R.id.register_button);
        
        //Create onClickListener Variables
        View.OnClickListener registerHandler = new View.OnClickListener() {
            public void onClick(View v) {
            }
        };
        
        
        //set onClickListers to buttons
        registerButton.setOnClickListener(registerHandler);
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
   
    
}
