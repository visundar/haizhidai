/*global $, jQuery, alert*/
/*jslint forin: true, bitwise: true*/
var STATES = ['北京', '上海', '天津', '重庆', '河北', '山西', '内蒙古自治区', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西壮族自治区', '海南', '四川', '贵州', '云南', '西藏自治区', '陕西', '甘肃', '青海', '宁夏回族自治区', '新疆维吾尔自治区', '其他'];
var STORES = ['淘宝网', '拍拍网', '阿里巴巴', '京东', '一号店', '当当网', '敦煌', '其他'];
var FILE_ATTR = ['身份证', '结婚证', '营业执照', '劳动合同', '工牌、名片、工作证', '社保', '工资卡/常用银行流水', '学生证/一卡通', '房产证', '行驶证', '支付宝截图', '个人信用报告', '信用卡对账单', '学历学位证书', '其他所有贷款协议/凭证'];
var FILE_DESC = ['二代身份证正反面各一张，本人手持身份证合照一张，共3张。', '本人结婚证，包含结婚日期、本人及配偶所有信息。', '营业执照照片或工商网站截图，必须清晰显示法人、成立时间、经营范围、经营时间等关键信息。', '本人当前的有效劳动合同，从封面一页一页拍至最后一页。', '个人工作证或单位工牌、名片均可，必须完整显示单位信息及个人信息。', '社保/公积金网站截图，需完整显示本人姓名、身份证、缴费状态、缴费金额等关键信息。', '本人银行卡正反面照片各一张，以及近3个月完整流水打印单或网银流水截屏。工资卡需显示代发工资项。', '个人学生证信息页照片，需完整显示学校信息及个人信息', '房产证的基本信息页及盖章页各一张，共2张。', '正副本照片，需完整显示车辆登记信息及年检信息。', '支付宝账户基本信息页截图和上一年度个人年度对账单截图。', '仅接受人民银行征信中心网络查询的PDF版。', '用户本人信用卡正面照片及对应的近3 个月信用卡（电子或纸质）对账单。', '本人大专及以上学历或学位证书，接受结业证。', '本人其他金融机构的贷款协议或凭证证明。'];
var EDUCATION = ['初中及以下', '中专', '高中', '大专', '本科', '研究生及以上'];
var PRODUCT_ATTR = ['完成度', '瀏覽次數', '上架日期', '金額', '借貸者'];
var WORK_YEAR = ['1 年已內', '2 年已內', '3 年已內', '4 年(含)以上'];
var UPLOAD_URL = 'http://localhost/upload/index.php';
var RATE = [1.99, 3.99, 5.99, 8.99, 11.99, 14.99, 19.99];
var INCOME = [500000, 250000, 125000, 62500, 31250, 15625, 7812];
var LEVEL = ['AA', 'A', 'B', 'C', 'D', 'E', 'HR'];
var TERM = ['7 天', '14 天', '28 天', '半年', '一年'];
var USAGE = ['還款', '學費', '租金'];
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
var BORROW_PROGRESS = ['產品選擇', '個人信息', '資料上传', '產品信息', '資料确认', '審核狀況'];
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
            <span class="input-group-addon">&yen;</span>
            <input type="text" class="form-control" name="income">
              <span class="input-group-addon">元</span>
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
var PRODUCT_DETAIL_STR = function () {
    'use strict';
    /*
<form class="form-horizontal" id="product">
    <div class="form-group">
        <label for="name" class="col-md-2 control-label">*借款名稱</label>
        <div class="col-md-6">
          <input type="text" class="form-control" name="name" placeholder="">
        </div>
    </div>
    <div class="form-group">
        <label for="term" class="col-md-2 control-label">*還款期限</label>
        <div class="col-md-6">
            <select class="form-control" name="term" id="term">
            </select>
        </div>
    </div>
    <div class="form-group">
        <label for="usage" class="col-md-2 control-label">*借款用途</label>
        <div class="col-md-6">
            <select class="form-control" name="usage" id="usage">
            </select>
        </div>
    </div>
    <div class="form-group">
        <label for="amount" class="col-md-2 control-label">*借款金額</label>
        <div class="col-md-6">
          <div class="input-group">
              <span class="input-group-addon">&yen;</span>
              <input type="text" class="form-control" name="amount" placeholder="">
              <span class="input-group-addon">元</span>
          </div>
        </div>
    </div>
    <div class="form-group">
        <label for="source" class="col-md-2 control-label">*還款來源</label>
        <div class="col-md-6">
          <input type="text" class="form-control" name="source" placeholder="">
        </div>
    </div>
    <div class="form-group">
        <label for="descript" class="col-md-2 control-label">*借款簡介</label>
        <div class="col-md-6">
          <textarea name="descript" class="form-control" rows="3"></textarea>
        </div>
    </div>
    <div class="form-group">
        <label for="ps" class="col-md-2 control-label">其他</label>
        <div class="col-md-6">
          <textarea name="ps" class="form-control" rows="3"></textarea>
        </div>
    </div>
    <div class="form-group">
       <div class="col-md-offset-8">
           <button type="button" class="btn btn-success" onclick="save_product()">我已认真填写，下一步</button>
       </div>
    </div>
</form>
    */
}.toString().slice(38, -4);
var PROFILE_STR = function () {
    'use strict';
    /*
<form class="form-horizontal" id="profile">
    <div class="alert alert-warning" role="alert"><strong>温馨提示</strong>： 请填写真实完善的个人信息，以保证您的借款需求通过审核。海智贷拥有严格的信息及安全加密机制，确保您的信息安全。</div>
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
var IMAGE_UPLOAD_MODAL_STR = function () {
    'use strict';
    /*
<div class="modal fade" id="image-upload-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">圖像上傳</h4>
            </div>
            <div class="modal-body">
                <input type="file" class="filestyle" data-input="false" accept="image/\*" name="image">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">完成</button>
            </div>
        </div>
    </div>
</div>
    */
}.toString().slice(38, -4);
var FILTER_MODAL_STR = function () {
    'use strict';
    /*
<div class="modal fade" id="filter-modal" tabindex="-1" role="dialog" aria-labelledby="filter-modal-label">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="filter-modal-label">過濾</h4>
          </div>
          <div class="modal-body">
              <div class="row">
                  <h4>
                      <div class="col-md-2 text-right">利率</div>
                      <div class="col-md-10">
                          <span class="label label-danger" id="first-lower"></span>
                          ~
                          <span class="label label-info" id="first-upper"></span>
                      </div>
                  </h4>
              </div>
              <div class="row">
                  <div class="col-md-10 col-md-offset-2">
                      <div id="first-slider" class="slider" name="rate"></div>
                  </div>
              </div>
              <div class="row">
                  <h4>
                      <div class="col-md-2 text-right">等級</div>
                      <div class="col-md-10">
                          <span class="label label-danger" id="second-lower"></span>
                          ~
                          <span class="label label-info" id="second-upper"></span>
                      </div>
                  </h4>
              </div>
              <div class="row">
                  <div class="col-md-10 col-md-offset-2">
                      <div id="second-slider" class="slider" name="level"></div>
                  </div>
              </div>
              <div class="row">
                  <h4>
                      <div class="col-md-2 text-right">期限</div>
                      <div class="col-md-10">
                          <span class="label label-danger" id="third-lower"></span>
                          ~
                          <span class="label label-info" id="third-upper"></span>
                      </div>
                  </h4>
              </div>
              <div class="row">
                  <div class="col-md-10 col-md-offset-2">
                      <div id="third-slider" class="slider" name="term"></div>
                  </div>
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="filter()">過濾</button>
          </div>
        </div>
      </div>
    </div>
</div>
    */
}.toString().slice(38, -4);
var RATE_MODAL_STR = function () {
    'use strict';
    /*
<div class="modal fade" id="rate-modal" tabindex="-1" role="dialog" aria-labelledby="rate-modal-label">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="rate-modal-label">利率指標</h4>
      </div>
      <div class="modal-body">
          <table class="table table-bordered table-hover">
              <tr><th>Prosper Rating</th><th>Estimated Avg. Annual Loss Rate**</th></tr>
              <tr><th>AA</th><td>0.00~1.99%</td></tr>
              <tr><th>A</th><td>2.00~3.99%</td></tr>
              <tr><th>B</th><td>4.00~5.99%</td></tr>
              <tr><th>C</th><td>6.00~8.99%</td></tr>
              <tr><th>D</th><td>9.00~11.99%</td></tr>
              <tr><th>E</th><td>12.00~14.99%</td></tr>
              <tr><th>HR</th><td>≧15.00%</td></tr>
          </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">确认</button>
      </div>
    </div>
  </div>
</div>
    */
}.toString().slice(38, -4);
var FILE_UPLOAD_STR = function () {
    'use strict';
    /*
<table class="table table-bordered table-hover" id="file-list">
    <tr>
        <th class="col-md-2">資料類型</th>
        <th class="col-md-8">說明</th>
        <th class="col-md-1">圖片<br>數量</th>
        <th class="col-md-1">操作</th>
    </tr>
</table>
<p class="text-right">
    <button type="button" class="btn btn-success" onclick="submit_file_upload()">我已认真填写，下一步</button>
</p>
    */
}.toString().slice(38, -4);
var CONFIRM_PAGE_STR = function () {
    'use strict';
    /*
<table class="table">
    <tr><th class="col-md-2">個人信息</th><td class="col-md-8"></td><td class="col-md-2"></td></tr>
    <tr>
       <th></th>
       <td>
           <ul id="member">
           </ul>
        </td>
        <td><button class="btn btn-info" onclick="load_borrow_detail_page()">編輯</button></td>
    </tr>
    <tr><th>產品信息</th><td></td><td></td></tr>
    <tr>
       <th></th>
       <td>
           <ul id="product">
           </ul>
        </td>
        <td><button class="btn btn-info" onclick="load_product_info_page()">編輯</button></td>
    </tr>
    <tr><th></th><td colspan="2" class="text-right"><button class="btn btn-warning" onclick="submit_product_detail()">我已閱讀且同意</button></td></tr>
</table>
    */
}.toString().slice(38, -4);
var INVEST_PAGE_STR = function () {
    'use strict';
    /*
<ul class="nav nav-tabs">
  <li role="presentation" class="active"><a href="javascript:void(0)">所有商品</a></li>
  <form class="form-inline navbar-right">
      <div class="btn btn-info" data-toggle="modal" data-target="#rate-modal">利率指標</div>
      <div class="btn btn-warning" data-toggle="modal" data-target="#filter-modal">過濾</div>
      <input type="text" class="form-control input-sm" placeholder="關鍵字">
      <button type="button" class="btn btn-default input-sm" onclick="">搜尋</button>
  </form>
</ul>
<table class="table table-bordered table-hover" id="product-list">
    <tr>
        <th class="col-md-3">標題</th>
        <th class="col-md-1">投标</th>
        <th class="col-md-2" name="descript">描述</th>
        <th class="col-md-2" name="rate">利率</th>
        <th class="col-md-2" name="level">等级</th>
        <th class="col-md-2" name="term">期限</th>
    </tr>
</table>
    */
}.toString().slice(38, -4);
var member, product, product_list;


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

function filter_slider_init() {
    'use strict';
    $("#first-slider").slider({
        range: true,
        min: 0,
        max: 100,
        values: [0, 100],
        slide: function (event, ui) {
            $("#first-lower").html(ui.values[0] + "%");
            $("#first-upper").html(ui.values[1] + "%");
        }
    });
    $("#first-lower").html($("#first-slider").slider("values", 0) + "%");
    $("#first-upper").html($("#first-slider").slider("values", 1) + "%");
    
    $("#second-slider").slider({
        range: true,
        min: 0,
        max: 6,
        values: [0, 6],
        slide: function (event, ui) {
            $("#second-lower").html(LEVEL[ui.values[0]]);
            $("#second-upper").html(LEVEL[ui.values[1]]);
        }
    });
    $("#second-lower").html(LEVEL[$("#second-slider").slider("values", 0)]);
    $("#second-upper").html(LEVEL[$("#second-slider").slider("values", 1)]);
    
    $("#third-slider").slider({
        range: true,
        min: 0,
        max: 60,
        values: [0, 60],
        slide: function (event, ui) {
            $("#third-lower").html(ui.values[0] + "天");
            $("#third-upper").html(ui.values[1] + "天");
        }
    });
    $("#third-lower").html($("#third-slider").slider("values", 0) + "天");
    $("#third-upper").html($("#third-slider").slider("values", 1) + "天");
}

function load_product_list() {
    'use strict';
    $.ajax('http://localhost/project/php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {};
            request.name = 'GET_ALL_PRODUCT';
            request.content = {};
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            product_list = obj.content;
        }
    });
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

