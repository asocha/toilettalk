<?php
$host="localhost"; // Host name
$username="ToiletTalk"; // Mysql username
$password="toilet"; // Mysql password
$db_name="ToiletTalk"; // Database name
$tbl_name="users"; // Table name
mysql_connect("$host", "$username", "$password")or die("cannot connect");
mysql_select_db("$db_name")or die("cannot select DB");

/*$user_id=$_POST['user_id'];
$username=$_POST['username'];
$firstname=$_POST['firstname'];
$lastname=$_POST['lastname'];
$password=$_POST['password'];
$gender=$_POST['gender'];
$permission=$_Post['permission'];
//$info = mysql_fetch_array( $data );*/

$sql="insert into users values(3, 'joel', 'collin', 'dobmeyer', 'password_1', 1, 3);";
$ok = mysql_query($sql);
if($ok)
{echo "Success";}
else
{echo "failure";}
?>
