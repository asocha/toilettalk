<?php 

class ToiletTalkAPI{

	public function ToiletTalkAPI(){

	}//end of constructor

	public static function helloWorld(){
		echo json_encode(array('data' => 'Hello World!'));
	}//end of fuction helloWord

}//end of class ToiletTalkAPI