function generate_product_row(para1, para2, para3, para4, para5) {
    'use strict';
    var row;
    row = '<tr class="product-content">';
    row += '<td><a href="javascript:void(0)">' + para1 + '</a></td>';
    row += '<td class="text-center"><button type="button" class="btn btn-info btn-xs" onclick="bid()">投標</button>';
    row += '<button type="button" class="btn btn-success btn-xs" id="btn-concern" onclick="concern()">關注</button></td>';
    row += '<td>' + para2 + '</td>';
    row += '<td class="text-center">' + para3 + '</td>';
    row += '<td class="text-center">' + para4 + '</td>';
    row += '<td class="text-center">' + para5 + '</td>';
    row += '</tr>';
    return row;
}

function load_invest_page() {
    'use strict';
    var i;
    clear_all();
    $('div#navbar-collapse > ul:first > li:nth-child(1)').addClass('active');
    for (i = 0; i < PRODUCT_ATTR.length; i += 1) {
        $('div#content > div:nth-child(1)').append('<a class="list-group-item" draggable="true">' + PRODUCT_ATTR[i] + '</a>');
    }
    $('div#content > div:nth-child(2)').html(INVEST_PAGE_STR);
    $('div#modal').append(RATE_MODAL_STR + FILTER_MODAL_STR);
    filter_slider_init();
    load_product_list();
    for (i = 0; i < product_list.length; i += 1) {
        $('table#product-list').append(generate_product_row(product_list[i].name,
                                                           product_list[i].descript,
                                                           product_list[i].rate + '%',
                                                           LEVEL[Number(product_list[i].level)],
                                                           product_list[i].term));
    }
}

