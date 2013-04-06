<?
  function findLocalRestrooms($currentLatitude, $currentLongitude, $radius) {
		$con = mysql_connect('ec2-54-242-116-188.compute-1.amazonaws.com','ToiletTalk','toilet');
       		 mysql_select_db('ToiletTalk');
        	if (!$con)
        	{
        	    die('Could not connect: ' . mysql_error());
        	}
       		$radius = $radius/69.055;
		$lowerBoarder=$currentLatitude-$radius;
		$upperBoarder=$currentLatitude+$radius;
	   	$rightBoarder=$currentLongitude-$radius;
	    	$leftBoarder=$currentLongitude+$radius;
	    	$query = "Select latitude, longitude 
			    From restroom 
			    Where longitude <= $leftBoarder and longitude >= $rightBoarder and 
			    latitude <= $upperBoarder and latitude >= $lowerBoarder;";
	        $results = mysql_query($query);
        	$rows = array();
       		 while($r = mysql_fetch_assoc($results)) {
       		     $rows[] = $r;
       		 }
      		  return json_encode($rows);
	}


	function getResponseIds($review_id){
	
	
	$con = mysql_connect('ec2-54-242-116-188.compute-1.amazonaws.com','ToiletTalk','toilet');
       	mysql_select_db('ToiletTalk');
        if (!$con)
        {
              die('Could not connect: ' . mysql_error());
        }

	$result = mysql_query("select responds_to_id from response where review_id = 1 group by responds_to_id order by responds_to_id desc;") or die(mysql_error());
	//$info = mysql_fetch_array( $data );

		while($row = mysql_fetch_array($result)){
  			echo "responds_to_id-".$row['responds_to_id'];
			echo "<br />";
		}
	}
	
	function insertNewResponse($responds_to_id, $user_id, $user_comments, $gender, $flags, $thumbs_up, $thumbs_down, $time_stamp, $review_star_rating, 	   $restroom_id)
	{
	

	$con = mysql_connect('ec2-54-242-116-188.compute-1.amazonaws.com','ToiletTalk','toilet');
       	mysql_select_db('ToiletTalk');
        if (!$con)
        {
              die('Could not connect: ' . mysql_error());
        }

	$sql="insert into response (responds_to_id, user_id, user_comments, gender, flags, thumbs_up, thumbs_down, time_stamp, review_star_rating, restroom_id) 	Values	( '$responds_to_id', '$user_id', '$user_comments', '$gender', '$flags', '$thumbs_up', '$thumbs_down', '$time_stamp', '$review_star_rating', 		'$restroom_id');";
	$ok = mysql_query($sql);

	if($ok)
	{return true;}
	else
	{return false;}


	}

	function insertNewRestroom($user_id, $avg_rating, $latitude, $longitude)
	{

	$con = mysql_connect('ec2-54-242-116-188.compute-1.amazonaws.com','ToiletTalk','toilet');
       	mysql_select_db('ToiletTalk');
        if (!$con)
        {
              die('Could not connect: ' . mysql_error());
        }

	$sql="insert into restroom (user_id, avg_rating, latitude, longitude) values('$user_id', '$avg_rating', '$latitude', '$longitude')";
	$ok = mysql_query($sql);

	if($ok)
	{return true;}
	else
	{return false;}
	


	}

	function insertNewUser($user_id, $username, $first_name, $last_name, $password, $gender, $permission)
	{

	$con = mysql_connect('ec2-54-242-116-188.compute-1.amazonaws.com','ToiletTalk','toilet');
       	mysql_select_db('ToiletTalk');
        if (!$con)
        {
              die('Could not connect: ' . mysql_error());
        }

	$sql="insert into users values( '$user_id', '$username', '$first_name', '$last_name', '$password', '$gender', '$permission');";
	$ok = mysql_query($sql);

	if($ok)
	{return true;}
	else
	{return false;}
	


	}
	
	 function insert_Route($user_id, $origin, $destination ) { 
   	 
   	 $con = mysql_connect('ec2-54-242-116-188.compute-1.amazonaws.com','ToiletTalk','toilet');
   	 mysql_select_db('ToiletTalk');
  	  if (!$con)
  	  {
  	    die('Could not connect: ' . mysql_error());
  	  }
 	   $query="insert into routes(user_id, origin, destination) values('$user_id', '$origin', '$destination');";
 	   mysql_query($query);
	   
 	 }
 	 
 	 insert_Route(4, '3456 fiction ave. 75206', 'hello street');
	 insertNewUser('4', 'gcas', 'gus', 'cas', '12345', '1', '1');
         insertNewRestroom(4, 3, 100, 100);
	 insertNewResponse(1, 4, '$user_comments', 1, 0, 0, 0, CURRENT_TIMESTAMP, 0,1);


?>
