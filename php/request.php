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
        case 'DELETE_MESSAGE':
            $query = "DELETE FROM `message` WHERE `message_serial`=" . $obj->content->message_serial;
            mysql_query($query, $con) or throw_exception(mysql_error());
            break;
        case 'GET_MY_MESSAGE':
            $query = "SELECT * FROM `message` WHERE `receiver`=" . $_COOKIE['user_serial'];
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $a = array();
            while ($o = mysql_fetch_object($result)) {
                array_push($a, $o);
            }
            mysql_free_result($result);
            $response->content = $a;
            break;
        case 'GET_MY_BORROW':
            $query = "SELECT * FROM `product` WHERE `borrower`=" . $_COOKIE['user_serial'];
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $a = array();
            while ($o = mysql_fetch_object($result)) {
                array_push($a, $o);
            }
            mysql_free_result($result);
            $response->content = $a;
            break;
        case 'GET_MY_INVEST':
            $query = "SELECT `transaction`.*, `product`.`amount` AS `total`, `product`.`complete`, `product`.`complete_date`, `product`.`term`, `product`.`name`, `member`.`first_name`, `member`.`last_name`, `member`.`work_status` FROM `transaction` JOIN `product` ON `transaction`.`product_serial` = `product`.`product_serial` JOIN `member` ON `product`.`borrower` = `member`.`user_serial` WHERE `transaction`.`loaner` =" . $_COOKIE['user_serial'] . " ORDER BY `time` DESC";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $a = array();
            while ($o = mysql_fetch_object($result)) {
                array_push($a, $o);
            }
            mysql_free_result($result);
            $response->content = $a;
            break;
        case 'GET_PRODUCT_TRANSACTION':
            $query = "SELECT * FROM `transaction` WHERE `product_serial` =" . $obj->content->product_serial . " ORDER BY `time` DESC";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $a = array();
            while ($o = mysql_fetch_object($result)) {
                array_push($a, $o);
            }
            mysql_free_result($result);
            $response->content = $a;
            break;
        case 'GET_BORROWER':
            $query = "SELECT * FROM `member` WHERE `user_serial`='" . $obj->content->borrower . "'";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $response->content = mysql_fetch_object($result);
            mysql_free_result($result);
            break;
        case 'UPLOADED_IMAGE':
            $names = "";
            $values = "";
            foreach ($obj->content as $name => $value) {
                $names .= "`" . $name . "`, ";
                $values .= "'" . $value . "', ";
            }
            $names = substr($names, 0, -2);
            $values = substr($values, 0, -2);
            $query = "INSERT INTO `image` (" . $names . ") VALUES (" . $values . ")";
            mysql_query($query, $con) or throw_exception(mysql_error());
        case 'GET_MY_IMAGE':
            $query = "SELECT `name`, `what` FROM `image` WHERE `user_serial`=". $_COOKIE['user_serial'];
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $a = array();
            while ($o = mysql_fetch_object($result)) {
                array_push($a, $o);
            }
            mysql_free_result($result);
            $response->content = $a;
            break;
        case 'VIEW_PRODUCT':
            $query = "UPDATE `product` SET `view`=`view`+1 WHERE `product_serial`=" . $obj->content->product_serial;
            mysql_query($query, $con) or throw_exception(mysql_error());
            break;
        case 'CHARGE':
            $query = "UPDATE `member` SET `remain`=`remain`+" . $obj->content->remain . " WHERE `user_serial`=" . $_COOKIE['user_serial'];
            mysql_query($query, $con) or throw_exception(mysql_error());
            $query = "SELECT * FROM `member` WHERE `user_serial`='" . $_COOKIE['user_serial'] . "'";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $response->content = mysql_fetch_object($result);
            mysql_free_result($result);
            break;
        case 'INVEST':
            $query = "UPDATE `product` SET `complete`=`complete`+" . $obj->content->amount . " WHERE `product_serial`=" . $obj->content->product_serial;
            mysql_query($query, $con) or throw_exception(mysql_error());
            $query = "SELECT * FROM `product` WHERE `product_serial`=" . $obj->content->product_serial;
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $tmp = mysql_fetch_object($result);
            if ($tmp->complete >= $tmp->amount) {
                $query = "UPDATE `member` SET `remain`=`remain`+" . $tmp->amount . " WHERE `user_serial`=" . $obj->content->borrower;
                mysql_query($query, $con) or throw_exception(mysql_error());
                $query = "INSERT INTO `message` (`sender`, `receiver`, `type`, `content`) VALUES (0, " . $tmp->borrower . ", 1, '" . $tmp->name . "')";
                mysql_query($query, $con) or throw_exception(mysql_error());
                $query = "UPDATE `product` SET `complete_date`='" . date('Y-m-d') . "' WHERE `product_serial`=" . $obj->content->product_serial;
                mysql_query($query, $con) or throw_exception(mysql_error());
            }
            $query = "UPDATE `member` SET `remain`=`remain`-" . $obj->content->amount . " WHERE `user_serial`=" . $_COOKIE['user_serial'];
            mysql_query($query, $con) or throw_exception(mysql_error());
            $query = "INSERT INTO `transaction` (`loaner`, `product_serial`, `amount`, `rate`) VALUES (" . $_COOKIE['user_serial'];
            $query .= ", " . $obj->content->product_serial . ", " . $obj->content->amount . ", " . $obj->content->rate . ")";
            mysql_query($query, $con) or throw_exception(mysql_error());
            $query = "INSERT INTO `message` (`sender`, `receiver`, `type`, `content`) VALUES (" . $_COOKIE['user_serial'] . ", ";
            $query .= $obj->content->borrower . ", 0, " . $obj->content->amount . ")";
            mysql_query($query, $con) or throw_exception(mysql_error());
        case 'GET_ALL_PRODUCT':
            $query = "SELECT * FROM `product` WHERE `complete` < `amount` ORDER BY `product_serial` DESC";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $a = array();
            while ($o = mysql_fetch_object($result)) {
                array_push($a, $o);
            }
            mysql_free_result($result);
            $response->content = $a;
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
        case 'SIGN_UP':
            $names = "";
            $values = "";
            foreach ($obj->content as $name => $value) {
                $names .= "`" . $name . "`, ";
                $values .= "'" . $value . "', ";
            }
            $names .= "`latest_sign_in`";
            $values .= "NOW()";
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
            $query = "UPDATE `member` SET `latest_sign_in`=NOW() WHERE `user_serial`=" . $response->content->user_serial;
            mysql_query($query, $con) or throw_exception(mysql_error());
            break;
        case 'SUBMIT_PROFILE':
        case 'SET_MEMBER':
            $query = "UPDATE `member` SET ";
            foreach ($obj->content as $name => $value) {
                if ($name === 'asset') {
                    if (is_array($obj->content->asset)) {
                        $value = 0;
                        foreach ($obj->content->asset as $num) {
                            $value += (int) $num;
                        }
                    } else {
                        $value = (int) $obj->content->asset;
                    }
                }
                $query .= "`" . $name . "`='" . $value . "', ";
            }
            $query = substr($query, 0, -2);
            $query .= " WHERE `user_serial`=" . $_COOKIE['user_serial'];
            mysql_query($query, $con) or throw_exception(mysql_error());
        case 'GET_MEMBER':
            $query = "SELECT * FROM `member` WHERE `user_serial`='" . $_COOKIE['user_serial'] . "'";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
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