/*global $, jQuery, alert, Chart*/
/*jslint forin: true, bitwise: true*/
var STATES = ['', '北京', '上海', '天津', '重庆', '河北', '山西', '内蒙古自治区', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西壮族自治区', '海南', '四川', '贵州', '云南', '西藏自治区', '陕西', '甘肃', '青海', '宁夏回族自治区', '新疆维吾尔自治区', '其他'];
var STORES = ['', '淘宝网', '拍拍网', '阿里巴巴', '京东', '一号店', '当当网', '敦煌', '其他'];
var FILE_ATTR = ['身份证', '结婚证', '营业执照', '劳动合同', '工牌、名片、工作证', '社保', '工资卡/常用银行流水', '学生证/一卡通', '房产证', '行驶证', '支付宝截图', '个人信用报告', '信用卡对账单', '学历学位证书', '其他所有贷款协议/凭证'];
var FILE_DESC = ['二代身份证正反面各一张，本人手持身份证合照一张，共3张。', '本人结婚证，包含结婚日期、本人及配偶所有信息。', '营业执照照片或工商网站截图，必须清晰显示法人、成立时间、经营范围、经营时间等关键信息。', '本人当前的有效劳动合同，从封面一页一页拍至最后一页。', '个人工作证或单位工牌、名片均可，必须完整显示单位信息及个人信息。', '社保/公积金网站截图，需完整显示本人姓名、身份证、缴费状态、缴费金额等关键信息。', '本人银行卡正反面照片各一张，以及近3个月完整流水打印单或网银流水截屏。工资卡需显示代发工资项。', '个人学生证信息页照片，需完整显示学校信息及个人信息', '房产证的基本信息页及盖章页各一张，共2张。', '正副本照片，需完整显示车辆登记信息及年检信息。', '支付宝账户基本信息页截图和上一年度个人年度对账单截图。', '仅接受人民银行征信中心网络查询的PDF版。', '用户本人信用卡正面照片及对应的近3 个月信用卡（电子或纸质）对账单。', '本人大专及以上学历或学位证书，接受结业证。', '本人其他金融机构的贷款协议或凭证证明。'];
var FILE_IMG = [['uid_1.jpg', 'uid_2.jpg', 'uid_3.jpg'], 'jiehunzheng.jpg', 'yingyezhizhao.jpg', 'laodonghetong.jpg', 'gongpai.jpg', 'shebao.png', 'yinhangliushui.jpg', 'xueshengzheng.jpg', 'fangchanzheng.jpg', 'xingshizheng.jpg', 'zhifubao.jpg', 'xinyongbaogao.png', 'xinyongkazhangdan.bmp', 'xuelizhengshu.bmp', 'qitapingzheng.jpg'];
var WORK_STATUS = ['工薪', '网商', '学生'];
var EDUCATION = ['', '初中及以下', '中专', '高中', '大专', '本科', '研究生及以上'];
var WORK_YEAR = ['', '1 年已內', '2 年已內', '3 年已內', '4 年(含)以上'];
var RELATION = ['', '父母', '子女', '親戚', '朋友'];
var UPLOAD_URL = '../upload/index.php';
var RATE = [1.99, 3.99, 5.99, 8.99, 11.99, 14.99, 19.99];
var INCOME = [500000, 250000, 125000, 62500, 31250, 15625];
var LEVEL = ['AA', 'A', 'B', 'C', 'D', 'E', 'HR'];
var USAGE = ['', '还款', '学费', '租金'];
var MARRIAGE = ['未婚', '已婚', '離異'];
var PRODUCT = [{
        name: '普通借款标',
        suit: '工薪族',
        panel: 'success',
        condition: [
            '21-55周岁中国大陆公民',
            '手机绑定',
            '有固定工作']
    }, {
        name: '网商用户标',
        suit: '网店卖家',
        panel: 'warning',
        condition: [
            '21-55周岁国大陆公民',
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
var BORROW_PROGRESS = ['产品选择', '个人信息', '产品信息', '资料上传', '资料确认', '审核状况'];
var NAVBAR_STR = function () {
    'use strict';
    /*
<li><a href="javascript:void(0)" onclick="load_invest_page()">我要投资</a></li>
<li><a href="javascript:void(0)" onclick="load_borrow_page()">我要借款</a></li>
<li><a href="javascript:void(0)" onclick="load_account_page()">我的帐户</a></li>
<li><a href="javascript:void(0)" onclick="load_forum_page()">会员社区</a></li>
    */
}.toString().slice(38, -4);
var SAMPLE_MODAL_STR = function () {
    'use strict';
    /*
<div class="modal fade" id="sample-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"></h4>
            </div>
            <div class="modal-body">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">了解</button>
            </div>
        </div>
    </div>
</div>
    */
}.toString().slice(38, -4);
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
      <input type="text" class="form-control" id="work-name" name="work_name">
    </div>
</div>
<div class="form-group">
    <label class="col-md-2 control-label">*宿舍电话</label>
    <div class="col-md-5">
      <input type="text" class="form-control" id="work-phone" name="work_phone">
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
              <span class="input-group-addon">元</span>
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
        <label for="name" class="col-md-2 control-label">*借款名称</label>
        <div class="col-md-6">
          <input type="text" class="form-control" name="name" placeholder="">
        </div>
    </div>
    <div class="form-group">
        <label for="term" class="col-md-2 control-label">*还款期数</label>
        <div class="col-md-6">
            <div class="input-group">
                <span class="input-group-addon pointer" onclick="change_term(this)" value="-"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></span>
                <input class="form-control" type="text" name="term" value="3">
                <span class="input-group-addon">期</span>
                <span class="input-group-addon pointer" onclick="change_term(this)" value="+"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></span>
            </div>
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
        <label for="amount" class="col-md-2 control-label">*借款金额</label>
        <div class="col-md-6">
          <div class="input-group">
              <span class="input-group-addon">&yen;</span>
              <input type="text" class="form-control" name="amount" placeholder="">
              <span class="input-group-addon">元</span>
          </div>
        </div>
    </div>
    <div class="form-group">
        <label for="source" class="col-md-2 control-label">*还款来源</label>
        <div class="col-md-6">
          <input type="text" class="form-control" name="source">
        </div>
    </div>
    <div class="form-group">
        <label for="descript" class="col-md-2 control-label">*借款简介</label>
        <div class="col-md-6">
          <textarea name="descript" class="form-control" rows="3"></textarea>
        </div>
    </div>
    <div class="form-group">
        <label for="ps" class="col-md-2 control-label">其他</label>
        <div class="col-md-6">
          <textarea name="ps" class="form-control" rows="3" placeholder="如有其他说明事项请于此输入"></textarea>
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
    <div class="alert alert-danger">
        <p class="text-center"><strong>此区日后无法变更，请确实填写</strong></p>
        <br><br>
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
            <label for="authen" class="col-md-2 control-label">*验证码</label>
            <div class="col-md-5">
                <input type="text" class="form-control" id="authen" disabled>
            </div>
            <div class="col-md-4">
                <input type="button" class="btn" value="获取验证码" onclick="$('input#authen').val((Math.random().toString()).slice(-4))">
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
              <input type="checkbox" name="asset" value="1" onclick="toggle_asset_checkbox(this)"> 无
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
                <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="$('button.fileinput-remove-button').click()">完成</button>
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
            <h4 class="modal-title" id="filter-modal-label">过滤</h4>
          </div>
          <div class="modal-body">
              <div class="row">
                  <h4>
                      <div class="col-md-2 text-right">完成度</div>
                      <div class="col-md-10">
                          <span class="label label-danger" id="complete-lower"></span>
                          ~
                          <span class="label label-info" id="complete-upper"></span>
                      </div>
                  </h4>
              </div>
              <div class="row">
                  <div class="col-md-10 col-md-offset-2">
                      <div id="complete-slider" class="slider" name="rate"></div>
                  </div>
              </div>
              <div class="row">
                  <h4>
                      <div class="col-md-2 text-right">金額</div>
                      <div class="col-md-10">
                          <span class="label label-danger" id="amount-lower"></span>
                          ~
                          <span class="label label-info" id="amount-upper"></span>
                      </div>
                  </h4>
              </div>
              <div class="row">
                  <div class="col-md-10 col-md-offset-2">
                      <div id="amount-slider" class="slider" name="level"></div>
                  </div>
              </div>
              <div class="row">
                  <h4>
                      <div class="col-md-2 text-right">等級</div>
                      <div class="col-md-10">
                          <span class="label label-danger" id="level-lower"></span>
                          ~
                          <span class="label label-info" id="level-upper"></span>
                      </div>
                  </h4>
              </div>
              <div class="row">
                  <div class="col-md-10 col-md-offset-2">
                      <div id="level-slider" class="slider" name="term"></div>
                  </div>
              </div>
              <div class="row">
                  <h4>
                      <div class="col-md-2 text-right">期数</div>
                      <div class="col-md-10">
                          <span class="label label-danger" id="term-lower"></span>
                          ~
                          <span class="label label-info" id="term-upper"></span>
                      </div>
                  </h4>
              </div>
              <div class="row">
                  <div class="col-md-10 col-md-offset-2">
                      <div id="term-slider" class="slider" name="term"></div>
                  </div>
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="filter()">过滤</button>
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
        <h4 class="modal-title" id="rate-modal-label">利率指标</h4>
      </div>
      <div class="modal-body">
          <table class="table table-bordered table-hover">
              <tr><th>海智贷等级</th><th>年利率**</th></tr>
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
var PRODUCT_MODAL_STR = function () {
    'use strict';
    /*
<div class="modal fade" id="product-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">第<u></u>号借款</h4>
            </div>
            <div class="modal-body">
                <div>
                  <ul class="nav nav-tabs" role="tablist" style="margin-bottom:25px">
                    <li role="presentation" class="active"><a href="#product-info" aria-controls="product-info" role="tab" data-toggle="tab">产品介绍</a></li>
                    <li role="presentation"><a href="#member-info" aria-controls="member-info" role="tab" data-toggle="tab">借款人相关信息</a></li>
                    <li role="presentation"><a href="#judge" aria-controls="judge" role="tab" data-toggle="tab">审核状态</a></li>
                    <li role="presentation"><a href="#history" aria-controls="history" role="tab" data-toggle="tab">投标记录</a></li>
                  </ul>
                  <div class="tab-content">
                    <div role="tabpanel" class="tab-pane active" id="product-info">
                        <div class="panel panel-default">
                            <div class="panel-heading">借款详情</div>
                            <div class="panel-body"></div>
                        </div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>借款目的</th>
                                    <th>还款来源</th>
                                    <th>年利率</th>
                                    <th>刊登时间</th>
                                    <th>附注</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="member-info">
                        <div class="panel panel-default">
                            <div class="panel-heading">用戶分析</div>
                            <div class="panel-body"></div>
                        </div>
                        <table class="table table-hover text-right">
                            <thead>
                                <tr>
                                    <th>性别</th>
                                    <th>年龄</th>
                                    <th>婚姻情况</th>
                                    <th>文化程度</th>
                                    <th>住宅状况</th>
                                    <th>是否购车</th>
                                    <th>总借款笔数</th>
                                    <th>成功笔数</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="judge">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th class="col-md-6">审核项目</th>
                                    <th class="col-md-2 text-center">状态</th>
                                    <th class="col-md-4 text-center">通过日期</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr name="credit">
                                    <td>信用报告</td>
                                    <td class="text-center"></td>
                                    <td class="text-center"></td>
                                </tr>
                                <tr name="identity">
                                    <td>身份认証</td>
                                    <td class="text-center"></td>
                                    <td class="text-center"></td>
                                </tr>
                                <tr name="work">
                                    <td>工作认証</td>
                                    <td class="text-center"></td>
                                    <td class="text-center"></td>
                                </tr>
                                <tr name="income">
                                    <td>收入认証</td>
                                    <td class="text-center"></td>
                                    <td class="text-center"></td>
                                </tr>
                                <tr name="building">
                                    <td>房产认证</td>
                                    <td class="text-center"></td>
                                    <td class="text-center"></td>
                                </tr>
                                <tr name="car">
                                    <td>车产认证</td>
                                    <td class="text-center"></td>
                                    <td class="text-center"></td>
                                </tr>
                                <tr name="marriage">
                                    <td>婚姻认证</td>
                                    <td class="text-center"></td>
                                    <td class="text-center"></td>
                                </tr>
                            </tbody>
                        </table>
                        <ul>
                            <li class="ps">海智贷及其合作机构将始终秉持客观公正的原则，严控风险，最大程度的尽力确保借入者信息的真实性，但不保证审核信息100%无误。</li>
                            <li class="ps">借入者若长期逾期，其个人信息将被公布。</li>
                        </ul>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="history">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>投标人</th>
                                    <th>当年利率</th>
                                    <th>有效金额</th>
                                    <th>投标时间</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                  </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">了解</button>
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
var CLAUSE_MODAL = function () {
    'use strict';
    /*
<div class="modal fade" id="clause-modal" tabindex="-1" role="dialog" aria-labelledby="clause-modal-label">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="rate-modal-label">借贷条款</h4>
      </div>
      <div class="modal-body">
        借贷条款内容
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">确认</button>
      </div>
    </div>
  </div>
</div>
    */
}.toString().slice(38, -4);
var CONFIRM_PAGE_STR = function () {
    'use strict';
    /*
<table class="table">
    <tr><th class="col-md-2">个人信息</th><td class="col-md-8"></td><td class="col-md-2"></td></tr>
    <tr>
       <th></th>
       <td>
           <ul id="member">
           </ul>
        </td>
        <td><button class="btn btn-info" onclick="load_borrow_detail_page()">编辑</button></td>
    </tr>
    <tr><th>产品信息</th><td></td><td></td></tr>
    <tr>
       <th></th>
       <td>
           <ul id="product">
           </ul>
        </td>
        <td><button class="btn btn-info" onclick="load_product_info_page()">编辑</button></td>
    </tr>
    <tr><th>好友数量</th><td id="friend-number"></td><td></td></tr>
    <tr>
       <th></th>
       <td id="friend-alert"></td><td></td>
    </tr>
    <tr><th>上传资料</th><td></td><td></td></tr>
    <tr>
       <th></th>
       <td>
           <ul id="image">
           </ul>
        </td>
        <td><button class="btn btn-info" onclick="load_upload_page()">编辑</button></td>
    </tr>
    <tr>
        <th>借贷条款</th>
        <td>
           <div class="form-group">
            <label>
               <input type="checkbox" onclick="toggle_submit_product()"> <a data-toggle="modal" data-target="#clause-modal">海智贷条款</a>
            </label>
           </div>
        </td>
        <td></td>
    </tr>
    <tr><th></th><td colspan="2" class="text-right"><button class="btn btn-warning" onclick="submit_product_detail()" disabled>我已阅读且同意</button></td></tr>
</table>
    */
}.toString().slice(38, -4);
var INVEST_PAGE_STR = function () {
    'use strict';
    /*
<ul class="nav nav-tabs">
  <li role="presentation" class="active"><a href="javascript:void(0)">所有商品</a></li>
  <form class="form-inline navbar-right">
      *点击栏位名称可进行排序
      <div class="btn btn-info" data-toggle="modal" data-target="#rate-modal">利率指标</div>
      <div class="btn btn-warning" data-toggle="modal" data-target="#filter-modal">过滤</div>
      <input type="text" class="form-control input-sm" placeholder="关键字" id="keyword">
      <button type="button" class="btn btn-default input-sm" onclick="searcher()">搜寻</button>
  </form>
</ul>
<table class="table table-bordered table-hover" id="product-list">
    <tr>
        <th class="col-md-2" name="name">标题</th>
        <th class="col-md-3 pointer" name="complete" onclick="product_sort(this)">完成度</th>
        <th class="col-md-1 pointer" name="amount" onclick="product_sort(this)">金额</th>
        <th class="col-md-1 pointer" name="view" onclick="product_sort(this)">浏览</th>
        <th class="col-md-1 pointer" name="level" onclick="product_sort(this)">等级</th>
        <th class="col-md-1 pointer" name="term" onclick="product_sort(this)">期数</th>
        <th class="col-md-3">投标</th>
    </tr>
</table>
    */
}.toString().slice(38, -4);
var AUTHEN_MODAL_STR = function () {
    'use strict';
    /*
<div class="modal fade" id="authen-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">实名认证</h4>（港澳台认证，请点击<a>此处</a>）
            </div>
            <div class="modal-body">
                <h5>尊敬的用户您好，为了您的资金安全，请先完成身份认証及手机绑定再充值。</h5>
                <br>
                <form class="form-horizontal" id="authen">
                    <div class="form-group">
                        <label for="name" class="col-md-offset-1 col-md-2 control-label">*姓名</label>
                        <div class="col-md-4">
                            <input type="text" class="form-control" name="last_name" placeholder="姓">
                        </div>
                        <div class="col-md-4">
                            <input type="text" class="form-control" name="first_name" placeholder="名">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="uid" class="col-md-offset-1 col-md-2 control-label">*身份证</label>
                        <div class="col-md-8">
                            <input type="text" class="form-control" name="uid" placeholder="身份证">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="cellphone" class="col-md-offset-1 col-md-2 control-label">*手机号</label>
                        <div class="col-md-8">
                            <input type="text" class="form-control" name="cellphone" placeholder="手机号">
                        </div>
                    </div>
                    <div class="form-group">
                       <label for="gender" class="col-md-offset-1 col-md-2 control-label">*性別</label>
                        <div class="col-md-8">
                            <label class="radio-inline">
                              <input type="radio" name="gender" value="1"> 男
                            </label>
                            <label class="radio-inline">
                              <input type="radio" name="gender" value="0"> 女
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="birth" class="col-md-offset-1 col-md-2 control-label">*生日</label>
                        <div class="col-md-8">
                          <input type="text" class="form-control" name="birth" placeholder="1990-01-01">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="authen" class="col-md-offset-1 col-md-2 control-label">*验证码</label>
                        <div class="col-md-4">
                            <input type="text" class="form-control" id="authen" disabled>
                        </div>
                        <div class="col-md-4">
                            <input type="button" class="btn" value="获取验证码" onclick="$('input#authen').val((Math.random().toString()).slice(-4))">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="submit_authen()">认证</button>
            </div>
        </div>
    </div>
</div>
    */
}.toString().slice(38, -4);
var CHARGE_MODAL_STR = function () {
    'use strict';
    /*
<div class="modal fade" id="charge-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">快速充值</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="charge">
                    <div class="form-group">
                        <label for="amount" class="col-md-offset-1 col-md-2 control-label">可用餘額</label>
                        <div class="col-md-8">
                            <div class="input-group">
                                <span class="input-group-addon">&yen;</span>
                                <input class="form-control" type="text" disabled id="amount">
                                <span class="input-group-addon">元</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="name" class="col-md-offset-1 col-md-2 control-label">*持卡人姓名</label>
                        <div class="col-md-8">
                            <input type="text" class="form-control" id="name">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="card_number" class="col-md-offset-1 col-md-2 control-label">*银行卡号</label>
                        <div class="col-md-8">
                            <input type="text" class="form-control" id="card-number" placeholder="请输入银行卡号">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="cellphone" class="col-md-offset-1 col-md-2 control-label">*手机号</label>
                        <div class="col-md-8">
                            <input type="text" class="form-control" id="cellphone" placeholder="手机号">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="remain" class="col-md-offset-1 col-md-2 control-label">充值金額</label>
                        <div class="col-md-8">
                            <div class="input-group">
                                <span class="input-group-addon">&yen;</span>
                                <input class="form-control" type="text" placeholder="额度上限5万元/次" name="remain">
                                <span class="input-group-addon">元</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="authen" class="col-md-offset-1 col-md-2 control-label">*手機验证</label>
                        <div class="col-md-4">
                            <input type="text" class="form-control" id="authen" disabled>
                        </div>
                        <div class="col-md-4">
                            <input type="button" class="btn" value="获取验证码" onclick="$('input#authen').val((Math.random().toString()).slice(-4))">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="submit_charge()">充值</button>
            </div>
        </div>
    </div>
</div>
    */
}.toString().slice(38, -4);
var CASH_MODAL_STR = function () {
    'use strict';
    /*
<div class="modal fade" id="cash-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">快速提现</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="cash">
                    <div class="form-group">
                        <label for="amount" class="col-md-offset-1 col-md-2 control-label">可用餘額</label>
                        <div class="col-md-8">
                            <div class="input-group">
                                <span class="input-group-addon">&yen;</span>
                                <input class="form-control" type="text" disabled id="amount">
                                <span class="input-group-addon">元</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="account_number" class="col-md-offset-1 col-md-2 control-label">*銀行帐户</label>
                        <div class="col-md-8">
                            <input type="text" class="form-control" id="account-number" placeholder="请输入銀行帐户">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="confirm_account_number" class="col-md-offset-1 col-md-2 control-label">*确认 銀行帐户</label>
                        <div class="col-md-8">
                            <input type="text" class="form-control" id="confirm-account-number" placeholder="请重新输入銀行帐户">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="cellphone" class="col-md-offset-1 col-md-2 control-label">*手机号</label>
                        <div class="col-md-8">
                            <input type="text" class="form-control" id="cellphone" placeholder="手机号">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="remain" class="col-md-offset-1 col-md-2 control-label">提现金額</label>
                        <div class="col-md-8">
                            <div class="input-group">
                                <span class="input-group-addon">&yen;</span>
                                <input class="form-control" type="text" placeholder="額度上限5萬元/次" name="remain">
                                <span class="input-group-addon">元</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="authen" class="col-md-offset-1 col-md-2 control-label">*手機验证</label>
                        <div class="col-md-4">
                            <input type="text" class="form-control" id="authen" disabled>
                        </div>
                        <div class="col-md-4">
                            <input type="button" class="btn" value="获取验证码" onclick="$('input#authen').val((Math.random().toString()).slice(-4))">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="submit_cash()">提现</button>
            </div>
        </div>
    </div>
</div>
    */
}.toString().slice(38, -4);
var INVEST_COL_STR = function () {
    'use strict';
    /*
<div class="input-group input-group-sm">
    <span class="input-group-addon pointer" onclick="change_amount(this)" value="-"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></span>
    <span class="input-group-addon">&yen;</span>
    <input class="form-control" type="text" value="100">
    <span class="input-group-addon pointer" onclick="change_amount(this)" value="+"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></span>
</div>
<div class="invest-area col-md-12" onclick="invest_this(this)">马上投标</div>
    */
}.toString().slice(38, -4);
var INVEST_MODAL_STR = function () {
    'use strict';
    /*
<div class="modal fade" id="invest-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">投資</h4>
            </div>
            <div class="modal-body">
                <h2>投資金額：<strong></strong>元</h2>
                <h3>借款序號：<strong></strong></h3>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="submit_invest()">我確定想投資</button>
            </div>
        </div>
    </div>
</div>
    */
}.toString().slice(38, -4);
var HOME_PANEL_STR = function () {
    'use strict';
    /*
<div class="col-md-6" onclick="load_invest_page()" id="home-invest-panel">
    <div class="panel panel-info">
        <div class="panel-heading">
            <h1 class="panel-title">我要投資</h1>
        </div>
        <div class="panel-body">
        </div>
    </div>
</div>
<div class="col-md-6" onclick="load_borrow_page()" id="home-borrow-panel">
    <div class="panel panel-warning">
        <div class="panel-heading">
            <h1 class="panel-title">我要借款</h1>
        </div>
        <div class="panel-body">
        </div>
    </div>
</div>
    */
}.toString().slice(38, -4);
var INVEST_MANAGE_PAGE_STR = function () {
    'use strict';
    /*
<span style="color:#777;display:inline-block;padding-bottom:10px" id="statistic-info">
    投资统计：&nbsp;&nbsp;
        成功借出总额&nbsp;&yen;<span></span>元&nbsp;&nbsp;
        已收本金&nbsp;&yen;<span></span>元&nbsp;&nbsp;
        未收本金&nbsp;&yen;<span></span>元&nbsp;&nbsp;
        已收利息&nbsp;&yen;<span></span>元&nbsp;&nbsp;
        未收利息&nbsp;&yen;<span></span>元&nbsp;&nbsp;
</span>
<div class="row">
    <div class="panel panel-default">
        <div class="panel-heading">
            投标中
        </div>
        <div class="panel-body">
            <table class="table table-default" id="investing">
                <thead>
                    <tr>
                        <th>借款者</th>
                        <th>标题</th>
                        <th>投资金额</th>
                        <th>应收金额</th>
                        <th>年利率</th>
                        <th>期数</th>
                        <th>类型</th>
                        <th>投标时间</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>
<hr>
<div class="row">
    <div class="panel panel-default">
        <div class="panel-heading">
            待收款
        </div>
        <div class="panel-body">
            <table class="table table-default" id="paying">
                <thead>
                    <tr>
                        <th>期/总</th>
                        <th>借款者</th>
                        <th>借款标题</th>
                        <th>待收日期</th>
                        <th>待收本息</th>
                        <th>待收本金</th>
                        <th>待收利息</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>
<!--
<hr>
<div class="row">
    <div class="panel panel-default">
        <div class="panel-heading">
            本月散標回款紀錄
            <div class="navbar-right">
                本月應收款&nbsp;&yen;<strong class="font-size-larger">0.00</strong>&nbsp;|&nbsp;
                本月實收款&nbsp;&yen;<strong class="font-size-larger">0.00</strong>&nbsp;&nbsp;
            </div>
        </div>
        <div class="panel-body" id="calendar"></div>
        <div class="panel-footer">
            註：
            <ol>
                <li>本日曆應收款不包含逾期回款，提前回款等狀況。</li>
                <li>本日曆實收款顯示當天應收款的還款情況，包含正常還款+提前還款+逾期還款(含罰息)。</li>
                <li>今天以後顯示應收款和提前還款。</li>
            </ol>
        </div>
    </div>
</div>
-->
    */
}.toString().slice(38, -4);
var BORROW_MANAGE_PAGE_STR = function () {
    'use strict';
    /*
<div class="row">
    <div class="panel panel-default">
        <div class="panel-heading">
            投标中
        </div>
        <div class="panel-body">
            <table class="table table-default" id="borrowing">
                <thead>
                    <tr>
                        <th>标题</th>
                        <th>编号</th>
                        <th>期数</th>
                        <th>发标时间</th>
                        <th>发标总金额</th>
                        <th>年利率</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>
<div class="row">
    <div class="panel panel-default">
        <div class="panel-heading">
            待还款
        </div>
        <div class="panel-body">
            <table class="table table-default" id="complete">
                <thead>
                    <tr>
                        <th>标题</th>
                        <th>借款编号</th>
                        <th>期数</th>
                        <th>完标时间</th>
                        <th>应还日期</th>
                        <th>应还总额</th>
                        <th>应还本金</th>
                        <th>应还利息</th>
                        <th>逾期天数</th>
                        <th>还款状态</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>
    */
}.toString().slice(38, -4);
var FRIEND_MANAGE_PAGE_STR = function () {
    'use strict';
    /*
<form class="form-horizontal">
    <div class="alert alert-warning" role="alert"><strong>温馨提示</strong>： 邀请的好友须为本平台用户</div>
    <div class="form-group">
        <label for="email" class="col-md-2 control-label">*邮箱</label>
        <div class="col-md-5">
          <input type="text" class="form-control" name="email" placeholder="邮箱">
        </div>
    </div>
    <div class="form-group">
       <label for="relation" class="col-md-2 control-label">*关係<small>(为其)</small></label>
        <div class="col-md-5">
            <select class="form-control" id="relation" name="relation">
            </select>
        </div>
    </div>
    <div class="form-group">
       <div class="col-md-offset-8">
           <button type="button" class="btn btn-info" id="add-friend">加為好友</button>
       </div>
    </div>
</form>
<hr>
<table class="table" id="friend-list">
    <thead>
        <tr>
            <th>姓名</th>
            <th>关係</th>
            <th>状态</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
    */
}.toString().slice(38, -4);
var ALERT_DISMISS_STR = function () {
    'use strict';
    /*
<button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="delete_message(this)">
  <span aria-hidden="true">&times;</span>
</button>
    */
}.toString().slice(38, -4);
var FORUM_PAGE_STR = function () {
    'use strict';
    /*
<div class="row">
    <samp>今日: <span name="today_member"></span>|昨日: <span name="yesterday_member"></span>|帖子: <span name="total_post"></span>|会员: <span name="total_member"></span></samp>
    <button class="btn btn-default" style="position:absolute;right:50px;color:orange" data-toggle="modal" data-target="#post-modal">发新帖</button>
</div>
<hr>
<div class="row">
    <div class="col-md-4 no-padding">
        <div class="panel panel-default">
            <div class="panel-heading">最新主题</div>
            <div class="panel-body no-padding">
                <ul class="list-group" style="margin-bottom:0" id="latest-post-list">
                </ul>
            </div>
        </div>
    </div>
    <div class="col-md-4 no-padding">
        <div class="panel panel-default">
            <div class="panel-heading">最新回复</div>
            <div class="panel-body no-padding">
                <ul class="list-group" style="margin-bottom:0" id="latest-reply-list">
                </ul>
            </div>
        </div>
    </div>
    <div class="col-md-4 no-padding">
        <div class="panel panel-default">
            <div class="panel-heading">热帖</div>
            <div class="panel-body no-padding">
                <ul class="list-group" style="margin-bottom:0" id="most-reply-list">
                </ul>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="panel panel-default">
        <div class="panel-heading">借贷讨论区</div>
        <div class="panel-body">
            <div class="col-md-1">
                <img src="img/brand_icon.png" alt="">
            </div>
            <div class="col-md-7">
                【借款讨论区】
                <br>
                <span class="ps">借款人之间心得交流，如何更快更安全的借款，维护借款人利益。</span>
            </div>
            <div class="col-md-1">
                <!--<span style="color:red">13</span>/55-->
            </div>
            <div class="col-md-3" id="just-reply">
            </div>
        </div>
    </div>
</div>
    */
}.toString().slice(38, -4);
var FORUM_MODAL_STR = function () {
    'use strict';
    /*
<div class="modal fade" id="post-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4>发表帖子</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="post">
                    <div class="form-group">
                        <label for="title" class="col-md-2 control-label">标题</label>
                        <div class="col-md-8">
                            <input type="text" class="form-control" id="title" placeholder="请输入标题" name="title">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="content" class="col-md-2 control-label">内容</label>
                        <div class="col-md-8">
                            <textarea class="form-control" id="content" rows="3" placeholder="请输入内容" name="content"></textarea>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-default" data-dismiss="modal" onclick="submit_post()">发表帖子</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="discuss-modal">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 style="color:brown"></h4>
            </div>
            <div class="modal-body" style="overflow-y: auto;max-height: calc(100vh - 210px)">
            </div>
            <div class="modal-footer">
                <button class="btn btn-info" data-toggle="modal" data-target="#reply-modal">回复帖子</button>
                <button class="btn btn-default" data-dismiss="modal">离开</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="reply-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4>回复帖子</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="reply">
                    <div class="form-group">
                        <label for="content" class="col-md-2 control-label">内容</label>
                        <div class="col-md-8">
                            <textarea class="form-control rows="3" placeholder="请输入内容" name="content"></textarea>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-default" data-dismiss="modal" onclick="submit_reply(this)" id="submit-reply">回复</button>
            </div>
        </div>
    </div>
</div>
    */
}.toString().slice(38, -4);
var FORUM_ROW_STR = function () {
    'use strict';
    /*
<div class="row forum-row">
    <div class="col-md-offset-1 col-md-10 thumbnail">
        <div class="col-md-3" style="border-right: 1px solid #EEE">
            <div class="row">
                <div style="padding: 10px 0 0 20px">
                    <label for="member-name"></label>
                </div>
            </div>
            <hr>
            <div class="row text-center">
                <img src="img/avatar.gif" alt="" style="max-width:120px;box-shadow:4px 4px 3px rgba(20%,20%,40%,0.5)">
            </div>
            <hr>
            <div class="row" name="para">
                <div class="col-md-4" style="border-right: 1px solid #EEE">
                    <span style="color:red"></span>
                    <br>
                    帖子
                </div>
                <div class="col-md-4" style="border-right: 1px solid #EEE">
                    <span style="color:red"></span>
                    <br>
                    回复
                </div>
                <div class="col-md-4">
                    <span style="color:red"></span>
                    <br>
                    积分
                </div>
            </div>
            <hr>
            <div class="row">
                <div style="padding: 0 0 10px 20px">
                    <span class="glyphicon glyphicon-envelope text-info" aria-hidden="true"></span>发消息
                </div>
            </div>
        </div>
        <div class="col-md-9">
            <div class="row">
                <div style="padding: 10px 0 0 20px" name="time">
                    <span class="glyphicon glyphicon-user text-success" aria-hidden="true"></span>
                    发表于
                </div>
            </div>
            <hr>
            <div class="row">
                <div style="padding: 0 10px">
                    <p>
                    </p>
                </div>
            </div>
            <hr>
            <div class="row">
                <div style="padding: 0 0 0 20px">
                    <a href="javascript:void(0)" onclick="submit_like(this, 1)">
                        <span class="glyphicon glyphicon-thumbs-up text-success" aria-hidden="true"></span>
                        支持
                    </a>
                    <a href="javascript:void(0)" onclick="submit_like(this, -1)">
                        <span class="glyphicon glyphicon-thumbs-down text-danger" aria-hidden="true"></span>
                        反对
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
    */
}.toString().slice(38, -4);
var ACCOUNT_PAGE_STR = function () {
    'use strict';
    /*
<div class="row">
    <div class="col-md-2 head-photo">
    </div>
    <div class="col-md-5">
        <h2>您好，<span></span><small></small></h2>
    </div>
    <div class="col-md-5">
        <h2><small>已有<u>0</u>人瀏覽您的資料</small?</h2>
    </div>
    <div class="col-md-5">
        <h3><small>帳戶安全</small>&nbsp;&nbsp;&nbsp;&nbsp;<span></span></h3>
        <h3><small>上次登錄</small>&nbsp;&nbsp;&nbsp;&nbsp;<span></span></h3>
    </div>
    <div class="col-md-5">
        <h3><small>可用餘額</small>&nbsp;&nbsp;&nbsp;&nbsp;&yen;<span>0.00</span></h3>
        <button class="btn btn-warning col-md-offset-1 col-md-4" onclick="charge()">充值</button>
        <button class="btn btn-primary col-md-offset-1 col-md-4" onclick="cash()">提現</button>
    </div>
</div>
<hr>
<div class="row">
    <div class="panel panel-default">
        <div class="panel-heading">
            用戶分析
        </div>
        <div class="panel-body">
            <div class="col-md-6">
                <canvas id="radar-chart"></canvas>
            </div>
            <div class="col-md-6">
                <table class="table table-bordered table-hover" id="member-statistic">
                    <thead>
                        <tr>
                            <th>社群数据</th>
                            <th>数值</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>标的关注</td>
                            <td><span></span>人</td>
                        </tr>
                        <tr>
                            <td>评价</td>
                            <td><span>好</span></td>
                        </tr>
                        <tr>
                            <td>论坛发文</td>
                            <td><span></span>篇</td>
                        </tr>
                        <tr>
                            <td>论坛留言</td>
                            <td><span></span>则</td>
                        </tr>
                        <tr>
                            <td>背书(赞)</td>
                            <td><span></span></td>
                        </tr>
                        <tr>
                            <td>好友数</td>
                            <td><span></span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
    */
}.toString().slice(38, -4);
var ACCOUNT_NAV_STR = function () {
    'use strict';
    /*
<a class="list-group-item pointer" onclick="load_account_page()">帐户首页</a>
<a class="list-group-item pointer" onclick="load_invest_manage_page()">投资管理</a>
<a class="list-group-item pointer" onclick="load_borrow_manage_page()">借款管理</a>
<a class="list-group-item pointer" onclick="load_friend_manage_page()">好友管理</a>
    */
}.toString().slice(38, -4);
var member, product, product_list, where_you_upload, my_images;

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

function clear_all_without_left_nav() {
    'use strict';
    $('div#modal').html('');
    $('div#content > div:nth-child(2)').html('');
    $('div#content > div:nth-child(3)').html('');
}

function get_product_by_serial(serial) {
    'use strict';
    var i;
    for (i = 0; i < product_list.length; i += 1) {
        if (Number(product_list[i].product_serial) === serial) {
            return product_list[i];
        }
    }
    return undefined;
}

function get_member_from_server() {
    'use strict';
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {};
            request.name = 'GET_MEMBER';
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            member = obj.content;
        }
    });
}

function toggle_asset_checkbox(input) {
    'use strict';
    var bool = $(input).prop('checked');
    if (bool === false) {
        $(input).prop('checked', false);
        $('input[name="asset"]').prop('disabled', false);
    } else {
        $('input[name="asset"]').prop('disabled', true);
        $('input[name="asset"]').prop('checked', false);
        $(input).prop('checked', true);
        $(input).prop('disabled', false);
    }
}

function toggle_submit_product() {
    'use strict';
    var bool = $('button.btn-warning').prop('disabled');
    if (bool === true) {
        $('button.btn-warning').prop('disabled', false);
    } else {
        $('button.btn-warning').prop('disabled', true);
    }
}

function display_my_image(a) {
    'use strict';
    var v = Number($(a).attr('value')), i;
    $('#sample-modal h4.modal-title').html(FILE_ATTR[v]);
    $('#sample-modal div.modal-body').html('');
    for (i = 0; i < my_images.length; i += 1) {
        if (Number(my_images[i].what) === v) {
            $('#sample-modal div.modal-body').append('<img src="../upload/uploads/' + my_images[i].name + '" class="sample-image">');
        }
    }
}

function start_upload(btn) {
    'use strict';
    var i, tmp;
    $('#image-upload-modal button.btn.btn-primary').attr('disabled', true);
    tmp = $(btn).parent().siblings('th').html();
    for (i = 0; i < FILE_ATTR.length; i += 1) {
        if (tmp === FILE_ATTR[i]) {
            where_you_upload = i;
            break;
        }
    }
}

function delete_message(btn) {
    'use strict';
    var serial = Number($(btn).parents('div.alert').attr('value'));
    $.ajax('php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {}, content = {};
            content.message_serial = serial;
            request.name = 'DELETE_MESSAGE';
            request.content = content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
        }
    });
}

