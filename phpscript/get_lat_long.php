<?php
	function rrlocation($currentLatitude, $currentLongitude, $radius) {
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
	        echo json_encode($rows);
		
	//}
?>
