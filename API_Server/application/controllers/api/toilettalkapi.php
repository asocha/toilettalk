<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * ToiletTalk API v1
 * @package     CodeIgniter
 * @subpackage  Rest Server
 * @category    Controller
 * @author      Chintan Patel
 */

require APPPATH.'/libraries/REST_Controller.php';

class toilettalkapi extends REST_Controller
{
    function test_get()
    {
        $result = array('key' => $this->get('id'), 'parameter' => $this->get('parm')); 
        $this->response($result, 200);
    }

    function test_post()
    {
        $result = array('key' => $this->post('id'), 'parameter' => $this->post('parm')); 
        $this->response($result, 200);
    }

    function response_get()
    {
        if(!$this->get('id'))
        {
            $this->response(NULL, 400);
        }

        else
        {
            $this->db->select('responds_to_id');
            $this->db->where('review_id', $this->get('id'));
            $this->db->group_by("review_id");
            $this->db->order_by("review_id", "desc"); 

            $query = $this->db->get('response');
            $this->response($query->result(), 200);
        }
    }

    function restrooms_get()
    {
        switch($this->get('method'))
        {
            case 'location':
                $currentLatitude = $this->get('latitude');
                $currentLongitude = $this->get('longitude');
                $radius = $this->get('radius');

                $radius = $radius/69.055;
                $lowerBoarder=$currentLatitude-$radius;
                $upperBoarder=$currentLatitude+$radius;
                $rightBoarder=$currentLongitude-$radius;
                $leftBoarder=$currentLongitude+$radius;

                $this->db->where('longitude <= ', $leftBoarder);
                $this->db->where('longitude >= ', $rightBoarder);
                $this->db->where('latitude <= ', $upperBoarder);
                $this->db->where('latitude >= ', $lowerBoarder);

                $query = $this->db->get('restroom');
                $this->response($query->result(), 200);
                break;
        }
    }

    function user_get()
    {
        if(!$this->get('id'))
        {
            $this->response(NULL, 400);
        }



        else
        {
            $this->db->where('user_id', $this->get('id'));

            $query = $this->db->get('users');
            $this->response($query->result(), 200);
        }
    }
    
    function user_post()
    {   $this->db->where('username', $this->post('uname'));

            $test_query = $this->db->get('users');

    if($test_query->num_rows()==0)        
        {    
        $this->db->set('user_id', 'DEFAULT');
        $this->db->set('username', $this->post('uname'));
        $this->db->set('first_name', $this->post('fname'));
        $this->db->set('last_name', $this->post('lname'));
        $this->db->set('hash', $this->post('hash'));
        $this->db->set('gender', $this->post('gender'));
        $this->db->set('permission', $this->post('permission'));
        $this->db->set('email', $this->post('email'));
        $this->db->set('salt', $this->post('salt'));

        $this->db->insert('users');

        $this->response(array('success' => 'true'), 200);
        }
    else
        {
            $this->response(array('success' => 'false'), 409);
        }

    }
    
    function user_delete()
    {
        $this->db->delete('users', array('user_id' =>  $this->get('id'))); 

        $this->response(array('success' => 'true'), 200); // 200 being the HTTP response code
    }
    
    function users_get()
    {
        $query = $this->db->get('users');
        $this->response($query->result(), 200);
    }
    
}
