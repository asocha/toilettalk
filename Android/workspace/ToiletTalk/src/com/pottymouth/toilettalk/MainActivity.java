package com.pottymouth.toilettalk;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;

public class MainActivity extends Activity implements View.OnClickListener {
	
	//Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
    	
        super.onCreate(savedInstanceState);
        
        /*
         * Login Page
         */
        Intent it = new Intent(getApplicationContext(), LoginActivity.class);
    	startActivityForResult(it, 1);
    	
    	/*
    	 * Main Activity Page
    	 */
    	setContentView(R.layout.activity_main);

    }
     
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

	@Override
	public void onClick(View v) {

		
	}
     
}
