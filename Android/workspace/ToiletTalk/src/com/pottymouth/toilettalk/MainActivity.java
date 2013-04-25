//Chintan Patel
//34468165

package com.pottymouth.toilettalk;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;

import com.slidingmenu.lib.SlidingMenu;
import com.slidingmenu.lib.app.SlidingActivity;

public class MainActivity extends SlidingActivity implements View.OnClickListener {
	
	//Context context;

    @Override
    public void onCreate(Bundle savedInstanceState) {
    	
        super.onCreate(savedInstanceState);
        
        
        /*
         * Login Page
         */
        this.login();
    	
    	/*
    	 * Main Activity Page
    	 */
    	setContentView(R.layout.activity_main);
    	setBehindContentView(R.layout.activity_menu);
    	
    	SlidingMenu menu = getSlidingMenu();
        menu.setMode(SlidingMenu.LEFT);
        menu.setShadowDrawable(R.drawable.shadow);
        menu.setShadowWidth(35);
        menu.setBehindWidth(300);
        menu.setTouchModeAbove(SlidingMenu.TOUCHMODE_MARGIN);
        menu.setFadeDegree(0.35f);
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
	
	private void login()
	{
		Intent it = new Intent(getApplicationContext(), LoginActivity.class);
    	startActivityForResult(it, 1);
	}
	
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    	super.onActivityResult(requestCode, resultCode, data);
    	
    	if(requestCode == 1 && requestCode != resultCode){
    		this.finish();
    	}
    }
}
