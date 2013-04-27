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
     function restroomtotal_post() {
        $sqlrr = "insert into restroom(user_id, avg_rating, latitude, longitude, name, address) values(?,0,?,?,?,?);";
        $query = $this->db->query($sqlrr, array($this->post('uid'),$this->post('lat'),$this->post('long'),$this->post('name')
        ,$this->post('address')));
        $sqli = "insert into icons values (?,?,?,?,?,?);";
        $query = $this->db->query($sqli, array($this->post('rrid'),$this->post('dcs'),$this->post('ha'),$this->post('unisex'),
        $this->post('co'),$this->post('24')));
        $sqlim = "insert into Images(image_type, image, image_size, image_category, image_name) 
                values(?,?,?,?,?)";
        $this->db->query($sqlim, array($this->post('imgtype'),$this->post('img'),$this->post('imgsize'),$this->post('imgcategory'),
        $this->post('imgname')));
    }
    function delimg_post() {
        $sql = "delete from images where image_id = ?;";
        $this->db->query($sql, $this->post('imgid'));
    }
    function images_get() {
        $sql = "select * from images where restroom_id = ?;";
        $query = $this->db->query($sql, $this->post('rrid'));
        $this->response($query->result(), 200);
    }
     function delrrforroute_post() {
        $sql = "delete from restrooms_for_route where route_id = ? and restroom_id = ?";
        $query = $this->db->query($sql, array($this->post('roid'),$this->post(rrid)));
        $this->response(200);
    }
    function delroute_post() {
            $sql = "delete from routes where route_id = ?";
            $query = $this->db->query($sql, $this->post('roid'));
            $this->response(200);
    }
    function delsavedrestroom_post() {
            $sql = "delete from saved_resrooms where restroom_id=? and user_id=?";
            $query = $this->db->query($sql, array($this->post('rrid'),$this->post(uid)));
            $this->response(200);
    }
    function deluser_post() {
            $sql = "delete from users where user_id = ?";
            $query = $this->db->query($sql, $this->post('uid'));
            $this->response(200);
    }
    function delrestroom_post() {
            $sql = "delete from restroom where restroom_id = ?";
            $query = $this->db->query($sql, $this->post('rrid'));
            $this->response(200);
    }
    function delresponse_post() {
            $sql = "delete from response where review_id = ? and responds_to_id = ?";
            $query = $this->db->query($sql, array($this->post('rid'),$this->post('rtid')));
            $this->response(200);
    }
     function saverestroom_post() {
        $sql = "insert into saved_restrooms(restroom_id, user_id) values(?,?);";
        $query = $this->db->query($sql, array($this->post('rrid'), $this->post('uid')));
        $this->response(200);
    }

    function restroom_post() {
        $uid = $this->session->userdata('user_id');
        if($uid == NULL) {
            $uid = 0;
        }
        $sql = "insert into restroom(user_id, avg_rating, latitude, longitude, name, address) values(?,0,?,?,?,?);";
        $this->db->query($sql, array($uid,$this->post('lat'),$this->post('long'),$this->post('name'),$this->post('address')));
        $query = $this->db->query("select LAST_INSERT_ID() as id;");
        $rrid = $query->row('id');
        
        $sql = "insert into response(responds_to_id, user_id, user_comments, gender, flags, 
                    thumbs_up, thumbs_down, time_stamp, review_star_rating, restroom_id) 
                    values(?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?, $rrid);";
        
        $gender = $this->session->userdata('gender');
        if($gender == NULL) {
            $gender = 0;
        }
        
        if($this->post('respondstoid') == NULL){
            $respondstoid = 0;
        }
        else{
            $respondstoid = $this->post('respondstoid');
        }
        
        $this->db->query($sql, array($respondstoid, $uid,
                        $this->post('usercomments'),$gender,
                        0,0,0,$this->post('reviewstarrating')
                        ));

        $query = $this->db->query("select LAST_INSERT_ID() as id;");
        $reid = $query->row('id');

        $sql = "insert into icons values (?,?,?,?,?,?);";
        $query = $this->db->query($sql, array($reid,$this->post('dcs'),$this->post('ha'),$this->post('unisex'),$this->post('co'),$this->post('24')));

        $base64Image = $this->post('image');
        $decoded=base64_decode($base64Image);

        $randomString = $this->generateName();
        $filename = 'img/';
        $filename .= $randomString;
        $filename .= '.png';
        file_put_contents($filename,$decoded);

        $sql = "insert into images(filepath, restroom_id, user_id, review_id) values(?,?,?,?)";
        $this->db->query($sql, array($filename,$rrid,$uid,$reid));

        $this->response(array('success' => 'true'), 200);
    }

    function icons_post() {
        $sql = "insert into icons values (?,?,?,?,?,?);";
        $query = $this->db->query($sql, array($this->post('rrid'),$this->post('dcs'),$this->post('ha'),$this->post('unisex'),
                $this->post('co'),$this->post('24')));
        $this->response(200);


    }
     function thumbs_post() {
        if($this->post('up') == 1) {
            $sql = "update response set thumbs_up = thumbs_up + 1 where review_id = ? and responds_to_id = ?;";
            $query = $this->db->query($sql, array($this->post('reviewid'), $this->post('respondstoid')));
            $this->response(200);
        }
        else {
            $sql = "update response set thumbs_down = thumbs_down + 1 where review_id = ? and responds_to_id = ?;";
            $query = $this->db->query($sql, array($this->post('reviewid'), $this->post('respondstoid')));
            $this->response(200);
        }
}
     function promoteadmin_post() {
        $sql = "update users set permission = 3 where user_id = ?;";
        $query = $this->db->query($sql, $this->post('id'));
        $this->response(200);
     }
     function saveresponse_post() {
        if($this->post('reviewid') != NULL) {
                $sql = "insert into response(review_id, responds_to_id, user_id, user_comments, gender, flags, 
                        thumbs_up, thumbs_down, time_stamp, review_star_rating, restroom_id) 
                        values(?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?);";
                $query = $this->db->query($sql, array(
                                $this->post('reviewid'),$this->post('respondstoid'),$this->post('userid'),
                                $this->post('usercomments'),$this->post('gender'),
                                0,0,0,$this->post('reviewstarrating'),$this->post('rrid')
                                ));
        }
        else {
                $sql = "insert into response(responds_to_id, user_id, user_comments, gender, flags, 
                        thumbs_up, thumbs_down, time_stamp, review_star_rating, restroom_id) 
                        values(?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?);";
                $query = $this->db->query($sql, array($this->post('respondstoid'),$this->post('userid'),
                                $this->post('usercomments'),$this->post('gender'),
                                0,0,0,$this->post('reviewstarrating'),$this->post('rrid')
                                ));
                $query = $this->db->query("select LAST_INSERT_ID();");
                $this->response($query->result());
        }
    }
    function latestreview_get() {
        $query = $this->db->query("select re.time_stamp as date, rr.longitude, rr.latitude, re.user_comments,rr.restroom_id
            from response re, restroom rr 
            where re.responds_to_id = 0 and rr.restroom_id = re.restroom_id 
            order by time_stamp desc
            limit 1;");
        $this->response($query->result(), 200);
    }
    function restroombyuid_get()
    {
        $sql = "select rr.restroom_id,rr.latitude,rr.longitude, rr.name, rr.address
                from restroom rr 
                where rr.user_id = ?;";
        $query = $this->db->query($sql, array($this->get('uid')));
        $this->response($query->result(), 200);
        break;
    }
    function reviewno_get() {
        $query =  $this->db->query("select count(review_id) as numofreviews from response;");
        $this->response($query->result(), 200);
    }
    function userno_get() {
        $query = $this->db->query("select count(*) as registeredusers from users;");
        $this->response($query->result(), 200);
    }
    function rrforroute_get() {
        if(!$this->get('id'))
        {
            $this->response(NULL, 400);
        }
        else
        {
            $sql = "select rfr.route_id, rfr.restroom_id, rr.latitude, rr.longitude from restroom rr, restrooms_for_route rfr where rfr.route_id = ? and rfr.restroom_id = rr.restroom_id;";
            $query = $this->db->query($sql, $this->get('rid'));
            $this->response($query->result(), 200);
        }
    }
    function routesbyid_get() {
        if(!$this->get('id'))
        {
            $this->response(NULL, 400);
        }
        else
        {
            $sql = "select * from routes where user_id = ?;";
            $query = $this->db->query($sql, $this->get('id'));
            $this->response($query->result(), 200);
        }
    }
    function test_get()
    {
        $result = array('key' => $this->get('id'), 'parameter' => $this->get('parm')); 
        $this->response($result, 200);
    }
    function saveroute_post() {
        if(!$this->post('id'))
        {
            $this->response(NULL, 400);
        }
        else
        {
            $sql = "insert into routes(user_id, origin, destination) values(?,?,?);";
            $query = $this->db->query($sql, array($this->post('id'), $this->post('origin'), $this->post('destination')));
            $query = $this->db->query("select LAST_INSERT_ID();");
            $this->response($query->result());
        }
    }
    function restroombyid_get()
    {
        $sql = "select rr.restroom_id, rr.latitude, rr.name, rr.address, rr.longitude, ar.final_average, 
                sum(diaper_changing_station),sum(handicap_accessible), sum(unisex), sum(customer_only), sum(24_hour) 
                from restroom rr, icons i, avg_ratings ar, response re 
                where ar.restroom_id = rr.restroom_id and re.review_id = i.review_id and rr.restroom_id = re.restroom_id and 
                rr.restroom_id = ?;";
        $query = $this->db->query($sql, array($this->get('rrid')));
        $this->response($query->result(), 200);
        break;
    }
    function routerr_post() {
        if(!$this->post('id'))
        {
            $this->response(NULL, 400);
        }
        else
        {
            $sql = "insert into restrooms_for_route(route_id, restroom_id) values(?,?);";
            $query = $this->db->query($sql, array($this->post('roid'), $this->post('rrid')));
            $this->response($query, 200);
        }
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
        $this->db->select('user_id');
        $this->db->select('permission');
        $this->db->select('gender');
        $this->db->where('username', $this->post('uname'));

        $query = $this->db->get('users');

        if(!$query->result()){
            $this->response(array('success' => 'false'), 400);
        }

        else{
            $row = $query->row();

            $gender = $row->gender;
            $hash = $row->hash;
            $slt = $row->salt;
            $user_id= $row->user_id;
            $permission=$row->permission;
            //$slt = '$5$';
            $tempHash = crypt($this->post('password'), $slt);

            if($hash == $tempHash &&$this->post('uname')&&$this->post('password')){

                $userdata = array(
                    'username'  => $this->post('uname'),
                    'logged_in' => TRUE ,
                    'user_id'=> $user_id,
                    'permission'=> $permission,
                    'gender' => $gender
                );

                $this->session->set_userdata($userdata);

                $this->response(array('success' => 'true'), 200);
            }

            else{
                $this->response(array('success' => 'false'), 200);
            }
        }
    }
    function savedrestrooms_get() {
        if(!$this->get('id')) {
                $udata = unserialize($this->session->all_userdata());
                $sql = "select restroom_id as saved_restrooms from saved_restrooms where user_id = ?;";
                $query = $this->db->query($sql, $udata['user_id']);
                $this->response($udata['user_id'], 200);
        }
        else {
            $sql = "select restroom_id as saved_restrooms from saved_restrooms where user_id = ?;";
            $query = $this->db->query($sql, array($this->get('id')));
            $this->response($query->result(), 200);
        }
    }
    function logout_get()
    {
        $this->session->sess_destroy(); 
        $this->response(array('success' => 'true'), 200);
    }

    function response_get()
    {
        $rrid = $this->get('rrid');
        $sql = "select * from response where restroom_id = ? order by review_id, responds_to_id";
        $query = $this->db->query($sql, array($rrid));
        $this->response($query->result_array(), 200);
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
        $sql = "select rr.restroom_id, rr.latitude, rr.longitude, ar.final_average, rr.address, rr.name, sum(diaper_changing_station), 
                sum(handicap_accessible), sum(unisex), sum(customer_only), sum(24_hour) 
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
            $sql = "select username, first_name, last_name, gender, permission, email from users where user_id = ?;";
            $query = $this->db->query($sql, $this->get('id'));
            $this->response($query->result(), 200);
        }
    }
    
    function user_post(){   

        $this->db->where('username', $this->post('uname'));
        $test_query = $this->db->get('users');

        $slt = '$5$'.mcrypt_create_iv(40, MCRYPT_RAND);
        $hash = crypt($this->post('password'), $slt);

        if($test_query->num_rows()==0&&$this->post('uname')&&$this->post('fname')&&$this->post('lname')&&$this->post('gender')&&$this->post('email'))        
        {
            $this->db->set('user_id', 'DEFAULT');
            $this->db->set('username', $this->post('uname'));
            $this->db->set('first_name', $this->post('fname'));
            $this->db->set('last_name', $this->post('lname'));
            $this->db->set('hash', $hash);
            $this->db->set('gender', $this->post('gender'));
            $this->db->set('permission', 1);
            $this->db->set('email', $this->post('email'));
            $this->db->set('salt', $slt);

            $this->db->insert('users');

            $this->response(array('success' => 'true'), 200);
        }
        
        else
        {
            $this->response(array('success' => 'false'), 409);
        }

    }
    function allusers_get()
    {
            $sql = "select username, user_id from users ";
            $query = $this->db->query($sql, $this->get('id'));
            $this->response($query->result(), 200);
        
    }
    function allrestroom_get()
    {
            $sql = "select restroom_id, latitude,longitude from restroom ";
            $query = $this->db->query($sql, $this->get('id'));
            $this->response($query->result(), 200);
        
    }
    function allresponse_get()
    {
            $sql = "select review_id,responds_to_id,user_comments  from response ";
            $query = $this->db->query($sql, $this->get('id'));
            $this->response($query->result(), 200);
        
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
    
    function generateName()
    {
        $chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        $length = strlen($chars) - 1;
        $filename = '';
        for($i = 0; $i < $length; $i++)
        {
            $filename .= $chars[mt_rand(0, $length-1)];
        }

        return $filename;
    }

    function uploadimage_post()
    {
        $base64Image = $this->post('image');
        $decoded=base64_decode($base64Image);

        $filename = 'img/';
        $filename .= $this->generateName();
        $filename .= '.png';
        file_put_contents($filename,$decoded);

        $this->response(array('success' => 'true', "filename" => $filename), 200);
    }
}