function load_borrow_page() {
    'use strict';
    var i, j;
    clear_all();
    $('div#navbar-collapse > ul:first > li:nth-child(2)').addClass('active');
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
    $('div#content > div:nth-child(1) > a').removeClass('active');
    $('div#content > div:nth-child(1) > a:nth-child(2)').addClass('active');
    $('div#content > div:nth-child(2)').html(PROFILE_STR);
    if ($(btn).val() === '0' || $.cookie('work_status') === '0') {
        $(DETAIL_WORKER_STR).insertBefore('form > div.form-group:has(div.col-md-offset-8)');
        $.cookie('work_status', 0, 30, '/');
    } else if ($(btn).val() === '1' || $.cookie('work_status') === '1') {
        $(DETAIL_STORE_STR).insertBefore('form > div.form-group:has(div.col-md-offset-8)');
        $.cookie('work_status', 1, 30, '/');
    } else if ($(btn).val() === '2' || $.cookie('work_status') === '2') {
        $(DETAIL_STUDENT_STR).insertBefore('form > div.form-group:has(div.col-md-offset-8)');
        $.cookie('work_status', 2, 30, '/');
    }
    for (i = 0; i < WORK_YEAR.length; i += 1) {
        $('select[name="work_years"]').append('<option value="' + i + '">' + WORK_YEAR[i] + '</option>');
    }
    for (i = 0; i < EDUCATION.length; i += 1) {
        $('select[name="education"]').append('<option value="' + i + '">' + EDUCATION[i] + '</option>');
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
            $('input, select').attr('disabled', false);
            $('input[name="first_name"], input[name="last_name"], input[name="uid"], input[name="birth"], input[name="cellphone"], input[name="gender"]').attr('disabled', true);
            request.content = $('form#profile').serializeObject();
            request.content.work_status = $.cookie('work_status');
            $.cookie('income', request.content.income, 30, '/');
            member = request.content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            $('div#content > div:nth-child(1) > a:nth-child(2)').removeClass('active');
            $('div#content > div:nth-child(1) > a:nth-child(3)').addClass('active');
            $('div#content > div:nth-child(2)').html(FILE_UPLOAD_STR);
            for (i = 0; i < FILE_ATTR.length; i += 1) {
                $('table#file-list').append('<tr><th>' + FILE_ATTR[i] + '</th><td>' + FILE_DESC[i] +
                                            '<a href="">示例圖片</a></td><td>0</td><td><button class="btn btn-info" data-toggle="modal" data-target="#image-upload-modal">上傳</button></td></tr>');
            }
            $('div#modal').html(IMAGE_UPLOAD_MODAL_STR);
            $(".filestyle").fileinput({
                uploadUrl: UPLOAD_URL,
                language: 'zh',
                maxFilesNum: 1
            });
            /*
            $(".filestyle").on('fileuploaded', function () {
                $(this).fileinput('clear');
                i = Number($(this).parents('td').prev().text()) + 1;
                $(this).parents('td').prev().text(i);
            });*/
        }
    });
}

