/*global $, jQuery, alert*/
/*jslint forin: true*/
var STATES = ['北京', '上海', '天津', '重庆', '河北', '山西', '内蒙古自治区', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西壮族自治区', '海南', '四川', '贵州', '云南', '西藏自治区', '陕西', '甘肃', '青海', '宁夏回族自治区', '新疆维吾尔自治区', '其他'];
var STORES = ['淘宝网', '拍拍网', '阿里巴巴', '京东', '一号店', '当当网', '敦煌', '其他'];
var FILE_ATTR = ['身份证', '结婚证', '营业执照', '劳动合同', '工牌、名片、工作证', '社保', '工资卡/常用银行流水', '学生证/一卡通', '房产证', '行驶证', '支付宝截图', '个人信用报告', '信用卡对账单', '学历学位证书', '其他所有贷款协议/凭证'];
var FILE_DESC = ['二代身份证正反面各一张，本人手持身份证合照一张，共3张。', '本人结婚证，包含结婚日期、本人及配偶所有信息。', '营业执照照片或工商网站截图，必须清晰显示法人、成立时间、经营范围、经营时间等关键信息。', '本人当前的有效劳动合同，从封面一页一页拍至最后一页。', '个人工作证或单位工牌、名片均可，必须完整显示单位信息及个人信息。', '社保/公积金网站截图，需完整显示本人姓名、身份证、缴费状态、缴费金额等关键信息。', '本人银行卡正反面照片各一张，以及近3个月完整流水打印单或网银流水截屏。工资卡需显示代发工资项。', '个人学生证信息页照片，需完整显示学校信息及个人信息', '房产证的基本信息页及盖章页各一张，共2张。', '正副本照片，需完整显示车辆登记信息及年检信息。', '支付宝账户基本信息页截图和上一年度个人年度对账单截图。', '仅接受人民银行征信中心网络查询的PDF版。', '用户本人信用卡正面照片及对应的近3 个月信用卡（电子或纸质）对账单。', '本人大专及以上学历或学位证书，接受结业证。', '本人其他金融机构的贷款协议或凭证证明。'];
var UPLOAD_URL = 'http://localhost/upload/index.php';
var PRODUCT = [{
        name: '普通借款标',
        suit: '工薪族',
        panel: 'danger',
        condition: [
            '21-55周岁中国大陆公民',
            '手机绑定',
            '有固定工作']
    }, {
        name: '网商用户标',
        suit: '网店卖家',
        panel: 'warning',
        condition: [
            '21-55周岁中国公民',
            '通过网商认证',
            '店铺经营时间满半年']
    }, {
        name: '莘莘学子标',
        suit: '大学生',
        panel: 'info',
        condition: [
            '19-25周岁中国大陆公民',
            '学籍认证',
            '视频认证']
    }];
var BORROW_PROGRESS = ['產品選擇', '基本資料', '資料上传', '資料确认', '審核狀況'];
var PRODUCT_PANEL_STR = function () {
    'use strict';
    /*
<div class="col-md-4">
    <div class="panel">
        <div class="panel-heading"><h4></h4></div>
        <div class="panel-body"></div>
    </div>
</div>
    */
}.toString().slice(38, -4);
var DETAIL_WORKER_STR = function () {
    'use strict';
    /*
<div class="form-group">
    <label class="col-md-2 control-label">*月收入</label>
    <div class="col-md-5">
        <div class="input-group">
            <input type="text" class="form-control" name="income">
              <span class="input-group-addon">万元</span>
        </div>
    </div>
</div>
<div class="form-group">
    <label class="col-md-2 control-label">*单位名称</label>
    <div class="col-md-5">
      <input type="text" class="form-control" name="work_name">
    </div>
</div>
<div class="form-group">
   <label class="col-md-2 control-label">*工作年限</label>
    <div class="col-md-5">
        <select class="form-control" name="work_years" id="work-years">
          <option value="0">1 年已內</option>
          <option value="1">2 年已內</option>
          <option value="2">3 年已內</option>
          <option value="3">4 年(含)以上</option>
        </select>
    </div>
</div>
<div class="form-group">
    <label class="col-md-2 control-label">*单位省份</label>
      <div class="col-md-3">
          <select class="form-control" name="work_state" id="work-state">
            </select>
      </div>
</div>
<div class="form-group">
    <label class="col-md-2 control-label">单位地址</label>
    <div class="col-md-5">
      <input type="text" class="form-control" placeholder="详细地址" name="work_address">
    </div>
</div>
<div class="form-group">
    <label class="col-md-2 control-label">*单位电话</label>
    <div class="col-md-5">
      <input type="text" class="form-control" name="work_phone">
    </div>
</div>
<div class="form-group">
    <label class="col-md-2 control-label">*任职部门</label>
    <div class="col-md-5">
      <input type="text" class="form-control" name="work_department">
    </div>
</div>
<div class="form-group">
    <label class="col-md-2 control-label">*任职职位</label>
    <div class="col-md-5">
      <input type="text" class="form-control" name="work_title">
    </div>
</div>
    */
}.toString().slice(38, -4);
var DETAIL_STUDENT_STR = function () {
    'use strict';
    /*
<div class="form-group">
    <label class="col-md-2 control-label">*学校名称</label>
    <div class="col-md-5">
      <input type="text" class="form-control" id="work_name">
    </div>
</div>
<div class="form-group">
    <label class="col-md-2 control-label">*宿舍电话</label>
    <div class="col-md-5">
      <input type="text" class="form-control" id="work_phone">
    </div>
</div>
    */
}.toString().slice(38, -4);
var DETAIL_STORE_STR = function () {
    'use strict';
    /*
<div class="form-group">
   <label class="col-md-2 control-label">*经营网店</label>
    <div class="col-md-5">
        <select class="form-control" name="work_department">
        </select>
    </div>
</div>
<div class="form-group">
    <label class="col-md-2 control-label">*卖家昵称</label>
    <div class="col-md-5">
      <input type="text" class="form-control" name="work_title">
    </div>
</div>
<div class="form-group">
    <label class="col-md-2 control-label">*店铺链接</label>
    <div class="col-md-5">
      <input type="text" class="form-control" name="work_name">
    </div>
</div>
<div class="form-group">
    <label class="col-md-2 control-label">*月营业额</label>
    <div class="col-md-5">
        <div class="input-group">
            <input type="text" class="form-control" name="income">
              <span class="input-group-addon">万元</span>
        </div>
    </div>
</div>
<div class="form-group">
    <label class="col-md-2 control-label">*经营省份</label>
      <div class="col-md-3">
          <select class="form-control" name="work_state" id="work-state">
            </select>
      </div>
</div>
<div class="form-group">
    <label class="col-md-2 control-label">经营地址</label>
    <div class="col-md-5">
      <input type="text" class="form-control" placeholder="详细地址" name="work_address">
    </div>
</div>
    */
}.toString().slice(38, -4);
var PROFILE_STR = function () {
    'use strict';
    /*
<form class="form-horizontal" id="profile">
    <div class="form-group">
        <label for="name" class="col-md-2 control-label">*姓名</label>
        <div class="col-md-2">
          <input type="text" class="form-control" name="last_name" placeholder="姓">
        </div>
        <div class="col-md-3">
          <input type="text" class="form-control" name="first_name" placeholder="名">
        </div>
    </div>
    <div class="form-group">
        <label for="uid" class="col-md-2 control-label">*身份证</label>
        <div class="col-md-5">
          <input type="text" class="form-control" name="uid" placeholder="身份证">
        </div>
    </div>
    <div class="form-group">
        <label for="cellphone" class="col-md-2 control-label">*手机号</label>
        <div class="col-md-5">
          <input type="text" class="form-control" name="cellphone" placeholder="手机号">
        </div>
    </div>
    <div class="form-group">
       <label for="gender" class="col-md-2 control-label">*性別</label>
        <div class="col-md-5">
            <label class="radio-inline">
              <input type="radio" name="gender" value="1"> 男
            </label>
            <label class="radio-inline">
              <input type="radio" name="gender" value="0"> 女
            </label>
        </div>
    </div>
    <div class="form-group">
        <label for="birth" class="col-md-2 control-label">*生日</label>
        <div class="col-md-5">
          <input type="text" class="form-control" name="birth" placeholder="1990-01-01">
        </div>
    </div>
    <div class="form-group">
       <label for="insurance" class="col-md-2 control-label">*保險</label>
        <div class="col-md-5">
            <label class="radio-inline">
              <input type="radio" name="insurance" value="0"> 无
            </label>
            <label class="radio-inline">
              <input type="radio" name="insurance" value="1"> 有
            </label>
        </div>
    </div>
    <div class="form-group">
       <label for="marriage" class="col-md-2 control-label">*婚姻状况</label>
        <div class="col-md-5">
            <label class="radio-inline">
              <input type="radio" name="marriage" value="0"> 未婚
            </label>
            <label class="radio-inline">
              <input type="radio" name="marriage" value="1"> 已婚
            </label>
            <label class="radio-inline">
              <input type="radio" name="marriage" value="2"> 离异
            </label>
        </div>
    </div>
    <div class="form-group">
       <label for="education" class="col-md-2 control-label">*学历</label>
        <div class="col-md-5">
            <select class="form-control" id="education" name="education">
              <option value="0">初中及以下</option>
              <option value="1">中专</option>
              <option value="2">高中</option>
              <option value="3">大专</option>
              <option value="4">本科</option>
              <option value="5">研究生及以上</option>
            </select>
        </div>
    </div>
    <div class="form-group">
       <label for="child" class="col-md-2 control-label">*子女</label>
        <div class="col-md-5">
            <label class="radio-inline">
              <input type="radio" name="child" value="0"> 无
            </label>
            <label class="radio-inline">
              <input type="radio" name="child" value="1"> 有
            </label>
        </div>
    </div>
    <div class="form-group">
        <label for="home_phone" class="col-md-2 control-label">住宅电话</label>
        <div class="col-md-5">
          <input type="text" class="form-control" name="home_phone" placeholder="住宅电话">
        </div>
    </div>
    <div class="form-group">
        <label for="home_state" class="col-md-2 control-label">*住宅省份</label>
          <div class="col-md-3">
              <select class="form-control" name="home_state" id="home-state">
                </select>
          </div>
    </div>
    <div class="form-group">
        <label for="home_address" class="col-md-2 control-label">住宅地址</label>
        <div class="col-md-5">
          <input type="text" class="form-control" name="home_address" placeholder="详细地址">
        </div>
    </div>
    <div class="form-group">
       <label for="asset" class="col-md-2 control-label">*财力证明</label>
        <div class="col-md-5">
            <label class="checkbox-inline">
              <input type="checkbox" name="asset" value="8"> 我有房
            </label>
            <label class="checkbox-inline">
              <input type="checkbox" name="asset" value="4"> 我有车
            </label>
            <label class="checkbox-inline">
              <input type="checkbox" name="asset" value="2"> 我有存款
            </label>
            <label class="checkbox-inline">
              <input type="checkbox" name="asset" value="1"> 无
            </label>
        </div>
    </div>
    <div class="form-group">
       <div class="col-md-offset-8">
           <button type="button" class="btn btn-info" onclick="edit_profile(this)">編輯</button>
           <button type="button" class="btn btn-success" onclick="submit_borrow_detail()">我已认真填写，下一步</button>
       </div>
    </div>
</form>
    */
}.toString().slice(38, -4);
var FILE_UPLOAD_STR = function () {
    'use strict';
    /*
<table class="table table-bordered table-hover" id="file-list">
    <tr>
        <th class="col-md-2">資料類型</th>
        <th class="col-md-6">說明</th>
        <th class="col-md-1">圖片<br>數量</th>
        <th class="col-md-3">操作</th>
    </tr>
</table>
<p class="text-right">
    <button type="button" class="btn btn-success" onclick="submit_file_upload()">我已认真填写，下一步</button>
</p>
    */
}.toString().slice(38, -4);


(function ($) {
    'use strict';
    $.fn.serializeObject = function () {
        var result = {},
            extend = function (i, element) {
                var node = result[element.name];

                if ('undefined' !== typeof node && node !== null) {
                    if ($.isArray(node)) {
                        node.push(element.value);
                    } else {
                        result[element.name] = [node, element.value];
                    }
                } else {
                    result[element.name] = element.value;
                }
            };

        $.each(this.serializeArray(), extend);
        return result;
    };
}(jQuery));

function clear_all() {
    'use strict';
    $('div#navbar-collapse > ul > li').removeClass('active');
    $('div#modal').html('');
    $('div#content > div').html('');
}

function load_home_page() {
    'use strict';
    clear_all();
    $('div#navbar-collapse > .navbar-right').remove();
    $('div#navbar-collapse').append((function () {
        var name = $.cookie('first_name');
        if (name === undefined) {
            name = 'user' + ('0000' + $.cookie('user_serial')).slice(-4);
        }
        return '<div class="navbar-form navbar-right"><button class="btn btn-default"' +
            'onclick="sign_out()">登出</button></div><ul class="nav navbar-nav navbar-right">' +
            '<li><a>Hi, ' + name + '</a></li></ul>';
    }()));
}

function load_invest_page() {
    'use strict';
    clear_all();
}

function load_borrow_page() {
    'use strict';
    var i, j;
    clear_all();
    $('div#navbar-collapse > ul > li:nth-child(2)').addClass('active');
    for (i = 0; i < BORROW_PROGRESS.length; i += 1) {
        $('div#content > div:nth-child(1)').append('<a class="list-group-item">' + BORROW_PROGRESS[i] + '</a>');
    }
    $('div#content > div:nth-child(1) > a:nth-child(1)').addClass('active');
    for (i = 0; i < PRODUCT.length; i += 1) {
        $('div#content > div:nth-child(2)').append(PRODUCT_PANEL_STR);
        $('div#content > div:nth-child(2) div.panel:last').addClass('panel-' + PRODUCT[i].panel);
        $('div#content > div:nth-child(2) h4:last').html(PRODUCT[i].name);
        $('div#content > div:nth-child(2) div.panel-body:last').append('适用' + PRODUCT[i].suit + '<br><br>');
        $('div#content > div:nth-child(2) div.panel-body:last').append('<small>申请条件</small><ul></ul>');
        for (j = 0; j < PRODUCT[i].condition.length; j += 1) {
            $('div#content > div:nth-child(2) ul:last').append('<li>' + PRODUCT[i].condition[j] + '</li>');
        }
        $('div#content > div:nth-child(2) div.panel-body:last').append('<hr><button class="btn btn-primary col-md-offset-3 col-md-6"' +
                                                                       ' value="' + i + '" onclick="load_borrow_detail_page(this)">立即申請</button>');
    }
}

function load_borrow_detail_page(btn) {
    'use strict';
    var i;
    $('div#content > div:nth-child(1) > a:nth-child(1)').removeClass('active');
    $('div#content > div:nth-child(1) > a:nth-child(2)').addClass('active');
    $('div#content > div:nth-child(2)').html(PROFILE_STR);
    if ($(btn).val() === '0') {
        $(DETAIL_WORKER_STR).insertBefore('form > div.form-group:has(div.col-md-offset-8)');
    } else if ($(btn).val() === '1') {
        $(DETAIL_STORE_STR).insertBefore('form > div.form-group:has(div.col-md-offset-8)');
    } else if ($(btn).val() === '2') {
        $(DETAIL_STUDENT_STR).insertBefore('form > div.form-group:has(div.col-md-offset-8)');
    }
    for (i = 0; i < STATES.length; i += 1) {
        $('select[name="work_state"]').append('<option value="' + i + '">' + STATES[i] + '</option>');
        $('select[name="home_state"]').append('<option value="' + i + '">' + STATES[i] + '</option>');
    }
    for (i = 0; i < STORES.length; i += 1) {
        $('select[name="work_department"]').append('<option value="' + i + '">' + STORES[i] + '</option>');
    }
    if ($.cookie('first_name') !== undefined) {
        $('input, select').attr('disabled', true);
        $.ajax('http://localhost/project/php/request.php', {
            dataType: 'json',
            data: (function () {
                var request = {};
                request.name = 'GET_PROFILE';
                request.content = {};
                return 'request=' + JSON.stringify(request);
            }()),
            type: 'POST',
            success: function (obj) {
                var name, i, a;
                for (name in obj.content) {
                    if (name === 'gender' || name === 'insurance' || name === 'marriage' || name === 'child') {
                        $('input[name="' + name + '"]').val([obj.content[name]]);
                    } else if (name === 'work_state' || name === 'home_state' || name === 'work_years' || name === 'education') {
                        $('select#' + name.replace('_', '-')).val(obj.content[name]);
                    } else if (name === 'asset') {
                        a = [];
                        for (i = 8; i >= 1; i /= 2) {
                            if ((Number(obj.content[name]) & i) > 0) {
                                a.push(i);
                            }
                        }
                        $('input[name="' + name + '"]').val(a);
                    } else {
                        $('input[name="' + name + '"]').val(obj.content[name]);
                    }
                }
            }
        });
    }
}

function load_account_page() {
    'use strict';
    clear_all();
}

function submit_borrow_detail() {
    'use strict';
    var i;
    $.ajax('http://localhost/project/php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {};
            request.name = 'SUBMIT_PROFILE';
            request.content = $('form#profile').serializeObject();
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            $('div#content > div:nth-child(1) > a:nth-child(2)').removeClass('active');
            $('div#content > div:nth-child(1) > a:nth-child(3)').addClass('active');
            $('div#content > div:nth-child(2)').html(FILE_UPLOAD_STR);
            for (i = 0; i < FILE_ATTR.length; i += 1) {
                $('table#file-list').append('<tr><th>' + FILE_ATTR[i] + '</th><td>' + FILE_DESC[i] +
                                            '<a href="">示例圖片</a></td><td>0</td><td>' +
                                            '<input type="file" class="filestyle" data-input="false" accept="image/*" name="image"></td></tr>');
            }
            $(".filestyle").fileinput({
                uploadUrl: UPLOAD_URL,
                language: 'zh',
                maxFilesNum: 1,
                dropZoneEnabled: false
            });
            $(".filestyle").on('fileuploaded', function () {
                $(this).fileinput('clear');
                i = Number($(this).parents('td').prev().text()) + 1;
                $(this).parents('td').prev().text(i);
            });
        }
    });
}

