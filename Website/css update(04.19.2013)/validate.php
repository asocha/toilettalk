<?php
	session_destroy();

	$con = mysql_connect("ec2-54-242-116-188.compute-1.amazonaws.com", "ToiletTalk", "toilet");
	if (!$con)
	{
	  die('Could not connect: ' . mysql_error());
	}

	mysql_select_db("ToiletTalk", $con) 
		or die("Unable to select database:" . mysql_error());
	

	if(isset($_POST['uname'])){

        	$uname = $_POST['uname'];
        	$password = $_POST['password'];
		$saltquery = mysql_query("select salt from users where username='$uname'");
		$salt = mysql_result($saltquery, 0);
		$hash = crypt($password, $salt);

		//$query = "select * from users where username='$uname' and hash='$hash'";
		$query = "select * from users where username='$uname'";
		$result = mysql_query($query);

		if(mysql_num_rows($result) == 1)
		{
			session_start();
			$_SESSION['username'] = $uname;
			echo "$hash";
			$hash2 = crypt($password, $salt);
			echo "<br>$hash2";
			//header("Location: index.html");
		}

		else
		{	
			header("Location: index.html");
		}
           
        }

	mysql_close($con);
?>