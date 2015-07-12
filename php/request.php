<?php

include 'db_conf.php';

class Response {
    public $title, $content;
    function __construct() {
        $this->title = 'SUCCESS';
    }
}

function throw_exception($msg) {
    throw new Exception($msg);
}

try {
    $response = new Response();
    $obj = json_decode($_POST['request']);
    $con = mysql_connect($host, $user, $pwd);
    mysql_select_db('haizhidai', $con);

    switch ($obj->name) {
        case 'GET_ALL_PRODUCT':
            $query = "SELECT * FROM `product`";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $a = array();
            while ($o = mysql_fetch_object($result)) {
                array_push($a, $o);
            }
            mysql_free_result($result);
            $response->content = $a;
            break;
        case 'GET_PROFILE':
            $query = "SELECT * FROM `member` WHERE `user_serial`=" . $_COOKIE['user_serial'];
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $response->content = mysql_fetch_object($result);
            mysql_free_result($result);
            break;
        case 'SUBMIT_PRODUCT_DETAIL':
            $names = "";
            $values = "";
            foreach ($obj->content as $name => $value) {
                $names .= "`" . $name . "`, ";
                $values .= "'" . $value . "', ";
            }
            $names .= "`borrower`";
            $values .= $_COOKIE['user_serial'];
            $query = "INSERT INTO `product` (" . $names . ") VALUES (" . $values . ")";
            mysql_query($query, $con) or throw_exception(mysql_error());
            break;
        case 'SUBMIT_PROFILE':
            $query = "UPDATE `member` SET ";
            foreach ($obj->content as $name => $value) {
                if ($name === 'asset') {
                    $value = 0;
                    foreach ($obj->content->asset as $num) {
                        $value += (int) $num;
                    }
                }
                $query .= "`" . $name . "`='" . $value . "', ";
            }
            $query = substr($query, 0, -2);
            $query .= " WHERE `user_serial`=" . $_COOKIE['user_serial'];
            mysql_query($query, $con) or throw_exception(mysql_error());
            break;
        case 'SIGN_UP':
            $names = "";
            $values = "";
            foreach ($obj->content as $name => $value) {
                $names .= "`" . $name . "`, ";
                $values .= "'" . $value . "', ";
            }
            $names = substr($names, 0, -2);
            $values = substr($values, 0, -2);
            $query = "INSERT INTO `member` (" . $names . ") VALUES (" . $values . ")";
            mysql_query($query, $con) or throw_exception(mysql_error());
        case 'SIGN_IN':
            $query = "SELECT * FROM `member` WHERE `email`='" . $obj->content->email . "' && `password`='" . $obj->content->password . "' && `authority`='" . $obj->content->authority . "'";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            if (mysql_num_rows($result) === 0) {
                throw_exception('ACCOUNT_NOT_FOUND');
            }
            $response->content = mysql_fetch_object($result);
            mysql_free_result($result);
            break;
        default:
            $response->title = 'ERROR';
            $response->content = 'UNKNOWN_REQUEST';
    }
} catch (Exception $ex) {
    $response->title = 'ERROR';
    $response->content = $ex->getMessage();
}

echo json_encode($response);

?>