function sign_out() {
    'use strict';
    $.removeCookie('user_serial');
    $.removeCookie('first_name');
    location.reload();
}

function sign_up() {
    'use strict';
    if ($('input#sign-up-email').val() === '') {
        alert('請輸入郵箱');
        return;
    } else if ($('input#sign-up-password').val() === '') {
        alert('請輸入密碼');
        return;
    } else if ($('input#sign-up-email').val() !== $('input#sign-up-confirm-email').val()) {
        alert('請檢查郵箱');
        return;
    }
    $.ajax('http://localhost/project/php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {};
            request.name = 'SIGN_UP';
            request.content = $('form#sign-up').serializeObject();
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            if (obj.title === 'ERROR') {
                alert('此帳戶已被使用');
                return;
            }
            $.cookie('user_serial', obj.content.user_serial, null, '/');
            location.reload();
        }
    });
}

function sign_in(btn) {
    'use strict';
    $.ajax('http://localhost/project/php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {};
            request.name = 'SIGN_IN';
            request.content = $('form#sign-in').serializeObject();
            request.content.authority = $(btn).val();
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            if (obj.title === 'ERROR') {
                alert('郵箱 或 密碼錯誤, 請重新輸入');
                return;
            }
            $.cookie('user_serial', obj.content.user_serial, null, '/');
            if (obj.content.first_name !== null) {
                $.cookie('first_name', obj.content.first_name, null, '/');
            }
            location.reload();
        }
    });
}

function edit_profile(obj) {
    'use strict';
    if (obj.innerHTML === '完成') {
        $('input, select').attr('disabled', true);
        obj.innerHTML = '编辑';
    } else {
        $('input, select').attr('disabled', false);
        $('input[name="first_name"], input[name="last_name"], input[name="uid"], input[name="birth"], input[name="cellphone"], input[name="gender"]').attr('disabled', true);
        obj.innerHTML = '完成';
    }
}

$(document).ready(function () {
    'use strict';
    if ($.cookie('user_serial') !== undefined) {
        load_home_page();
    }
});