<?php
$host="localhost"; // Host name
$username="ToiletTalk"; // Mysql username
$password="toilet"; // Mysql password
$db_name="ToiletTalk"; // Database name
$tbl_name="restroom"; // Table name

/*
$responds_to_id =$_POST['responds_to_id']
$user_id=$_POST['user_id'];
$user_comments=$_POST['user_comments'];
$gender=$_POST['gender'];
$flags=$_POST['flags'];
$thumbs_up=$_POST['thumbs_up'];
$thumbs_down=$_POST['thumbs_down'];
$time_stamp=$_POST['time_stamp'];
$review_star_rating=$_POST['review_star_rating'];
$restroom_id=$_POST['restroom_id'];
//$info = mysql_fetch_array( $data );*/
$responds_to_id=0;
$user_id=123;
$user_comments='hello this is a comment';
$gender=1;
$flags=0;
$thumbs_up=0;
$thumbs_down=0;
$time_stamp=CURRENT_TIMESTAMP;
$review_star_rating=0;
$restroom_id=1;

//$info = mysql_fetch_array( $data );

mysql_connect("$host", "$username", "$password")or die("cannot connect");
mysql_select_db("$db_name")or die("cannot select DB");
$sql="insert into response (responds_to_id, user_id, user_comments, gender, flags, thumbs_up, thumbs_down, time_stamp, review_star_rating, restroom_id) Values( '$responds_to_id', '$user_id', '$user_comments', '$gender', '$flags', '$thumbs_up', '$thumbs_down', '$time_stamp', '$review_star_rating', '$restroom_id');";
$ok = mysql_query($sql);

if($ok)
{echo "Success";}
else
{echo "failure";}
?>