function filter_slider_init() {
    'use strict';
    $("#complete-slider").slider({
        range: true,
        min: 0,
        max: 100,
        values: [0, 100],
        slide: function (event, ui) {
            $("#complete-lower").html(ui.values[0] + "%");
            $("#complete-upper").html(ui.values[1] + "%");
        }
    });
    $("#complete-lower").html($("#complete-slider").slider("values", 0) + "%");
    $("#complete-upper").html($("#complete-slider").slider("values", 1) + "%");
    
    $("#level-slider").slider({
        range: true,
        min: 0,
        max: 6,
        values: [0, 6],
        slide: function (event, ui) {
            $("#level-lower").html(LEVEL[ui.values[0]]);
            $("#level-upper").html(LEVEL[ui.values[1]]);
        }
    });
    $("#level-lower").html(LEVEL[$("#level-slider").slider("values", 0)]);
    $("#level-upper").html(LEVEL[$("#level-slider").slider("values", 1)]);
    
    $("#term-slider").slider({
        range: true,
        min: 0,
        max: 24,
        values: [0, 24],
        slide: function (event, ui) {
            $("#term-lower").html(ui.values[0] + "期");
            $("#term-upper").html(ui.values[1] + "期");
        }
    });
    $("#term-lower").html($("#term-slider").slider("values", 0) + "期");
    $("#term-upper").html($("#term-slider").slider("values", 1) + "期");
    
    $("#amount-slider").slider({
        range: true,
        min: 0,
        max: 999999,
        values: [0, 999999],
        slide: function (event, ui) {
            $("#amount-lower").html(ui.values[0] + "元");
            $("#amount-upper").html(ui.values[1] + "元");
        }
    });
    $("#amount-lower").html($("#amount-slider").slider("values", 0) + "元");
    $("#amount-upper").html($("#amount-slider").slider("values", 1) + "元");
}

