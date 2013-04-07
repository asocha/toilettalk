<?php

// Chintan Patel
// ToiletTalkAPIv1

require(APPPATH.'/libraries/REST_Controller.php');

class toilettalkapi extends REST_Controller
{

    function restrooms_get()
    {   
        switch($this->get('from'))
        {
            case "":
                $this->response(NULL, 400);
                break;

            case "nearby":
                $latitude = $_GET['latitude'];
                $longitude = $_GET['longitude'];
                $radius = $_GET['radius'];

                $radius = $radius/69.055;
                $lowerBoarder=$latitude-$radius;
                $upperBoarder=$latitude+$radius;
                $rightBoarder=$longitude-$radius;
                $leftBoarder=$currentLongitude+$radius;
                
                $query = "Select latitude, longitude 
                From restroom 
                Where longitude <= $leftBoarder and longitude >= $rightBoarder and 
                    latitude <= $upperBoarder and latitude >= $lowerBoarder;";

                $results = execute($query);

                $this->response($results, 200);

                break;
        }
    }

    function users_get()
    {
        //$users = $this->some_model->getSomething( $this->get('limit') );
        $users = array(
            array('id' => 1, 'name' => 'Some Guy', 'email' => 'example1@example.com'),
            array('id' => 2, 'name' => 'Person Face', 'email' => 'example2@example.com'),
            3 => array('id' => 3, 'name' => 'Scotty', 'email' => 'example3@example.com', 'fact' => array('hobbies' => array('fartings', 'bikes'))),
        );
        
        if($users)
        {
            $this->response($users, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t find any users!'), 404);
        }
    }
?>