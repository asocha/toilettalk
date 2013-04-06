<?php
$host="localhost"; // Host name
$username="ToiletTalk"; // Mysql username
$password="toilet"; // Mysql password
$db_name="ToiletTalk"; // Database name
$tbl_name="restroom"; // Table name

/*$user_id=$_POST['user_id'];
$avg_rating=$_POST['avg_rating'];
$latitude=$_POST['latitude'];
$longitude=$_POST['longitude'];
//$info = mysql_fetch_array( $data );*/
$user_id=123;
$avg_rating=4.5;
$latitude=30.000;
$longitude=9.0000;
//$info = mysql_fetch_array( $data );

mysql_connect("$host", "$username", "$password")or die("cannot connect");
mysql_select_db("$db_name")or die("cannot select DB");
$sql="insert into restroom (user_id, avg_rating, latitude, longitude) values('$user_id', '$avg_rating', '$latitude', '$longitude')";
$ok = mysql_query($sql);

if($ok)
{echo "Success";}
else
{echo "failure";}
?>