function generate_product_row(para0, para1, para2, para3, para4, para5, para6) {
    'use strict';
    var row;
    row = '<tr class="product-content" value="' + para0 + '">';
    row += '<td><a onclick="display_product_modal(this)">' + para1 + '</a></td>';
    row += '<td class="text-center"><div class="progress"><div class="progress-bar" role="progressbar"></div></div>' + para2 + '</td>';
    row += '<td class="text-center">' + para3 + '</td>';
    row += '<td class="text-center">' + para4 + '</td>';
    row += '<td class="text-center">' + para5 + '</td>';
    row += '<td class="text-center">' + para6 + '期</td>';
    row += '<td>' + INVEST_COL_STR + '</td>';
    row += '</tr>';
    return row;
}

function generate_product_table(a) {
    'use strict';
    var i, per;
    $('tr').remove('.product-content');
    for (i = 0; i < a.length; i += 1) {
        $('table#product-list').append(generate_product_row(product_list[a[i]].product_serial,
                                                            product_list[a[i]].name,
                                                            product_list[a[i]].complete + '/' + product_list[a[i]].amount,
                                                            product_list[a[i]].amount,
                                                            product_list[a[i]].view,
                                                            LEVEL[Number(product_list[a[i]].level)],
                                                            product_list[a[i]].term));
        per = Math.floor(Number(product_list[a[i]].complete) * 100 / Number(product_list[a[i]].amount)) + '%';
        $('table#product-list div.progress-bar:last').width(per);
    }
}