function load_product_info_page() {
    'use strict';
    var i, name;
    $('div#content > div:nth-child(1) > a').removeClass('active');
    $('div#content > div:nth-child(1) > a:nth-child(4)').addClass('active');
    $('div#modal').html('');
    $('div#content > div:nth-child(2)').html(PRODUCT_DETAIL_STR);
    for (i = 0; i < TERM.length; i += 1) {
        $('select[name="term"]').append('<option value="' + i + '">' + TERM[i] + '</option>');
    }
    for (i = 0; i < USAGE.length; i += 1) {
        $('select[name="usage"]').append('<option value="' + i + '">' + USAGE[i] + '</option>');
    }
    if (product !== null) {
        for (name in product) {
            if (name === 'term' || name === 'usage') {
                $('select#' + name.replace('_', '-')).val(product[name]);
            } else if (name === 'descript' || name === 'ps') {
                $('textarea[name="' + name + '"]').val(product[name]);
            } else {
                $('input[name="' + name + '"]').val(product[name]);
            }
        }
    }
}

function submit_file_upload() {
    'use strict';
    load_product_info_page();
}

function submit_product_detail() {
    'use strict';
    $.ajax('http://localhost/project/php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {};
            request.name = 'SUBMIT_PRODUCT_DETAIL';
            request.content = product;
            product = null;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            $('div#content > div:nth-child(1) > a:nth-child(5)').removeClass('active');
            $('div#content > div:nth-child(1) > a:nth-child(6)').addClass('active');
            $('div#content > div:nth-child(2)').html('<div class="alert alert-success" role="alert">已送交審核，謝謝您！</div>');
        }
    });
}

