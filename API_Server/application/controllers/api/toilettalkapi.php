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
    /*
     *  Test Function
     *  Not part of API
     */
    function test_get()
    {
        $result = array('key' => $this->get('id'), 'parameter' => $this->get('parm')); 
        $this->response($result, 200);
    }

    /*
     *  Test Function
     *  Not part of API
     */
    function test_post()
    {
        $result = array('key' => $this->post('id'), 'parameter' => $this->post('parm')); 
        $this->response($result, 200);
    }

    /*
     *  Test Function
     *  Not part of API
     */
    function session_get()
    {
        $result = array('key' => $this->get('id'), 'parameter' => $this->get('parm')); 
        $this->response($this->session->all_userdata(), 200);
    }

    /*
     *  Test Function
     *  Not part of API
     */
    function session_delete()
    {
        $this->session->sess_destroy(); 
        $this->response(array('success' => 'true'), 200);
    }

    /*
     *  Test Function
     *  Not part of API
     */
    function sessions_delete()
    {
        $this->db->truncate('sessions');
        $this->response(array('success' => 'true'), 200);
    }

    /*
     *  Test Function
     *  Not part of API
     */
    function login_post()
    {
        $this->db->select('hash');
        $this->db->select('salt');
        $this->db->where('username', $this->post('uname'));

        $query = $this->db->get('users');

        if(!$query->result()){
            $this->response(array('success' => 'false'), 400);
        }

        else{
            $row = $query->row();

            $hash = $row->hash;
            $slt = $row->salt;

            $tempHash = crypt($this->post('password'), $slt);

            if($hash == $tempHash){

                $userdata = array(
                    'username'  => $this->post('uname'),
                    'logged_in' => TRUE
                );

                $this->session->set_userdata($userdata);

                $this->response(array('success' => 'true'), 200);
            }

            else{
                $this->response(array('success' => 'false'), 200);
            }
        }
    }

    function logout_get()
    {
        $this->session->sess_destroy(); 
        $this->response(array('success' => 'true'), 200);
    }

    function response_get()
    {
        if(!$this->get('id'))
        {
            $this->response(NULL, 400);
        }

        else
        {
            $rrid = $this->get('id');
            $sql = "select * from response where restroom_id = ? order by review_id, responds_to_id";
            
            
            
            /*$this->db->select('responds_to_id');
            $this->db->where('review_id', $this->get('id'));
            $this->db->group_by("review_id");
            $this->db->order_by("review_id", "desc");*/

            $query = $this->db->query($sql, array($rrid));
            $this->response($query->result_array(), 200);
        }
    }

    function restrooms_get()
    {
        $currentLatitude = $this->get('latitude');
        $currentLongitude = $this->get('longitude');
        $radius = $this->get('radius');

        $radius = $radius/69.055;
        $lowerBoarder=$currentLatitude-$radius;
        $upperBoarder=$currentLatitude+$radius;
        $rightBoarder=$currentLongitude+$radius;
        $leftBoarder=$currentLongitude-$radius;

        $sql = "select rr.restroom_id, rr.latitude, rr.longitude, ar.final_average, sum(diaper_changing_station), sum(handicap_accessib$
                from restroom rr, icons i, avg_ratings ar, response re 
                where ar.restroom_id = rr.restroom_id and re.review_id = i.review_id and rr.restroom_id = re.restroom_id and 
                rr.latitude >= ? and rr.latitude <= ? and rr.longitude >= ? and rr.longitude <= 
                ? group by rr.restroom_id;";
        $query = $this->db->query($sql, array($lowerBoarder, $upperBoarder, $leftBoarder, $rightBoarder));
        $this->response($query->result(), 200);
        break;
        
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
    
    function user_post(){   

        $this->db->where('username', $this->post('uname'));
        $test_query = $this->db->get('users');

        //$slt = '$5$'.mcrypt_create_iv(5, MCRYPT_RAND);
        //$slt = '$5$'.mcrypt_create_iv(40, MCRYPT_RAND);
        $slt = '$5$';
        $hash = crypt($this->post('password'), $slt);

        if($test_query->num_rows()==0)        
        {       
    		$this->db->set('user_id', 'DEFAULT');
    		$this->db->set('username', $this->post('uname'));
    		$this->db->set('first_name', $this->post('fname'));
    		$this->db->set('last_name', $this->post('lname'));
    		$this->db->set('hash', $hash);
    		$this->db->set('gender', $this->post('gender'));
    		$this->db->set('permission', $this->post('permission'));
    		$this->db->set('email', $this->post('email'));
    		$this->db->set('salt', $slt);

    		$this->db->insert('users');
            $this->response($slt, 200);
    		//$this->response(array('success' => 'true'), 200);
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
