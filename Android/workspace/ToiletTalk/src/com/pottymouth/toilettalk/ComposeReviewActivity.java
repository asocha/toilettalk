package com.pottymouth.toilettalk;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;

public class ComposeReviewActivity extends Activity implements View.OnClickListener {

	boolean state = true;
	
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.registration_activity);

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
		
	}

}