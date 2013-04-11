package com.pottymouth.toilettalk;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.Button;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login_activity);
        
        //References buttons
        Button registerButton = (Button) findViewById(R.id.register);
        Button loginButton = (Button) findViewById(R.id.submit);
        Button guestButton = (Button) findViewById(R.id.guest);
        
        //Create onClickListener Variables
        View.OnClickListener registerHandler = new View.OnClickListener() {
            public void onClick(View v) {
            	setContentView(R.layout.registration_activity);
            }
        };
        
        View.OnClickListener loginHandler = new View.OnClickListener() {
            public void onClick(View v) {

            }
        };
        
        View.OnClickListener guestHandler = new View.OnClickListener() {
            public void onClick(View v) {

            }
        };
        
        //set onClickListers to buttons
        registerButton.setOnClickListener(registerHandler);
        loginButton.setOnClickListener(loginHandler);
        guestButton.setOnClickListener(guestHandler);
    }
     
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    
   
    
}