function product_sort(th) {
    'use strict';
    var a = [], i, attr = $(th).attr('name'), tx, ty,
        sort_span = '<span class="glyphicon glyphicon-sort-by-attributes sort" aria-hidden="true"></span>',
        sort_alt_span = '<span class="glyphicon glyphicon-sort-by-attributes-alt sort" aria-hidden="true"></span>',
        t = $(th).html();
    $('span.sort').remove();
    if (t.search(sort_span) !== -1) {
        $(th).append(sort_alt_span);
        t = -1;
    } else if (t.search(sort_alt_span) !== -1) {
        $(th).append(sort_span);
        t = 1;
    } else {
        $(th).append(sort_span);
        t = 1;
    }
    for (i = 0; i < product_list.length; i += 1) {
        a.push(i);
    }
    if (attr === 'complete') {
        a.sort(function (x, y) {
            tx = Number(product_list[x][attr]) * 100 / Number(product_list[x].amount);
            ty = Number(product_list[y][attr]) * 100 / Number(product_list[y].amount);
            return (tx - ty) * t;
        });
    } else if (attr === 'level') {
        a.sort(function (x, y) {
            return (Number(product_list[y][attr]) - Number(product_list[x][attr])) * t;
        });
    } else {
        a.sort(function (x, y) {
            return (Number(product_list[x][attr]) - Number(product_list[y][attr])) * t;
        });
    }
    generate_product_table(a);
    filter_slider_init();
}

function filter() {
    'use strict';
    var complete_lower = $("#complete-slider").slider("values", 0),
        complete_upper = $("#complete-slider").slider("values", 1),
        amount_lower = $("#amount-slider").slider("values", 0),
        amount_upper = $("#amount-slider").slider("values", 1),
        level_lower = $("#level-slider").slider("values", 0),
        level_upper = $("#level-slider").slider("values", 1),
        term_lower = $("#term-slider").slider("values", 0),
        term_upper = $("#term-slider").slider("values", 1),
        i,
        complete,
        amount,
        level,
        term,
        a = [];
    for (i = 0; i < product_list.length; i += 1) {
        complete = Math.floor(Number(product_list[i].complete) * 100 / Number(product_list[i].amount));
        amount = Number(product_list[i].amount);
        level = Number(product_list[i].level);
        term = Number(product_list[i].term);
        if (complete >= complete_lower && complete <= complete_upper &&
                amount >= amount_lower && amount <= amount_upper &&
                level >= level_lower && level <= level_upper &&
                term >= term_lower && term <= term_upper) {
            a.push(i);
        }
    }
    generate_product_table(a);
    $('span.sort').remove();
}

function searcher() {
    'use strict';
    var a = [], keyword = $('input#keyword').val(), i;
    for (i = 0; i < product_list.length; i += 1) {
        if (product_list[i].name.search(keyword) !== -1) {
            a.push(i);
        }
    }
    generate_product_table(a);
}

function load_product_list() {
    'use strict';
    $.ajax('php/request.php', {
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
    get_member_from_server();
    $('body').removeClass('index-cover');
    $('div#content').html('<div class="col-md-2"></div><div class="col-md-8 thumbnail"></div><div class="col-md-2"></div>');
    $('div#content > div:eq(1)').html(HOME_PANEL_STR);
    $('div#navbar-collapse > ul:eq(0)').html(NAVBAR_STR);
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
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {};
            request.name = 'GET_MEMBER';
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            member = obj.content;
        }
    });
}

function display_product_modal(a) {
    'use strict';
    var i, tmp, name, borrower;
    tmp = Number($(a).parents('tr').attr('value'));
    for (i = 0; i < product_list.length; i += 1) {
        if (tmp === Number(product_list[i].product_serial)) {
            break;
        }
    }
    $('#product-modal h4 > u').html(('0000' + tmp).slice(-4));
    $('div#product-info > div.panel > div.panel-body').html(product_list[i].descript);
    $('div#product-info > table > tbody td:eq(0)').html(USAGE[Number(product_list[i].usage)]);
    $('div#product-info > table > tbody td:eq(1)').html(product_list[i].source);
    $('div#product-info > table > tbody td:eq(2)').html(product_list[i].rate);
    $('div#product-info > table > tbody td:eq(3)').html(product_list[i].time);
    $('div#product-info > table > tbody td:eq(4)').html(product_list[i].ps);
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {}, content = {};
            content.borrower = product_list[i].borrower;
            request.name = 'GET_NUM_BORROW';
            request.content = content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            $('div#member-info > table > tbody td:eq(6)').html(obj.content.total);
            $('div#member-info > table > tbody td:eq(7)').html(obj.content.complete);
        }
    });
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {}, content = {};
            content.borrower = product_list[i].borrower;
            request.name = 'GET_BORROWER';
            request.content = content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            var age = Math.floor(((new Date()).getTime() - (new Date(obj.content.birth)).getTime()) / 31536000000);
            $('div#member-info > table > tbody td:eq(0)').html((obj.content.gender === '0') ? '女' : '男');
            $('div#member-info > table > tbody td:eq(1)').html(age);
            $('div#member-info > table > tbody td:eq(2)').html(MARRIAGE[Number(obj.content.marriage)]);
            $('div#member-info > table > tbody td:eq(3)').html(EDUCATION[Number(obj.content.education)]);
            $('div#member-info > table > tbody td:eq(4)').html(((Number(obj.content.asset) & 8) === 0) ? '無' : '有');
            $('div#member-info > table > tbody td:eq(5)').html(((Number(obj.content.asset) & 4) === 0) ? '無' : '有');
            borrower = obj.content.user_serial;
        }
    });
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {}, content = {};
            content.user_serial = borrower;
            request.name = 'GET_SCORE';
            request.content = content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            $('a[href="#member-info"]').on('shown.bs.tab', function () {
                $('div#member-info > div.panel > div.panel-body').html('<canvas id="radar-chart"></canvas>');
                new Chart(document.getElementById("radar-chart").getContext("2d")).Radar({
                    labels: ["身份特质", "信用评分", "徵信资料", "人脉关係", "交易纪录"],
                    datasets: [
                        {
                            fillColor: "rgba(220,220,220,0.2)",
                            data: obj.content
                        }
                    ]
                }, {
                    responsive: true
                });
            });
        },
        complete: function (obj) {
            //alert(JSON.stringify(obj));
        }
    });
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {}, content = {};
            content.product_serial = product_list[i].product_serial;
            request.name = 'GET_PRODUCT_TRANSACTION';
            request.content = content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            $('div#history > table > tbody').html('');
            for (i = 0; i < obj.content.length; i += 1) {
                $('div#history > table > tbody').append('<tr></tr>');
                $('div#history > table > tbody > tr:last').append('<td>user' + ('0000' + obj.content[i].loaner).slice(-4) + '</td>');
                $('div#history > table > tbody > tr:last').append('<td>' + obj.content[i].rate + '</td>');
                $('div#history > table > tbody > tr:last').append('<td>' + obj.content[i].amount + '</td>');
                $('div#history > table > tbody > tr:last').append('<td>' + obj.content[i].time + '</td>');
            }
        }
    });
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {}, content = {};
            content.user_serial = borrower;
            request.name = 'GET_AUTHEN';
            request.content = content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            var name;
            for (name in obj.content) {
                if (obj.content[name] === true) {
                    $('div#judge > table > tbody > tr[name="' + name + '"] > td:nth-child(2)').html(
                        '<span class="glyphicon glyphicon-ok" aria-hidden="true" style="color:green"></span>'
                    );
                    $('div#judge > table > tbody > tr[name="' + name + '"] > td:nth-child(3)').html(obj.content[name + '_time'].slice(0, 10));
                } else {
                    $('div#judge > table > tbody > tr[name="' + name + '"] > td:nth-child(2)').html(
                        '<span class="glyphicon glyphicon-remove" aria-hidden="true" style="color:red"></span>'
                    );
                    $('div#judge > table > tbody > tr[name="' + name + '"] > td:nth-child(3)').html('-----');
                }
            }
        }
    });
    $('#product-modal').modal('show');
    $.ajax('php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {}, content = {};
            content.product_serial = tmp;
            request.name = 'VIEW_PRODUCT';
            request.content = content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
        }
    });
    $('a[href="#product-info"]').click();
}

