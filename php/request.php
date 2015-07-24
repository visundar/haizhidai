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
        case 'GET_NUM_FOCUS_MY_PRODUCT':
        $query = "SELECT `view` FROM `product` WHERE `borrower`=" . $_COOKIE['user_serial'];
        $result = mysql_query($query, $con) or throw_exception(mysql_error());
        $response->content = 0;
        while ($o = mysql_fetch_object($result)) {
            $response->content += (int) $o->view;
        }
        break;
        case 'GET_FORUM_GLOBAL':
            $query = "SELECT COUNT(*) AS total_member FROM `member`";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $response->content = mysql_fetch_object($result);
            $query = "SELECT COUNT(*) AS total_post FROM `post`";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $o = mysql_fetch_object($result);
            $response->content->total_post = $o->total_post;
            break;
        case 'SUBMIT_LIKE':
            $query = "UPDATE `member` SET `like`=`like`+(" . $obj->content->like . ") WHERE `user_serial`=" . $obj->content->user_serial;
            mysql_query($query, $con) or throw_exception(mysql_error());
            break;
        case 'GET_POST_AND_REPLY':
            $response->content = array();
            $query = "SELECT `content`, `time`, `user_serial` FROM `post` WHERE `post_serial`=" . $obj->content->post_serial;
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            array_push($response->content, mysql_fetch_object($result));
            $query = "SELECT `content`, `time`, `user_serial` FROM `reply` WHERE `post_serial`=" . $obj->content->post_serial;
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            while ($o = mysql_fetch_object($result)) {
                array_push($response->content, $o);
            }
            for ($i = 0; $i < count($response->content); $i += 1) {
                $query = "SELECT `first_name`, `last_name`, `num_post`, `num_reply`, `like` FROM `member` WHERE `user_serial`=" . $response->content[$i]->user_serial;
                $result = mysql_query($query, $con) or throw_exception(mysql_error());
                $o = mysql_fetch_object($result);
                $response->content[$i]->first_name = $o->first_name;
                $response->content[$i]->last_name = $o->last_name;
                $response->content[$i]->num_post = $o->num_post;
                $response->content[$i]->num_reply = $o->num_reply;
                $response->content[$i]->like = $o->like;
            }
            break;
        case 'GET_POPULAR_POST':
            $query = "SELECT * FROM `post` ORDER BY `latest_reply` DESC LIMIT 50";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $response->content = array();
            while ($o = mysql_fetch_object($result)) {
                array_push($response->content, $o);
            }
            $query = "SELECT `post_serial`, COUNT(*) AS num FROM `reply` GROUP BY `post_serial`";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $map = array();
            while ($o = mysql_fetch_object($result)) {
                $map[(int) $o->post_serial] = (int) $o->num;
            }
            for ($i = 0; $i < count($response->content); $i += 1) {
                $response->content[$i]->num_replies = (isset($map[(int) $response->content[$i]->post_serial]) ? $map[(int) $response->content[$i]->post_serial] : 0);
            }
            break;
        case 'SUBMIT_REPLY':
            $query = "INSERT INTO `reply` (`user_serial`, `content`, `post_serial`) VALUES (" . $_COOKIE['user_serial'];
            $query .= ", '" . $obj->content->content . "', " . $obj->content->post_serial . ")";
            mysql_query($query, $con) or throw_exception(mysql_error());
            $query = "UPDATE `member` SET `num_reply`=`num_reply`+1 WHERE `user_serial`=" . $_COOKIE['user_serial'];
            mysql_query($query, $con) or throw_exception(mysql_error());
            $query = "UPDATE `post` SET `latest_reply`=NOW() WHERE `post_serial`=" . $obj->content->post_serial;
            mysql_query($query, $con) or throw_exception(mysql_error());
            break;
        case 'SUBMIT_POST':
            $query = "INSERT INTO `post` (`time`, `title`, `user_serial`, `content`, `latest_reply`) VALUES (NOW(), '";
            $query .= $obj->content->title . "', " . $_COOKIE['user_serial'] . ", '" . $obj->content->content;
            $query .= "', NOW())";
            mysql_query($query, $con) or throw_exception(mysql_error());
            $query = "UPDATE `member` SET `num_post`=`num_post`+1 WHERE `user_serial`=" . $_COOKIE['user_serial'];
            mysql_query($query, $con) or throw_exception(mysql_error());
            break;
        case 'GET_MY_FRIEND':
            $response->content = array();
            $query = "SELECT `content`, `receiver` FROM `message` WHERE `type`=2 && `sender`=" . $_COOKIE['user_serial'];
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            while ($o = mysql_fetch_object($result)) {
                ereg('.*\|([0-9]+)', $o->content, $regs);
                if ($regs[1] === '1') {
                    $regs[1] = '2';
                } else if ($regs[1] === '2') {
                    $regs[1] = '1';
                }
                array_push($response->content, array((int) $o->receiver, '', (int) $regs[1], false));
            }
            $query = "SELECT `friend` FROM `member` WHERE `user_serial`=" . $_COOKIE['user_serial'];
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $o = mysql_fetch_object($result);
            $tok = strtok($o->friend, '|');
            while ($tok) {
                ereg('([0-9]+):([0-9]+)', $tok, $regs);
                array_push($response->content, array((int) $regs[1], '', (int) $regs[2], true));
                $tok = strtok('|');
            }
            $serial_list = '';
            foreach ($response->content as $user) {
                $serial_list .= $user[0] . ", ";
            }
            if ($serial_list === '') {
                throw_exception('You have no friend');
            }
            $serial_list = substr($serial_list, 0, -2);
            $query = "SELECT `first_name`, `last_name`, `user_serial` FROM `member` WHERE `user_serial` IN (" . $serial_list . ")";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            while ($o = mysql_fetch_object($result)) {
                for ($i = 0; $i < count($response->content); $i += 1) {
                    if ($response->content[$i][0] === (int) $o->user_serial) {
                        $response->content[$i][1] = $o->last_name . $o->first_name;
                    }
                }
            }
            break;
        case 'GET_AUTHEN':
            $query = "SELECT `what`, `time` FROM `image` WHERE `user_serial`=" . $obj->content->user_serial;
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $response->content = (object) array('credit'=>false, 'identity'=>false, 'work'=>false, 'income'=>false, 'building'=>false, 'car'=>false, 'marriage'=>false);
            while ($o = mysql_fetch_object($result)) {
                if ($o->what === '11') {
                    $response->content->credit = true;
                    $response->content->credit_time = $o->time;
                } else if ($o->what === '0') {
                    $response->content->identity = true;
                    $response->content->identity_time = $o->time;
                } else if ($o->what === '4') {
                    $response->content->work = true;
                    $response->content->work_time = $o->time;
                } else if ($o->what === '6') {
                    $response->content->income = true;
                    $response->content->income_time = $o->time;
                } else if ($o->what === '8') {
                    $response->content->building = true;
                    $response->content->building_time = $o->time;
                } else if ($o->what === '9') {
                    $response->content->car = true;
                    $response->content->car_time = $o->time;
                } else if ($o->what === '1') {
                    $response->content->marriage = true;
                    $response->content->marriage_time = $o->time;
                }
            }
            break;
        case 'INVITE_FRIEND':
            $query = "SELECT * FROM `member` WHERE `email`='" . $obj->content->email . "'";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            if (mysql_num_rows($result) === 0) {
                throw_exception('Friend not found');
            }
            $o = mysql_fetch_object($result);
            $query = "SELECT * FROM `message` WHERE `type`=2 && `receiver`=" . $o->user_serial;
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            if (mysql_num_rows($result) > 0) {
                throw_exception('Friend has been invited');
            }
            $query = "INSERT INTO `message` (`sender`, `receiver`, `type`, `content`) VALUES (" . $_COOKIE['user_serial'] . ", ";
            $query .= $o->user_serial . ", 2, '" . $_COOKIE['first_name'] . "|" . $obj->content->relation . "')";
            mysql_query($query, $con) or throw_exception(mysql_error());
            mysql_free_result($result);
            break;
        case 'ADD_FRIEND':
            $query = "SELECT `message`.*, `member`.`first_name` FROM `message` JOIN `member` ON `message`.`receiver` = `member`.`user_serial` WHERE `message_serial`=" . $obj->content->message_serial;
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $tmp = mysql_fetch_object($result);
            strtok($tmp->content, '|');
            $relation = strtok('|');
            $response->content = array();
            $query = "UPDATE `member` set `friend`=CONCAT(`friend`, '" . $tmp->sender . ":" . $relation . "|') WHERE `user_serial`=" . $tmp->receiver;
            mysql_query($query, $con) or throw_exception(mysql_error());
            if ($relation === '1') {
                $relation = '2';
            } else if ($relation === '2') {
                $relation = '1';
            }
            $query = "UPDATE `member` set `friend`=CONCAT(`friend`, '" . $tmp->receiver . ":" . $relation . "|') WHERE `user_serial`=" . $tmp->sender;
            mysql_query($query, $con) or throw_exception(mysql_error());
            $query = "INSERT INTO `message` (`sender`, `receiver`, `type`, `content`) VALUES (0, " . $tmp->sender . ", 3, '" . $tmp->first_name . "')";
            mysql_query($query, $con) or throw_exception(mysql_error());
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
        case 'GET_NUM_BORROW':
            $query = "SELECT * FROM `product` WHERE `borrower`='" . $obj->content->borrower . "'";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $response->content = (object) array('total'=>0, 'complete'=>0);
            while ($o = mysql_fetch_object($result)) {
                $response->content->total += 1;
                if (((int) $o->amount) === ((int)$o->complete)) {
                    $response->content->complete += 1;
                }
            }
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
            $query = "UPDATE `member` set `has_photo`=1 WHERE `user_serial`=" . $_COOKIE['user_serial'];
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
        case 'CASH':
            $query = "UPDATE `member` SET `remain`=`remain`-" . $obj->content->remain . " WHERE `user_serial`=" . $_COOKIE['user_serial'];
            mysql_query($query, $con) or throw_exception(mysql_error());
            $query = "SELECT * FROM `member` WHERE `user_serial`='" . $_COOKIE['user_serial'] . "'";
            $result = mysql_query($query, $con) or throw_exception(mysql_error());
            $response->content = mysql_fetch_object($result);
            mysql_free_result($result);
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