function save_product() {
    'use strict';
    var i, income, name, tmp;
    product = $('form#product').serializeObject();
    income = Number($.cookie('income'));
    for (i = 0; i < INCOME.length; i += 1) {
        if (income > INCOME[i]) {
            break;
        }
    }
    product.level = i;
    product.rate = RATE[i];
    $('div#content > div:nth-child(1) > a:nth-child(4)').removeClass('active');
    $('div#content > div:nth-child(1) > a:nth-child(5)').addClass('active');
    $('div#content > div:nth-child(2)').html(CONFIRM_PAGE_STR);
    for (name in member) {
        if (member[name] !== null) {
            if (name === 'marriage') {
                if (member[name] === '0') {
                    tmp = '未婚';
                } else if (member[name] === '1') {
                    tmp = '已婚';
                } else {
                    tmp = '离异';
                }
                $('ul#member').append('<li>婚姻状况:' + tmp + '</li>');
            } else if (name === 'insurance') {
                $('ul#member').append('<li>保險:' + (member[name] === '0' ? '无' : '有') + '</li>');
            } else if (name === 'education') {
                $('ul#member').append('<li>学历:' + EDUCATION[Number(member[name])] + '</li>');
            } else if (name === 'child') {
                $('ul#member').append('<li>子女:' + (member[name] === '0' ? '无' : '有') + '</li>');
            } else if (name === 'home_phone') {
                $('ul#member').append('<li>住宅电话:' + member[name] + '</li>');
            } else if (name === 'home_state') {
                $('ul#member').append('<li>住宅省份:' + STATES[Number(member[name])] + '</li>');
            } else if (name === 'home_address') {
                $('ul#member').append('<li>住宅地址:' + member[name] + '</li>');
            } else if (name === 'income') {
                $('ul#member').append('<li>月收入:' + member[name] + '</li>');
            } else if (name === 'work_name') {
                $('ul#member').append('<li>公司名稱:' + member[name] + '</li>');
            } else if (name === 'work_years') {
                $('ul#member').append('<li>公作年限:' + WORK_YEAR[Number(member[name])] + '</li>');
            } else if (name === 'work_state') {
                $('ul#member').append('<li>单位省份:' + STATES[Number(member[name])] + '</li>');
            } else if (name === 'work_address') {
                $('ul#member').append('<li>单位地址:' + member[name] + '</li>');
            } else if (name === 'work_phone') {
                $('ul#member').append('<li>单位电话:' + member[name] + '</li>');
            } else if (name === 'work_department') {
                $('ul#member').append('<li>任职部门:' + member[name] + '</li>');
            } else if (name === 'work_title') {
                $('ul#member').append('<li>任职职位:' + member[name] + '</li>');
            }
        }
    }
    for (name in product) {
        if (product[name] !== null) {
            if (name === 'name') {
                $('ul#product').append('<li>借款名稱:' + product[name] + '</li>');
            } else if (name === 'term') {
                $('ul#product').append('<li>還款期限:' + TERM[Number(product[name])] + '</li>');
            } else if (name === 'usage') {
                $('ul#product').append('<li>借款用途:' + USAGE[Number(product[name])] + '</li>');
            } else if (name === 'amount') {
                $('ul#product').append('<li>借款金額:' + product[name] + '</li>');
            } else if (name === 'source') {
                $('ul#product').append('<li>還款來源:' + product[name] + '</li>');
            } else if (name === 'descript') {
                $('ul#product').append('<li>借款簡介:' + product[name] + '</li>');
            } else if (name === 'ps') {
                $('ul#product').append('<li>附註:' + product[name] + '</li>');
            } else if (name === 'level') {
                $('ul#product').append('<li>借款等級:' + LEVEL[Number(product[name])] + '</li>');
            } else if (name === 'rate') {
                $('ul#product').append('<li>借款利率:' + product[name] + '</li>');
            }
        }
    }
}

