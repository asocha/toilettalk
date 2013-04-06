<?php

$host="localhost"; // Host name
$username="ToiletTalk"; // Mysql username
$password="toilet"; // Mysql password
$db_name="ToiletTalk"; // Database name
$tbl_name="users"; // Table name
//$less_than_long=10.0;
// Connect to server and select database.
/*
$review_id=$_POST['review_id'];
*/
$review_id=1;
mysql_connect("$host", "$username", "$password")or die("cannot connect");
mysql_select_db("$db_name")or die("cannot select DB");

$result = mysql_query("select responds_to_id from response where review_id = 1 group by responds_to_id order by responds_to_id desc;") or die(mysql_error());
//$info = mysql_fetch_array( $data );

while($row = mysql_fetch_array($result)){
  echo "responds_to_id-".$row['responds_to_id'];
	echo "<br />";
}
?>
