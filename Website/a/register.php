<?php
	//session_destroy();

	$con = mysql_connect("ec2-54-242-116-188.compute-1.amazonaws.com", "ToiletTalk", "toilet");
	if (!$con)
	{
	  die('Could not connect: ' . mysql_error());
	}

	mysql_select_db("ToiletTalk", $con) 
		or die("Unable to select database:" . mysql_error());
	

	if(isset($_POST['uname'])){
			
        	$uname = $_POST['uname'];
			$fname = $_POST['fname'];
			$lname = $_POST['lname'];
			$pword = $_POST['password'];
			$gender = $_POST['gender'];
			$email= $_POST['email'];
			$slt = '$5$'.mcrypt_create_iv(9, MCRYPT_RAND);
			$hash = crypt($pword, $slt);
			echo "$uname";
			echo "</br>$pword";
			echo "</br> $hash";
			echo "</br> $slt";
			mysql_query("insert into users (username,first_name,last_name,hash,gender,permission,email,salt)
			values ('$uname', '$fname', '$lname','$hash','$gender',0,'$email','$slt')");			
			//header("Location: index.html");
           
        }

	mysql_close($con);
?>