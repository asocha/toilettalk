<?php
  function insert_route($user_id, $origin, $destination, ) { 
    $con = mysql_connect('ec2-54-242-116-188.compute-1.amazonaws.com','ToiletTalk','toilet');
    mysql_select_db('ToiletTalk');
    if (!$con)
    {
      die('Could not connect: ' . mysql_error());
    }
    $query="insert into routes(user_id, origin, destination) values ('$user_id', '$origin', '$destination');";
    $result = mysqli_query($sql);
    if($result) { return true; }
    else { return false; }
  }
  insert_route(789, '3456 fiction ave. 75206', '5555 E mockingbird ln 75206');
  
?>