function display_post(a) {
    'use strict';
    var serial = Number($(a).attr('value')), i;
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {}, content = {};
            content.post_serial = serial;
            request.name = 'GET_POST_AND_REPLY';
            request.content = content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            $('div#discuss-modal h4').html($(a).children('span:nth-child(2)').text());
            $('div#discuss-modal div.modal-body').html('');
            for (i = 0; i < obj.content.length; i += 1) {
                var credit = Number(obj.content[i].num_post) * 5 + Number(obj.content[i].num_reply) * 3 + Number(obj.content[i].like);
                $('div#discuss-modal div.modal-body').append(FORUM_ROW_STR);
                $('div#discuss-modal div.modal-body > div.row:last').attr('member', obj.content[i].user_serial);
                $('div#discuss-modal div.modal-body > div.row:last label[for="member-name"]').html(obj.content[i].last_name + obj.content[i].first_name);
                $('div#discuss-modal div.modal-body > div.row:last div[name="para"] span:eq(0)').html(obj.content[i].num_post);
                $('div#discuss-modal div.modal-body > div.row:last div[name="para"] span:eq(1)').html(obj.content[i].num_reply);
                $('div#discuss-modal div.modal-body > div.row:last div[name="para"] span:eq(2)').html(credit);
                $('div#discuss-modal div.modal-body > div.row:last div[name="time"]').append(obj.content[i].time);
                $('div#discuss-modal div.modal-body > div.row:last p').html(obj.content[i].content);
            }
            $('button#submit-reply').attr('post_serial', serial);
        },
        complete: function (obj) {
            //alert(JSON.stringify(obj));
            //alert($(a).children('span:nth-child(2)').text());
        }
    });
}

function change_sample_modal(a) {
    'use strict';
    var i, tmp = $(a).parent().prev().html();
    for (i = 0; i < FILE_ATTR.length; i += 1) {
        if (tmp === FILE_ATTR[i]) {
            break;
        }
    }
    $('#sample-modal h4.modal-title').html('示例图片');
    $('#sample-modal div.modal-body').html('');
    if (tmp === '身份证') {
        $('#sample-modal div.modal-body').append('<img src="img/' + FILE_IMG[i][0] + '" class="sample-image">');
        $('#sample-modal div.modal-body').append('<img src="img/' + FILE_IMG[i][1] + '" class="sample-image">');
        $('#sample-modal div.modal-body').append('<img src="img/' + FILE_IMG[i][2] + '" class="sample-image">');
    } else {
        $('#sample-modal div.modal-body').append('<img src="img/' + FILE_IMG[i] + '" class="sample-image">');
    }
}

function load_invest_page() {
    'use strict';
    var i, per, a = [];
    clear_all();
    $('div#navbar-collapse > ul:first > li:nth-child(1)').addClass('active');
    $('div#content > div:nth-child(2)').html(INVEST_PAGE_STR);
    $('div#modal').html(RATE_MODAL_STR + FILTER_MODAL_STR + PRODUCT_MODAL_STR);
    $('div#modal').append(CHARGE_MODAL_STR + AUTHEN_MODAL_STR + INVEST_MODAL_STR);
    $('form').submit(function () {
        return false;
    });
    filter_slider_init();
    load_product_list();
    get_member_from_server();
    for (i = 0; i < product_list.length; i += 1) {
        a.push(i);
    }
    generate_product_table(a);
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
    $('div#content > div:nth-child(2)').html('');
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
                                                                       ' value="' + i + '" onclick="load_borrow_detail_page(this)">立即申请</button>');
    }
}

function load_borrow_detail_page(btn) {
    'use strict';
    var i;
    get_member_from_server();
    if (Number(member.authority) === 1) {
        alert('投资身份无法借款');
        return;
    }
    $('div#content > div:nth-child(1) > a').removeClass('active');
    $('div#content > div:nth-child(1) > a:nth-child(2)').addClass('active');
    $('div#content > div:nth-child(2)').html(PROFILE_STR);
    if (btn === undefined) {
        i = $.cookie('work_status');
    } else {
        i = $(btn).val();
    }
    if (i === '0') {
        $(DETAIL_WORKER_STR).insertBefore('form > div.form-group:has(div.col-md-offset-8)');
        $.cookie('work_status', 0, 30, '/');
    } else if (i === '1') {
        $(DETAIL_STORE_STR).insertBefore('form > div.form-group:has(div.col-md-offset-8)');
        $.cookie('work_status', 1, 30, '/');
    } else if (i === '2') {
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
    $('input[name="birth"]').datepicker({
        dateFormat: 'yy-mm-dd'
    });
    if ($.cookie('first_name') !== undefined) {
        $.ajax('php/request.php', {
            dataType: 'json',
            data: (function () {
                var request = {};
                request.name = 'GET_MEMBER';
                request.content = {};
                return 'request=' + JSON.stringify(request);
            }()),
            type: 'POST',
            success: function (obj) {
                var name, i, a;
                for (name in obj.content) {
                    if (name === 'gender' || name === 'insurance' || name === 'marriage' || name === 'child') {
                        $('input[name="' + name + '"]').val([obj.content[name]]);
                    } else if (name === 'work_department') {
                        if ($.cookie('work_status') === '1') {
                            $('select[name="' + name + '"]').val(obj.content[name]);
                        } else {
                            $('input[name="' + name + '"]').val(obj.content[name]);
                        }
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
                $('div.form-group:has(label[for="authen"])').remove();
                $('input, select').attr('disabled', true);
            }
        });
    }
}

function charge() {
    'use strict';
    get_member_from_server();
    $('form#charge input#amount').val(member.remain);
    if (member.first_name === null) {
        $('#authen-modal').modal('show');
    } else {
        $('#charge-modal').modal('show');
    }
}

function cash() {
    'use strict';
    get_member_from_server();
    $('form#cash input#amount').val(member.remain);
    if (member.first_name === null) {
        $('#authen-modal').modal('show');
    } else {
        $('#cash-modal').modal('show');
    }
}

function load_account_page() {
    'use strict';
    var i, score;
    clear_all();
    get_member_from_server();
    $('div#navbar-collapse > ul:first > li:nth-child(3)').addClass('active');
    $('div#content > div:nth-child(1)').html(ACCOUNT_NAV_STR);
    $('div#content > div:nth-child(1) > a:nth-child(1)').addClass('active');
    $.ajax('php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {};
            request.name = 'GET_MY_MESSAGE';
            request.content = {};
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            for (i = 0; i < obj.content.length; i += 1) {
                if (Number(obj.content[i].type) === 0) {
                    $('div#content > div:nth-child(3)').append(
                        '<div class="alert alert-info" value="' + obj.content[i].message_serial + '">' +
                            ALERT_DISMISS_STR +
                            'user' + ('0000' + obj.content[i].sender).slice(-4) + '借了您' + obj.content[i].content + '元' +
                            '</div>'
                    );
                } else if (Number(obj.content[i].type) === 1) {
                    $('div#content > div:nth-child(3)').append(
                        '<div class="alert alert-danger" value="' + obj.content[i].message_serial + '">' +
                            ALERT_DISMISS_STR +
                            '您的"' +  obj.content[i].content + '"已滿標, 借款已自動匯入您的戶頭' +
                            '</div>'
                    );
                } else if (Number(obj.content[i].type) === 2) {
                    $('div#content > div:nth-child(3)').append(
                        '<div class="alert alert-warning" value="' + obj.content[i].message_serial + '">' +
                            ALERT_DISMISS_STR +
                            '您的 ' +  RELATION[Number(obj.content[i].content.split('|')[1])] + ' ' + obj.content[i].content.split('|')[0] +
                            ' 想加您为好友<hr><div class="text-right"><button class="btn btn-success btn-sm" onclick="add_friend(this)" data-dismiss="alert">确认</button></div>' +
                            '</div>'
                    );
                } else if (Number(obj.content[i].type) === 3) {
                    $('div#content > div:nth-child(3)').append(
                        '<div class="alert alert-success" value="' + obj.content[i].message_serial + '">' +
                            ALERT_DISMISS_STR +
                            '您和 ' +  obj.content[i].content + ' 已成为好友' +
                            '</div>'
                    );
                }
            }
        }
    });
    $('div#content > div:nth-child(2)').html(ACCOUNT_PAGE_STR);
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {}, content = {};
            content.user_serial = $.cookie('user_serial');
            request.name = 'GET_SCORE';
            request.content = content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            new Chart(document.getElementById("radar-chart").getContext("2d")).Radar({
                labels: ["身份特质", "信用评分", "徵信资料", "人脉关係", "交易纪录"],
                datasets: [
                    {
                        fillColor: "rgba(220,220,220,0.2)",
                        data: obj.content
                    }
                ]
            }, {
                responsive: true
            });
        },
        complete: function (obj) {
            //alert(JSON.stringify(obj));
        }
    });
    $('div#content > div:nth-child(2) h2:eq(0) > span').html(member.last_name);
    if (member.gender === '0') {
        $('div#content > div:nth-child(2) h2:eq(0) > span').append('女士');
    } else if (member.gender === '1') {
        $('div#content > div:nth-child(2) h2:eq(0) > span').append('先生');
    }
    if ($.cookie('first_name') === undefined) {
        $('div#content > div:nth-child(2) h3:eq(0) > span').html('低').css('color', 'red');
    } else {
        $('div#content > div:nth-child(2) h3:eq(0) > span').html('高').css('color', 'green');
    }
    $('div#content > div:nth-child(2) h3:eq(1) > span').html(member.latest_sign_in);
    $('div#content > div:nth-child(2) h3:eq(2) > span').html(member.remain + '.00');
    $('div#modal').html(CHARGE_MODAL_STR + AUTHEN_MODAL_STR + CASH_MODAL_STR);
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {};
            request.name = 'GET_NUM_FOCUS_MY_PRODUCT';
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            $('table#member-statistic > tbody > tr:nth-child(1) > td:nth-child(2) > span').html(obj.content);
        }
    });
    $('table#member-statistic > tbody > tr:nth-child(3) > td:nth-child(2) > span').html(member.num_post);
    $('table#member-statistic > tbody > tr:nth-child(4) > td:nth-child(2) > span').html(member.num_reply);
    $('table#member-statistic > tbody > tr:nth-child(5) > td:nth-child(2) > span').html(member.like);
    $('table#member-statistic > tbody > tr:nth-child(6) > td:nth-child(2) > span').html(member.friend.split(/\|/).length - 1);
}