function sign_out() {
    'use strict';
    $.removeCookie('user_serial');
    $.removeCookie('first_name');
    $.removeCookie('work_status');
    $.removeCookie('income');
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
            $.cookie('user_serial', obj.content.user_serial, 30, '/');
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
            $.cookie('user_serial', obj.content.user_serial, 30, '/');
            if (obj.content.first_name !== null) {
                $.cookie('first_name', obj.content.first_name, 30, '/');
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

function filter() {
    'use strict';
    var first_lower = $("#first-slider").slider("values", 0),
        first_upper = $("#first-slider").slider("values", 1),
        second_lower = $("#second-slider").slider("values", 0),
        second_upper = $("#second-slider").slider("values", 1),
        third_lower = $("#third-slider").slider("values", 0),
        third_upper = $("#third-slider").slider("values", 1),
        first_name = $('table#product-list > tbody > tr:first > th:nth-child(4)').attr('name'),
        second_name = $('table#product-list > tbody > tr:first > th:nth-child(5)').attr('name'),
        third_name = $('table#product-list > tbody > tr:first > th:nth-child(6)').attr('name'),
        i,
        a = [];
    for (i = 0; i < product_list.length; i += 1) {
        if (Number(product_list[i][first_name]) >= first_lower &&
                Number(product_list[i][first_name]) <= first_upper &&
                Number(product_list[i][second_name]) >= second_lower &&
                Number(product_list[i][second_name]) <= second_upper &&
                Number(product_list[i][third_name]) >= third_lower &&
                Number(product_list[i][third_name]) <= third_upper) {
            a.push(i);
        }
    }
    $('tr').remove('.product-content');
    for (i = 0; i < a.length; i += 1) {
        $('table#product-list').append(generate_product_row(product_list[a[i]].name,
                                                           product_list[a[i]].descript,
                                                           product_list[a[i]].rate + '%',
                                                           LEVEL[Number(product_list[a[i]].level)],
                                                           product_list[a[i]].term));
    }
}

$(document).ready(function () {
    'use strict';
    if ($.cookie('user_serial') !== undefined) {
        load_home_page();
    }
});