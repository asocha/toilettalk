<?php

$host="localhost"; // Host name
$username="ToiletTalk"; // Mysql username
$password="toilet"; // Mysql password
$db_name="ToiletTalk"; // Database name
$tbl_name="users"; // Table name
//$less_than_long=10.0;
// Connect to server and select databse.
mysql_connect("$host", "$username", "$password")or die("cannot connect");
mysql_select_db("$db_name")or die("cannot select DB");

$result = mysql_query("Select latitude, longitude From restroom Where longitude <= 10.0 and longitude >= 0.0 and latitude <= 10.0 and latitude >= 0.0;") or die(mysql_error());
//$info = mysql_fetch_array( $data );

while($row = mysql_fetch_array($result)){
  echo "Latitude".$row['latitude']. " - ". "Longitude".$row['longitude'];
	echo "<br />";
}
?>