function load_forum_page() {
    'use strict';
    var i;
    clear_all();
    $('div#navbar-collapse > ul:first > li:nth-child(4)').addClass('active');
    $('div#content > div:nth-child(2)').html(FORUM_PAGE_STR);
    $('div#modal').html(FORUM_MODAL_STR);
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {};
            request.name = 'GET_FORUM_GLOBAL';
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            $('span[name="today_member"]').html(Math.ceil(Number(obj.content.total_member) * Math.random()));
            $('span[name="yesterday_member"]').html(Math.ceil(Number(obj.content.total_member) * Math.random()));
            $('span[name="total_post"]').html(obj.content.total_post);
            $('span[name="total_member"]').html(obj.content.total_member);
        }
    });
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {}, content = {};
            request.name = 'GET_POPULAR_POST';
            request.content = content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            obj.content.sort(function (x, y) {
                var tx = x.time.split(/[: \-]/g).map(Number),
                    ty = y.time.split(/[: \-]/g).map(Number);
                return ((new Date(ty[0], ty[1], ty[2], ty[3], ty[4], ty[5], 0)).getTime()) - ((new Date(tx[0], tx[1], tx[2], tx[3], tx[4], tx[5], 0)).getTime());
            });
            for (i = 0; i < 5 && i < obj.content.length; i += 1) {
                $('ul#latest-post-list').append('<a class="list-group-item" onclick="display_post(this)" href="javascript:void(0)"' +
                                                ' data-toggle="modal" data-target="#discuss-modal"' +
                                                 ' value="' + obj.content[i].post_serial + '">' +
                                                '<span class="badge">' + obj.content[i].num_replies + '</span><span>' +
                                                obj.content[i].title + '</span></a>'
                                                );
            }
            obj.content.sort(function (x, y) {
                var tx = x.latest_reply.split(/[: \-]/g).map(Number),
                    ty = y.latest_reply.split(/[: \-]/g).map(Number);
                return ((new Date(ty[0], ty[1], ty[2], ty[3], ty[4], ty[5], 0)).getTime()) - ((new Date(tx[0], tx[1], tx[2], tx[3], tx[4], tx[5], 0)).getTime());
            });
            for (i = 0; i < 5 && i < obj.content.length; i += 1) {
                $('ul#latest-reply-list').append('<a class="list-group-item" onclick="display_post(this)" href="javascript:void(0)"' +
                                                 ' data-toggle="modal" data-target="#discuss-modal"' +
                                                 ' value="' + obj.content[i].post_serial + '">' +
                                                '<span class="badge">' + obj.content[i].num_replies + '</span><span>' +
                                                obj.content[i].title + '</span></a>'
                                                );
            }
            $('div#just-reply').html('<a onclick="display_post(this)" href="javascript:void(0)"' +
                                     ' data-toggle="modal" data-target="#discuss-modal"' +
                                     ' value="' + obj.content[0].post_serial + '"><span></span>' +
                                     '<span>' + obj.content[0].title + '</span></a>' + '<br><span class="ps">刚刚</span>'
                                    );
            obj.content.sort(function (x, y) {
                return Number(y.num_replies) - Number(x.num_replies);
            });
            for (i = 0; i < 5 && i < obj.content.length; i += 1) {
                $('ul#most-reply-list').append('<a class="list-group-item" onclick="display_post(this)" href="javascript:void(0)"' +
                                               ' data-toggle="modal" data-target="#discuss-modal"' +
                                                 ' value="' + obj.content[i].post_serial + '">' +
                                                '<span class="badge">' + obj.content[i].num_replies + '</span><span>' +
                                                obj.content[i].title + '</span></a>'
                                                );
            }
        }
    });
}

function add_friend(btn) {
    'use strict';
    $.ajax('php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {}, content = {};
            content.message_serial = Number($(btn).parents('div.alert').attr('value'));
            request.name = 'ADD_FRIEND';
            request.content = content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
        }
    });
}

function load_invest_manage_page() {
    'use strict';
    var i;
    clear_all_without_left_nav();
    $('div#content > div:nth-child(1) > a').removeClass('active');
    $('div#content > div:nth-child(1) > a:nth-child(2)').addClass('active');
    $('div#content > div:nth-child(2)').html(INVEST_MANAGE_PAGE_STR);
    $.ajax('php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {};
            request.name = 'GET_MY_INVEST';
            request.content = {};
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            var total_invest = 0, t1, t2, t3, tmp, times;
            for (i = 0; i < obj.content.length; i += 1) {
                t1 = Number(obj.content[i].complete);
                t2 = Number(obj.content[i].total);
                total_invest += Number(obj.content[i].amount);
                if (t1 < t2) {
                    tmp = Number(obj.content[i].amount) * (1 + (Number(obj.content[i].rate) * 0.01 * Number(obj.content[i].term) / 12));
                    $('table#investing > tbody').append('<tr></tr>');
                    $('table#investing > tbody > tr:last').append('<td>' + obj.content[i].last_name + ' ' + obj.content[i].first_name + '</td>');
                    $('table#investing > tbody > tr:last').append('<td>' + obj.content[i].name + '</td>');
                    $('table#investing > tbody > tr:last').append('<td>' + obj.content[i].amount + '</td>');
                    $('table#investing > tbody > tr:last').append('<td>' + tmp.toFixed(2) + '</td>');
                    $('table#investing > tbody > tr:last').append('<td>' + obj.content[i].rate + '%</td>');
                    $('table#investing > tbody > tr:last').append('<td>' + obj.content[i].term + '期</td>');
                    $('table#investing > tbody > tr:last').append('<td>' + WORK_STATUS[Number(obj.content[i].work_status)] + '</td>');
                    $('table#investing > tbody > tr:last').append('<td>' + obj.content[i].time + '</td>');
                } else {
                    times = Number(obj.content[i].term);
                    t3 = Math.floor(Math.random() * times) + 1;
                    tmp = Date.parse(obj.content[i].complete_date);
                    tmp += t3 * 2592000000;
                    tmp = ((new Date(tmp)).toISOString()).slice(0, 10);
                    t1 = Number(obj.content[i].amount) / Number(obj.content[i].term);
                    t2 = t1 * (Number(obj.content[i].rate) * 0.01 / 12);
                    $('table#paying > tbody').append('<tr></tr>');
                    $('table#paying > tbody > tr:last').append('<td>' + t3 + '/' + times + '</td>');
                    $('table#paying > tbody > tr:last').append('<td>' + obj.content[i].last_name + ' ' + obj.content[i].first_name + '</td>');
                    $('table#paying > tbody > tr:last').append('<td>' + obj.content[i].name + '</td>');
                    $('table#paying > tbody > tr:last').append('<td>' + tmp + '</td>');
                    $('table#paying > tbody > tr:last').append('<td>' + (t1 + t2).toFixed(2) + '</td>');
                    $('table#paying > tbody > tr:last').append('<td>' + t1.toFixed(2) + '</td>');
                    $('table#paying > tbody > tr:last').append('<td>' + t2.toFixed(2) + '</td>');
                }
            }
            $('span#statistic-info > span:nth-child(1)').html(total_invest);
        }
    });
    $('div#calendar').calendar({
        tmpl_path: 'js/tmpls/',
        events_source: (function () {
            return [];
        }()),
        language: 'zh-CN'
    });
}

function load_borrow_manage_page() {
    'use strict';
    var i;
    clear_all_without_left_nav();
    $('div#content > div:nth-child(1) > a').removeClass('active');
    $('div#content > div:nth-child(1) > a:nth-child(3)').addClass('active');
    $('div#content > div:nth-child(2)').html(BORROW_MANAGE_PAGE_STR);
    $.ajax('php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {};
            request.name = 'GET_MY_BORROW';
            request.content = {};
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            for (i = 0; i < obj.content.length; i += 1) {
                if (Number(obj.content[i].complete) < Number(obj.content[i].amount)) {
                    $('table#borrowing > tbody').append('<tr></tr>');
                    $('table#borrowing > tbody > tr:last').append('<td>' + obj.content[i].name + '</td>');
                    $('table#borrowing > tbody > tr:last').append('<td>' + obj.content[i].product_serial + '</td>');
                    $('table#borrowing > tbody > tr:last').append('<td>' + obj.content[i].term + '</td>');
                    $('table#borrowing > tbody > tr:last').append('<td>' + obj.content[i].time + '</td>');
                    $('table#borrowing > tbody > tr:last').append('<td>' + obj.content[i].amount + '</td>');
                    $('table#borrowing > tbody > tr:last').append('<td>' + obj.content[i].rate + '%</td>');
                } else {
                    var tmp, t1, t2, t3, t4;
                    tmp = Date.parse(obj.content[i].complete_date);
                    t2 = Math.floor(Math.random() * Number(obj.content[i].term) + 1);
                    tmp += Number(t2) * 2592000000;
                    tmp = ((new Date(tmp)).toISOString()).slice(0, 10);
                    t4 = Number(obj.content[i].amount) / Number(obj.content[i].term);
                    t1 = t4 * Number(obj.content[i].rate) * 0.01 / 12;
                    t3 = ((new Date()).getTime() - (new Date(tmp)).getTime());
                    t3 = t3 < 0 ? 0 : (t3 / 86400000);
                    $('table#complete > tbody').append('<tr></tr>');
                    $('table#complete > tbody > tr:last').append('<td>' + obj.content[i].name + '</td>');
                    $('table#complete > tbody > tr:last').append('<td>' + obj.content[i].product_serial + '</td>');
                    $('table#complete > tbody > tr:last').append('<td>' + t2 + '/' + obj.content[i].term + '</td>');
                    $('table#complete > tbody > tr:last').append('<td>' + obj.content[i].complete_date + '</td>');
                    $('table#complete > tbody > tr:last').append('<td>' + tmp + '</td>');
                    $('table#complete > tbody > tr:last').append('<td>' + (t4 + t1).toFixed(2) + '</td>');
                    $('table#complete > tbody > tr:last').append('<td>' + t4.toFixed(2) + '</td>');
                    $('table#complete > tbody > tr:last').append('<td>' + t1.toFixed(2) + '</td>');
                    $('table#complete > tbody > tr:last').append('<td>' + t3 + '</td>');
                    $('table#complete > tbody > tr:last').append('<td>' + ((t2 - 1) * 100 / Number(obj.content[i].term)).toFixed(1) + '%</td>');
                }
            }
        }
    });
}

function load_friend_manage_page() {
    'use strict';
    var i;
    clear_all_without_left_nav();
    $('div#content > div:nth-child(1) > a').removeClass('active');
    $('div#content > div:nth-child(1) > a:nth-child(4)').addClass('active');
    $('div#content > div:nth-child(2)').html(FRIEND_MANAGE_PAGE_STR);
    for (i = 0; i < RELATION.length; i += 1) {
        $('select[name="relation"]').append('<option value="' + i + '">' + RELATION[i] + '</option>');
    }
    $('button#add-friend').on('click', function () {
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        if (!(reg.test($('input[name="email"]').val()))) {
            alert('请检查邮箱');
            return;
        } else if ($('select#relation').val() === '0') {
            alert('请检查关係');
            return;
        }
        $.ajax('php/request.php', {
            dataType: 'json',
            data: (function () {
                var request = {}, content = {};
                content.email = $('input[name="email"]').val();
                content.relation = $('select#relation').val();
                request.name = 'INVITE_FRIEND';
                request.content = content;
                return 'request=' + JSON.stringify(request);
            }()),
            type: 'POST',
            success: function (obj) {
                if (obj.title === 'ERROR') {
                    alert('无用户使用此信箱');
                } else {
                    alert('邀请已送出');
                    $('a.list-group-item:eq(3)').click();
                }
            }
        });
    });
    $.ajax('php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {}, content = {};
            request.name = 'GET_MY_FRIEND';
            request.content = content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            var j;
            if (obj.title === 'ERROR') {
                return;
            }
            for (i = 0; i < obj.content.length; i += 1) {
                $('table#friend-list > tbody').append('<tr></tr>');
                $('table#friend-list > tbody > tr:last').append('<td>' + obj.content[i][1] + '</td>');
                $('table#friend-list > tbody > tr:last').append('<td>' + RELATION[obj.content[i][2]] + '</td>');
                if (obj.content[i][3]) {
                    $('table#friend-list > tbody > tr:last').append('<td>朋友</td>');
                } else {
                    $('table#friend-list > tbody > tr:last').append('<td>邀请中</td>');
                }
            }
        }
    });
}

