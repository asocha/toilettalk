package com.pottymouth.toilettalk;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;

public class Review_summary extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_review_summary);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.review_summary, menu);
		return true;
	}

}