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
    {
        //$this->some_model->updateUser( $this->get('id') );
        $message = array('id' => $this->get('id'), 'name' => $this->post('name'), 'email' => $this->post('email'), 'message' => 'ADDED!');
        
        $this->response($message, 200); // 200 being the HTTP response code
    }
    
    function user_delete()
    {
        //$this->some_model->deletesomething( $this->get('id') );
        $message = array('id' => $this->get('id'), 'message' => 'DELETED!');
        
        $this->response($message, 200); // 200 being the HTTP response code
    }
    
    function users_get()
    {
        $query = $this->db->get('users');
        $this->response($query->result(), 200);
    }


    public function send_post()
    {
        var_dump($this->request->body);
    }


    public function send_put()
    {
        var_dump($this->put('foo'));
    }
}