function load_product_info_page() {
    'use strict';
    var i, name;
    $('div#content > div:nth-child(1) > a').removeClass('active');
    $('div#content > div:nth-child(1) > a:nth-child(3)').addClass('active');
    $('div#modal').html('');
    $('div#content > div:nth-child(2)').html(PRODUCT_DETAIL_STR);
    for (i = 0; i < USAGE.length; i += 1) {
        $('select[name="usage"]').append('<option value="' + i + '">' + USAGE[i] + '</option>');
    }
    if (product !== null && product !== undefined) {
        for (name in product) {
            if (name === 'usage') {
                $('select#' + name.replace('_', '-')).val(product[name]);
            } else if (name === 'descript' || name === 'ps') {
                $('textarea[name="' + name + '"]').val(product[name]);
            } else {
                $('input[name="' + name + '"]').val(product[name]);
            }
        }
    } else if ($.cookie('product_buffer') !== undefined) {
        product = JSON.parse($.cookie('product_buffer'));
        for (name in product) {
            if (name === 'usage') {
                $('select#' + name.replace('_', '-')).val(product[name]);
            } else if (name === 'descript' || name === 'ps') {
                $('textarea[name="' + name + '"]').val(product[name]);
            } else {
                $('input[name="' + name + '"]').val(product[name]);
            }
        }
    }
}

function load_product_confirm_page() {
    'use strict';
    var name, tmp, obj, i, patt = /(?:\S*?):(\S*?)\|/g, match, friend_count, has_parents;
    get_member_from_server();
    $('div#content > div:nth-child(1) > a:nth-child(4)').removeClass('active');
    $('div#content > div:nth-child(1) > a:nth-child(5)').addClass('active');
    $('div#content > div:nth-child(2)').html(CONFIRM_PAGE_STR);
    $('div#modal').html(CLAUSE_MODAL + SAMPLE_MODAL_STR);
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
                if ($.cookie('work_status') === '0') {
                    $('ul#member').append('<li>公司名稱:' + member[name] + '</li>');
                } else if ($.cookie('work_status') === '1') {
                    $('ul#member').append('<li>店铺链接:' + member[name] + '</li>');
                } else {
                    $('ul#member').append('<li>学校名称:' + member[name] + '</li>');
                }
            } else if (name === 'work_years') {
                $('ul#member').append('<li>公作年限:' + WORK_YEAR[Number(member[name])] + '</li>');
            } else if (name === 'work_state') {
                $('ul#member').append('<li>单位省份:' + STATES[Number(member[name])] + '</li>');
            } else if (name === 'work_address') {
                $('ul#member').append('<li>单位地址:' + member[name] + '</li>');
            } else if (name === 'work_phone') {
                if ($.cookie('work_status') === '0') {
                    $('ul#member').append('<li>单位电话:' + member[name] + '</li>');
                } else {
                    $('ul#member').append('<li>学校电话:' + member[name] + '</li>');
                }
            } else if (name === 'work_department') {
                if ($.cookie('work_status') === '0') {
                    $('ul#member').append('<li>任职部门:' + member[name] + '</li>');
                } else {
                    $('ul#member').append('<li>经营网店:' + STORES[Number(member[name])] + '</li>');
                }
            } else if (name === 'work_title') {
                if ($.cookie('work_status') === '0') {
                    $('ul#member').append('<li>任职职位:' + member[name] + '</li>');
                } else {
                    $('ul#member').append('<li>卖家昵称:' + member[name] + '</li>');
                }
            }
        }
    }
    for (name in product) {
        if (product[name] !== null) {
            if (name === 'name') {
                $('ul#product').append('<li>借款名称:' + product[name] + '</li>');
            } else if (name === 'term') {
                $('ul#product').append('<li>还款期数:' + product[name] + '期</li>');
            } else if (name === 'usage') {
                $('ul#product').append('<li>借款用途:' + USAGE[Number(product[name])] + '</li>');
            } else if (name === 'amount') {
                $('ul#product').append('<li>借款金额:' + product[name] + '</li>');
            } else if (name === 'source') {
                $('ul#product').append('<li>还款来源:' + product[name] + '</li>');
            } else if (name === 'descript') {
                $('ul#product').append('<li>借款简介:' + product[name] + '</li>');
            } else if (name === 'ps') {
                $('ul#product').append('<li>附注:' + product[name] + '</li>');
            } else if (name === 'level') {
                $('ul#product').append('<li>借款等级:' + LEVEL[Number(product[name])] + '</li>');
            } else if (name === 'rate') {
                $('ul#product').append('<li>借款利率:' + product[name] + '</li>');
            }
        }
    }
    tmp = [];
    for (i = 0; i < FILE_ATTR.length; i += 1) {
        tmp[i] = 0;
    }
    for (i = 0; i < my_images.length; i += 1) {
        tmp[Number(my_images[i].what)] += 1;
    }
    for (i = 0; i < FILE_ATTR.length; i += 1) {
        if (tmp[i] > 0) {
            $('ul#image').append('<li>' + FILE_ATTR[i] + ': ' + tmp[i] + '张&nbsp;<a value="' + i + '" data-toggle="modal" data-target="#sample-modal" onclick="display_my_image(this)">查看</a>' + '</li>');
        }
    }
    match = patt.exec(member.friend);
    friend_count = 0;
    has_parents = false;
    while (match !== null) {
        friend_count += 1;
        if (match[1] === '1') {
            has_parents = true;
        }
        match = patt.exec(member.friend);
    }
    $('td#friend-number').html('您有<u>' + friend_count + '</u>位好友');
    if (has_parents) {
        $('td#friend-number').append('(含父母)');
    }
    if ($.cookie('work_status') === '2' && has_parents === false) {
        $('td#friend-alert').html('<div class="alert alert-danger" role="alert">学生借款必须邀请父(母)亲成为好友' +
                                  '<a class="ps" onclick="link_to_add_friend()">&nbsp;请至:我的帐户 > 好友管理</a></div>'
                                 );
        $('input[type="checkbox"]').prop('disabled', true);
    } else if (friend_count < 2) {
        $('td#friend-alert').html('<div class="alert alert-warning" role="alert">您的好友數不足，請再邀請<u>' + (2 - friend_count) + '</u>位好友' +
                                  '<a class="ps" onclick="link_to_add_friend()">&nbsp;请至:我的帐户 > 好友管理</a></div>'
                                 );
        $('input[type="checkbox"]').prop('disabled', true);
    } else {
        $('td#friend-alert').html('<div class="alert alert-success" role="alert">您的好友数已经足够，请前往下一步</div>');
    }
}

function load_upload_page() {
    'use strict';
    var i, tmpa = [];
    for (i = 0; i < FILE_ATTR.length; i += 1) {
        tmpa[i] = 0;
    }
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {};
            request.name = 'GET_MY_IMAGE';
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            my_images = obj.content;
            for (i = 0; i < my_images.length; i += 1) {
                tmpa[Number(my_images[i].what)] += 1;
            }
        }
    });
    $('div#content > div:nth-child(1) > a').removeClass('active');
    $('div#content > div:nth-child(1) > a:nth-child(4)').addClass('active');
    $('div#content > div:nth-child(2)').html(FILE_UPLOAD_STR);
    for (i = 0; i < FILE_ATTR.length; i += 1) {
        $('table#file-list').append('<tr><th>' + FILE_ATTR[i] + '</th><td>' + FILE_DESC[i] +
                                    '<a href="javascript:void(0)" onclick="change_sample_modal(this)" data-toggle="modal" data-target="#sample-modal">示例圖片</a></td><td>' + tmpa[i] + '</td><td><button class="btn btn-info" data-toggle="modal" data-target="#image-upload-modal" onclick="start_upload(this)">上傳</button>&nbsp;&nbsp;&nbsp;<a value="' + i + '" data-toggle="modal" data-target="#sample-modal" onclick="display_my_image(this)">查看</a></td></tr>');
    }
    $('div#modal').html(IMAGE_UPLOAD_MODAL_STR + SAMPLE_MODAL_STR);
    $('.filestyle').fileinput({
        uploadUrl: UPLOAD_URL,
        language: 'zh',
        maxFilesNum: 1,
        allowedFileTypes: ['image']
    });
    $('.filestyle').on('fileuploaded', function (event, rdata) {
        $('#image-upload-modal button.btn.btn-primary').attr('disabled', false);
        $.ajax('php/request.php', {
            dataType: 'json',
            data: (function () {
                var request = {}, content = {};
                content.name = rdata.response[0];
                content.user_serial = Number($.cookie('user_serial'));
                content.what = where_you_upload;
                request.name = 'UPLOADED_IMAGE';
                request.content = content;
                return 'request=' + JSON.stringify(request);
            }()),
            type: 'POST',
            success: function (obj) {
                my_images = obj.content;
                i = Number($('table#file-list tr:eq(' + (where_you_upload + 1) + ') > td:eq(1)').html());
                $('table#file-list tr:eq(' + (where_you_upload + 1) + ') > td:eq(1)').html((i + 1));
            }
        });
    });
}

function submit_borrow_detail() {
    'use strict';
    var warning = '';
    if (!(/^\S[\s\S]*$/.test($('input[name="first_name"]').val())) || !(/^\S[\s\S]*$/.test($('input[name="last_name"]').val()))) {
        warning += '姓名 ';
    }
    if (!(/^\d+$/.test($('input[name="uid"]').val()))) {
        warning += '身份证 ';
    }
    if ($('input[name="uid"]').val().length !== 18) {
        alert('身份证須等于18字');
        return;
    }
    if (!(/^\d+$/.test($('input[name="cellphone"]').val()))) {
        warning += '手机号 ';
    }
    if ($('input[name="cellphone"]').val().length !== 11) {
        alert('手机号須等于11字');
        return;
    }
    if ($('input[name="gender"]:checked').val() === undefined) {
        warning += '性別 ';
    }
    if (!(/^\d{4}-(1[0-2]|0[1-9])-(0[1-9]|[12]\d|3[01])$/.test($('input[name="birth"]').val()))) {
        warning += '生日 ';
    }
    if ($('input[name="insurance"]:checked').val() === undefined) {
        warning += '保險 ';
    }
    if ($('input[name="marriage"]:checked').val() === undefined) {
        warning += '婚姻状况 ';
    }
    if ($('select#education').val() === '0') {
        warning += '学历 ';
    }
    if ($('input[name="child"]:checked').val() === undefined) {
        warning += '子女 ';
    }
    if ($('select#home-state').val() === '0') {
        warning += '住宅省份 ';
    }
    if ($('input[name="asset"]:checked').val() === undefined) {
        warning += '财力证明 ';
    }
    if ($('input[name="income"]').val() !== undefined && !(/^\d+$/.test($('input[name="income"]').val()))) {
        if ($.cookie('work_status') === '0') {
            warning += '月收入 ';
        } else {
            warning += '月营业额 ';
        }
    }
    if (!(/^\S+$/.test($('input[name="work_name"]').val()))) {
        if ($.cookie('work_status') === '0') {
            warning += '单位名称 ';
        } else if ($.cookie('work_status') === '1') {
            warning += '店铺链接 ';
        } else {
            warning += '学校名称 ';
        }
    }
    if ($('select#work-years').val() !== undefined && ($('select#work-years').val() === '0' || $('select#work-years').val() === null)) {
        warning += '工作年限 ';
    }
    if ($('select#work-state').val() !== undefined && $('select#work-state').val() === '0') {
        if ($.cookie('work_status') === '0') {
            warning += '单位省份 ';
        } else {
            warning += '经营省份 ';
        }
    }
    if ($('input[name="work_phone"]').val() !== undefined && !(/^\d+$/.test($('input[name="work_phone"]').val()))) {
        if ($.cookie('work_status') === '0') {
            warning += '单位电话 ';
        } else {
            warning += '宿舍电话 ';
        }
    }
    if (($('input[name="work_department"]').val() !== undefined && !(/^\S[\s\S]*$/.test($('input[name="work_department"]').val()))) ||
            ($('select[name="work_department"]').val() !== undefined && $('select[name="work_department"]').val() === '0')) {
        if ($.cookie('work_status') === '0') {
            warning += '任职部门 ';
        } else {
            warning += '经营网店 ';
        }
    }
    if ($('input[name="work_title"]').val() !== undefined && !(/^\S[\s\S]*$/.test($('input[name="work_title"]').val()))) {
        if ($.cookie('work_status') === '0') {
            warning += '任职职位 ';
        } else {
            warning += '卖家昵称 ';
        }
    }
    if (warning !== '') {
        alert('请检查' + warning);
        return;
    } else if ($('input#authen').val() === '') {
        alert('请获取验证码');
        return;
    }
    $.ajax('php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {};
            request.name = 'SUBMIT_PROFILE';
            $('input, select').attr('disabled', false);
            request.content = $('form#profile').serializeObject();
            request.content.work_status = $.cookie('work_status');
            if (request.content.income === undefined) {
                request.content.income = INCOME[2];
            }
            $.cookie('income', request.content.income, 30, '/');
            $.cookie('first_name', request.content.first_name, 30, '/');
            member = request.content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            load_product_info_page();
        }
    });
}

