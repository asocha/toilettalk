package com.pottymouth.toilettalk;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.Button;

public class LoginActivity extends Activity implements View.OnClickListener {
	
	Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
    	
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login_activity);
        context = getApplication();
        
        //References buttons
        Button registerButton = (Button) findViewById(R.id.button_register);
        Button loginButton = (Button) findViewById(R.id.button_login);
        Button guestButton = (Button) findViewById(R.id.button_continue_guest);
        
        //set onClickListers to buttons
        registerButton.setOnClickListener(this);
        loginButton.setOnClickListener(this);
        guestButton.setOnClickListener(this);
    }
     
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

	@Override
	public void onClick(View v) {
		switch(v.getId())
		{
			case R.id.button_register:
				Intent it = new Intent(this.context, RegActivity.class);
            	startActivityForResult(it, 0);
				break;
		}//end switch
		
	}
     
}