function submit_authen() {
    'use strict';
    if (!(/^\S[\s\S]*$/.test($('input[name="first_name"]').val())) || !(/^\S[\s\S]*$/.test($('input[name="last_name"]').val()))) {
        alert('请检查姓名');
        return;
    } else if (!(/^\d+$/.test($('input[name="uid"]').val()))) {
        alert('请检查身份证');
        return;
    } else if ($('input[name="uid"]').val().length !== 18) {
        alert('身份证須等于18字');
        return;
    } else if (!(/^\d+$/.test($('input[name="cellphone"]').val()))) {
        alert('请检查手机号');
        return;
    } else if ($('input[name="cellphone"]').val().length !== 11) {
        alert('请检查手机号须等于11字');
        return;
    } else if ($('input#authen').val() === '') {
        alert('请获取验证码');
        return;
    } else if ($('input[name="gender"]:checked').val() === undefined) {
        alert('请检查性別');
        return;
    } else if (!(/^\d{4}-(1[0-2]|0[1-9])-(0[1-9]|[12]\d|3[01])$/.test($('input[name="birth"]').val()))) {
        alert('请检查生日');
        return;
    }
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {};
            request.name = 'SET_MEMBER';
            request.content = $('form#authen').serializeObject();
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            member = obj.content;
            $.cookie('first_name', obj.content.first_name, 30, '/');
            $('#authen-modal').modal('hide');
            $('#charge-modal').modal('show');
        }
    });
}

function submit_charge() {
    'use strict';
    if (!(/^\S[\s\S]*$/.test($('form#charge input#name').val()))) {
        alert('请检查持卡人姓名');
        return;
    } else if (!(/^\d+$/.test($('form#charge input#card-number').val()))) {
        alert('请检查银行卡号');
        return;
    } else if (!(/^\d+$/.test($('form#charge input#cellphone').val()))) {
        alert('请检查手机号');
        return;
    } else if ($('form#charge input#cellphone').val().length !== 11) {
        alert('请检查手机号须等于11字');
        return;
    } else if (!(/^\d+$/.test($('form#charge input[name="remain"]').val()))) {
        alert('请检查充值金額');
        return;
    } else if (Number($('form#charge input[name="remain"]').val()) > 50000) {
        alert('充值金額应小于50000');
        return;
    } else if ($('form#charge input#authen').val() === '') {
        alert('请获取验证码');
        return;
    }
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {};
            request.name = 'CHARGE';
            request.content = $('form#charge').serializeObject();
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            member = obj.content;
            $('div#content > div:nth-child(2) h3:eq(2) > span').html(member.remain + '.00');
            $('#charge-modal').modal('hide');
        }
    });
}

function submit_cash() {
    'use strict';
    if (!(/^\d+$/.test($('form#cash input#account-number').val()))) {
        alert('请检查銀行帐户');
        return;
    } else if ($('form#cash input#account-number').val() !== $('form#cash input#confirm-account-number').val()) {
        alert('銀行帐户不一致');
        return;
    } else if (!(/^\d+$/.test($('form#cash input#cellphone').val()))) {
        alert('请检查手机号');
        return;
    } else if ($('form#cash input#cellphone').val().length !== 11) {
        alert('请检查手机号须等于11字');
        return;
    } else if (!(/^\d+$/.test($('form#cash input[name="remain"]').val()))) {
        alert('请检查提现金額');
        return;
    } else if (Number($('form#cash input[name="remain"]').val()) > Number(member.remain)) {
        alert('提现金额大于馀额');
        return;
    } else if (Number($('form#cash input[name="remain"]').val()) > 50000) {
        alert('提现金額应小于50000');
        return;
    } else if ($('form#cash input#authen').val() === '') {
        alert('请获取验证码');
        return;
    }
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {};
            request.name = 'CASH';
            request.content = $('form#cash').serializeObject();
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            member = obj.content;
            $('div#content > div:nth-child(2) h3:eq(2) > span').html(member.remain + '.00');
            $('#cash-modal').modal('hide');
        }
    });
}

function submit_like(a, num) {
    'use strict';
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {}, content = {};
            content.user_serial = $(a).parents('div.row.forum-row').attr('member');
            content.like = num;
            request.name = 'SUBMIT_LIKE';
            request.content = content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            $(a).fadeOut();
        }
    });
}

function submit_file_upload() {
    'use strict';
    load_product_confirm_page();
}

function submit_product_detail() {
    'use strict';
    if (window.confirm('您确定将送交审核') === false) {
        return;
    }
    $.ajax('php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {};
            request.name = 'SUBMIT_PRODUCT_DETAIL';
            request.content = product;
            request.content.postfix = JSON.stringify(member);
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            $('div#content > div:nth-child(1) > a:nth-child(5)').removeClass('active');
            $('div#content > div:nth-child(1) > a:nth-child(6)').addClass('active');
            $('div#content > div:nth-child(2)').html('<table class="table table-hover"><tr><th>借款名称</th><th>还款期数</th><th>借款金额</th><th>审核状态</th></tr><tr id="test"><td></td><td></td><td></td><td></td></tr></table><div class="alert alert-success" role="alert">已送交审核，谢谢您！</div>');
            $('tr#test > td:eq(0)').html(product.name);
            $('tr#test > td:eq(1)').html(product.term + '期');
            $('tr#test > td:eq(2)').html(product.amount + '元');
            $('tr#test > td:eq(3)').html('审核中');
            product = null;
            $.removeCookie('product_buffer');
        }
    });
}

function submit_post() {
    'use strict';
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {};
            request.name = 'SUBMIT_POST';
            request.content = $('form#post').serializeObject();
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            alert('发帖成功');
        }
    });
}

function submit_reply(btn) {
    'use strict';
    $.ajax('php/request.php', {
        dataType: 'json',
        async: false,
        data: (function () {
            var request = {};
            request.name = 'SUBMIT_REPLY';
            request.content = $('form#reply').serializeObject();
            request.content.post_serial = $(btn).attr('post_serial');
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            alert('回复成功');
            display_post($('a[value="' + $(btn).attr('post_serial') + '"'));
        }
    });
}

function submit_invest() {
    'use strict';
    var tmp_product = get_product_by_serial(Number($('#invest-modal h3:eq(0) > strong').html()));
    $.ajax('php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {}, content = {};
            content.amount = $('#invest-modal h2 > strong').html();
            content.product_serial = tmp_product.product_serial;
            content.borrower = tmp_product.borrower;
            content.rate = tmp_product.rate;
            request.name = 'INVEST';
            request.content = content;
            return 'request=' + JSON.stringify(request);
        }()),
        type: 'POST',
        success: function (obj) {
            $('#invest-modal').modal('hide');
            product_list = obj.content;
            filter();
        }
    });
}

function save_product() {
    'use strict';
    var i, income;
    if (!(/^\S[\s\S]*$/.test($('input[name="name"]').val()))) {
        alert('请检查借款名称');
        return;
    } else if (!(/^\d+$/.test($('input[name="term"]').val()))) {
        alert('请检查还款期数');
        return;
    } else if ($('select#usage').val() === '0') {
        alert('请检查借款用途');
        return;
    } else if (!(/^\d+$/.test($('input[name="amount"]').val()))) {
        alert('请检查借款金额');
        return;
    } else if (Number($('input[name="amount"]').val()) < 1000) {
        alert('借款金额须大于1000');
        return;
    } else if (!(/^\S[\s\S]*$/.test($('input[name="source"]').val()))) {
        alert('请检查还款来源');
        return;
    } else if (!(/^\S[\s\S]*$/.test($('textarea[name="descript"]').val()))) {
        alert('请检查借款简介');
        return;
    }
    product = $('form#product').serializeObject();
    income = Number($.cookie('income'));
    for (i = 0; i < INCOME.length; i += 1) {
        if (income >= INCOME[i]) {
            break;
        }
    }
    product.level = i;
    product.rate = RATE[i];
    $.cookie('product_buffer', JSON.stringify(product), 30, '/');
    load_upload_page();
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
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    if (!(reg.test($('input#sign-up-email').val()))) {
        alert('请检查邮箱');
        return;
    } else if ($('input#sign-up-password').val() === '') {
        alert('请输入密码');
        return;
    } else if ($('input#sign-up-email').val() !== $('input#sign-up-confirm-email').val()) {
        alert('请检查确认邮箱');
        return;
    }
    $.ajax('php/request.php', {
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
                alert('此帐户已被使用');
                return;
            }
            $.cookie('user_serial', obj.content.user_serial, 30, '/');
            location.reload();
        }
    });
}

function sign_in(btn) {
    'use strict';
    $.ajax('php/request.php', {
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
                alert('邮箱 或 密码错误, 请重新输入');
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
    if ($.cookie('first_name') === undefined) {
        return;
    }
    if (obj.innerHTML === '完成') {
        $('input, select').attr('disabled', true);
        obj.innerHTML = '编辑';
    } else {
        $('input, select').attr('disabled', false);
        $('input[name="first_name"], input[name="last_name"], input[name="uid"], input[name="birth"], input[name="cellphone"], input[name="gender"]').attr('disabled', true);
        obj.innerHTML = '完成';
    }
}

function change_amount(span) {
    'use strict';
    var num, maximum, tmp_product = get_product_by_serial(Number($(span).parents('tr').attr('value')));
    maximum = Number(tmp_product.amount) - Number(tmp_product.complete);
    if ($(span).attr('value') === '+') {
        num = Number($(span).prev().val()) + 100;
        if (num > maximum) {
            num = maximum;
        }
        $(span).prev().val(num);
    } else {
        num = Number($(span).next().next().val()) - 100;
        if (num < 0) {
            num = 0;
        }
        $(span).next().next().val(num);
    }
}

function change_term(span) {
    'use strict';
    var num;
    if ($(span).attr('value') === '+') {
        $(span).prev().prev().val(Number($(span).prev().prev().val()) + 1);
    } else {
        num = Number($(span).next().val()) - 1;
        if (num < 1) {
            return;
        }
        $(span).next().val(num);
    }
}

function invest_this(div) {
    'use strict';
    var tmp = Number($(div).prev().children('input').val()), serial = Number($(div).parents('tr').attr('value')),
        tmp_product = get_product_by_serial(serial),
        maximum = Number(tmp_product.amount) - Number(tmp_product.complete);
    get_member_from_server();
    if (Number(member.authority) === 0) {
        alert('借款身份无法投资');
        return;
    }
    if (isNaN(tmp)) {
        alert('请检查投资金额');
    } else if (tmp === 0) {
        alert('投标金额须大于0');
    } else if (tmp > maximum) {
        alert('投标金额不可大于所需金额：' + maximum);
    } else if (Number(member.remain) < tmp) {
        charge();
    } else {
        $('#invest-modal h2 > strong').html(tmp);
        $('#invest-modal h3:eq(0) > strong').html(serial);
        $('#invest-modal').modal('show');
    }
}

function link_to_add_friend() {
    'use strict';
    load_account_page();
    $('a.list-group-item:eq(3)').click();
}

$(document).ready(function () {
    'use strict';
    if ($.cookie('user_serial') !== undefined) {
        load_home_page();
        $('nav.navbar-fixed-top div.navbar-header > a.navbar-brand').on('click', function () {
            load_home_page();
        });
    }
});
