/*global $, jQuery, alert, Chart*/
/*jslint forin: true, bitwise: true*/
var STATES = ['', '北京', '上海', '天津', '重庆', '河北', '山西', '内蒙古自治区', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西壮族自治区', '海南', '四川', '贵州', '云南', '西藏自治区', '陕西', '甘肃', '青海', '宁夏回族自治区', '新疆维吾尔自治区', '其他'];
var STORES = ['', '淘宝网', '拍拍网', '阿里巴巴', '京东', '一号店', '当当网', '敦煌', '其他'];
var FILE_ATTR = ['身份证', '结婚证', '营业执照', '劳动合同', '工牌、名片、工作证', '社保', '工资卡/常用银行流水', '学生证/一卡通', '房产证', '行驶证', '支付宝截图', '个人信用报告', '信用卡对账单', '学历学位证书', '其他所有贷款协议/凭证'];
var FILE_DESC = ['二代身份证正反面各一张，本人手持身份证合照一张，共3张。', '本人结婚证，包含结婚日期、本人及配偶所有信息。', '营业执照照片或工商网站截图，必须清晰显示法人、成立时间、经营范围、经营时间等关键信息。', '本人当前的有效劳动合同，从封面一页一页拍至最后一页。', '个人工作证或单位工牌、名片均可，必须完整显示单位信息及个人信息。', '社保/公积金网站截图，需完整显示本人姓名、身份证、缴费状态、缴费金额等关键信息。', '本人银行卡正反面照片各一张，以及近3个月完整流水打印单或网银流水截屏。工资卡需显示代发工资项。', '个人学生证信息页照片，需完整显示学校信息及个人信息', '房产证的基本信息页及盖章页各一张，共2张。', '正副本照片，需完整显示车辆登记信息及年检信息。', '支付宝账户基本信息页截图和上一年度个人年度对账单截图。', '仅接受人民银行征信中心网络查询的PDF版。', '用户本人信用卡正面照片及对应的近3 个月信用卡（电子或纸质）对账单。', '本人大专及以上学历或学位证书，接受结业证。', '本人其他金融机构的贷款协议或凭证证明。'];
var FILE_IMG = [['uid_1.jpg', 'uid_2.jpg', 'uid_3.jpg'], 'jiehunzheng.jpg', 'yingyezhizhao.jpg', 'laodonghetong.jpg', 'gongpai.jpg', 'shebao.png', 'yinhangliushui.jpg', 'xueshengzheng.jpg', 'fangchanzheng.jpg', 'xingshizheng.jpg', 'zhifubao.jpg', 'xinyongbaogao.png', 'xinyongkazhangdan.bmp', 'xuelizhengshu.bmp', 'qitapingzheng.jpg'];
var EDUCATION = ['', '初中及以下', '中专', '高中', '大专', '本科', '研究生及以上'];
var WORK_YEAR = ['', '1 年已內', '2 年已內', '3 年已內', '4 年(含)以上'];
var UPLOAD_URL = '../upload/index.php';
var RATE = [1.99, 3.99, 5.99, 8.99, 11.99, 14.99, 19.99];
var INCOME = [500000, 250000, 125000, 62500, 31250, 15625];
var LEVEL = ['AA', 'A', 'B', 'C', 'D', 'E', 'HR'];
var USAGE = ['', '还款', '学费', '租金'];
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
var BORROW_PROGRESS = ['产品选择', '个人信息', '产品信息', '资料上传', '资料确认', '审核状况'];
var NAVBAR_STR = function () {
    'use strict';
    /*
<li><a href="javascript:void(0)" onclick="load_invest_page()">我要投资</a></li>
<li><a href="javascript:void(0)" onclick="load_borrow_page()">我要借款</a></li>
<li><a href="javascript:void(0)" onclick="load_account_page()">我的帐户</a></li>
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
        <label for="name" class="col-md-2 control-label">*借款名称</label>
        <div class="col-md-6">
          <input type="text" class="form-control" name="name" placeholder="">
        </div>
    </div>
    <div class="form-group">
        <label for="term" class="col-md-2 control-label">*还款期限</label>
        <div class="col-md-6">
            <div class="input-group">
                <span class="input-group-addon pointer" onclick="change_term(this)" value="-"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></span>
                <input class="form-control" type="text" name="term" value="3">
                <span class="input-group-addon">月</span>
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
          <input type="text" class="form-control" name="source" placeholder="">
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
                      <div class="col-md-2 text-right">期限</div>
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
                <table class="table table-hover">
                    <tr>
                        <th>借款名称</th>
                        <td id="name"></td>
                    </tr>
                    <tr>
                        <th>借款等级</th>
                        <td id="level"></td>
                    </tr>
                    <tr>
                        <th>借款利率</th>
                        <td id="rate"></td>
                    </tr>
                    <tr>
                        <th>借款期限</th>
                        <td id="term"></td>
                    </tr>
                    <tr>
                        <th>借款用途</th>
                        <td id="usage"></td>
                    </tr>
                    <tr>
                        <th>还款来源</th>
                        <td id="source"></td>
                    </tr>
                    <tr>
                        <th>借款金额</th>
                        <td id="amount"></td>
                    </tr>
                    <tr>
                        <th>借款简介</th>
                        <td id="descript"></td>
                    </tr>
                    <tr>
                        <th>刊登时间</th>
                        <td id="time"></td>
                    </tr>
                    <tr>
                        <th>完成度</th>
                        <td id="complete"></td>
                    </tr>
                    <tr>
                        <th>浏览次数</th>
                        <td id="view"></td>
                    </tr>
                    <tr>
                        <th>借贷者</th>
                        <td id="borrower"></td>
                    </tr>
                    <tr>
                        <th>附注</th>
                        <td id="ps"></td>
                    </tr>
                </table>
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
    <tr><th>上传资料</th><td></td><td></td></tr>
    <tr>
       <th></th>
       <td>
           <ul id="image">
           </ul>
        </td>
        <td><button class="btn btn-info" onclick="load_upload_page()">編輯</button></td>
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
    <tr><th></th><td colspan="2" class="text-right"><button class="btn btn-warning" onclick="submit_product_detail()" disabled>我已閱讀且同意</button></td></tr>
</table>
    */
}.toString().slice(38, -4);
var INVEST_PAGE_STR = function () {
    'use strict';
    /*
<ul class="nav nav-tabs">
  <li role="presentation" class="active"><a href="javascript:void(0)">所有商品</a></li>
  <form class="form-inline navbar-right">
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
        <th class="col-md-1 pointer" name="term" onclick="product_sort(this)">期限</th>
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
                        <label for="authen" class="col-md-offset-1 col-md-2 control-label">*验证码</label>
                        <div class="col-md-4">
                            <input type="text" class="form-control">
                        </div>
                        <div class="col-md-4">
                            <input type="button" class="btn" value="获取验证码">
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
                        <label for="card_number" class="col-md-offset-1 col-md-2 control-label">*銀行卡號</label>
                        <div class="col-md-8">
                            <input type="text" class="form-control" id="card-number" placeholder="請輸入銀行卡號">
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
                                <input class="form-control" type="text" placeholder="限額5萬元/次" name="remain">
                                <span class="input-group-addon">元</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="authen" class="col-md-offset-1 col-md-2 control-label">*手機验证</label>
                        <div class="col-md-4">
                            <input type="text" class="form-control">
                        </div>
                        <div class="col-md-4">
                            <input type="button" class="btn" value="获取验证码">
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
var ACCOUNT_PAGE_STR = function () {
    'use strict';
    /*
<div class="row">
    <div class="col-md-4" style="overflow:hidden">
        <img src="img/greg_head.png" height="200px" width="200px">
    </div>
</div>
<hr>
<div class="row">
    <div class="col-md-6">
        <div class="panel panel-default">
            <div class="panel-heading">账户余额</div>
            <div class="panel-body">
                <p>可用余额:&yen;<u><strong></strong></u></p>
                <div class="text-right">
                    <button class="btn btn-info" onclick="charge()">充值</button>
                    <button class="btn btn-primary">提现</button>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-6" style="overflos:scroll">
        <div class="panel panel-default">
            <div class="panel-heading">用户分析</div>
            <div class="panel-body">
                <canvas id="radar-chart"></canvas>
            </div>
        </div>
    </div>
</div>
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
            $("#term-lower").html(ui.values[0] + "月");
            $("#term-upper").html(ui.values[1] + "月");
        }
    });
    $("#term-lower").html($("#term-slider").slider("values", 0) + "月");
    $("#term-upper").html($("#term-slider").slider("values", 1) + "月");
    
    $("#amount-slider").slider({
        range: true,
        min: 0,
        max: 999999,
        values: [0, 999999],
        slide: function (event, ui) {
            $("#amount-lower").html(ui.values[0] + "天");
            $("#amount-upper").html(ui.values[1] + "天");
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
    row += '<td class="text-center">' + para6 + '个月</td>';
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
    $('body').removeClass('index-cover');
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
    var i, tmp, name;
    tmp = Number($(a).parents('tr').attr('value'));
    for (i = 0; i < product_list.length; i += 1) {
        if (tmp === Number(product_list[i].product_serial)) {
            break;
        }
    }
    $('#product-modal u').html(tmp);
    for (name in product_list[i]) {
        if (name === 'level') {
            $('#product-modal td#' + name).html(LEVEL[Number(product_list[i][name])]);
        } else if (name === 'term') {
            $('#product-modal td#' + name).html(product_list[i][name] + '个月');
        } else if (name === 'usage') {
            $('#product-modal td#' + name).html(USAGE[Number(product_list[i][name])]);
        } else if (name === 'complete') {
            $('#product-modal td#' + name).html(Math.floor(Number(product_list[i][name]) * 100 / Number(product_list[i].amount)) + '%');
        } else {
            $('#product-modal td#' + name).html(product_list[i][name]);
        }
    }
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
    $('div#modal').append(RATE_MODAL_STR + FILTER_MODAL_STR + PRODUCT_MODAL_STR);
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

function load_account_page() {
    'use strict';
    clear_all();
    $('div#navbar-collapse > ul:first > li:nth-child(3)').addClass('active');
    $('div#content > div:nth-child(2)').append(ACCOUNT_PAGE_STR);
    $('div#content > div:nth-child(2) p > u > strong').html(member.remain);
    $('div#modal').append(CHARGE_MODAL_STR + AUTHEN_MODAL_STR);
    new Chart(document.getElementById("radar-chart").getContext("2d")).Radar({
        labels: ["信用额度", "借款次数", "违约次数", "借款总金额", "投资总金额"],
        datasets: [
            {
                fillColor: "rgba(220,220,220,0.2)",
                data: [65, 59, 90, 81, 56]
            }
        ]
    }, {
        responsive: true
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
    if (product !== null) {
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
    var name, tmp, obj, i;
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
                $('ul#product').append('<li>借款名稱:' + product[name] + '</li>');
            } else if (name === 'term') {
                $('ul#product').append('<li>還款期限:' + product[name] + '个月</li>');
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
    if (!(/^\S+$/.test($('input[name="first_name"]').val())) || !(/^\S+$/.test($('input[name="last_name"]').val()))) {
        alert('请检查姓名');
        return;
    } else if (!(/^\d+$/.test($('input[name="uid"]').val()))) {
        alert('请检查身份证');
        return;
    } else if (!(/^\d+$/.test($('input[name="cellphone"]').val()))) {
        alert('请检查手机号');
        return;
    } else if ($('input[name="gender"]:checked').val() === undefined) {
        alert('请检查性別');
        return;
    } else if (!(/^\d{4}-(1[0-2]|0[1-9])-(0[1-9]|[12]\d|3[01])$/.test($('input[name="birth"]').val()))) {
        alert('请检查生日');
        return;
    } else if ($('input[name="insurance"]:checked').val() === undefined) {
        alert('请检查保險');
        return;
    } else if ($('input[name="marriage"]:checked').val() === undefined) {
        alert('请检查婚姻状况');
        return;
    } else if ($('select#education').val() === '0') {
        alert('请检查学历');
        return;
    } else if ($('input[name="child"]:checked').val() === undefined) {
        alert('请检查子女');
        return;
    } else if ($('select#home-state').val() === '0') {
        alert('请检查住宅省份');
        return;
    } else if ($('input[name="asset"]:checked').val() === undefined) {
        alert('请检查财力证明');
        return;
    } else if ($('input[name="income"]').val() !== undefined && !(/^\d+$/.test($('input[name="income"]').val()))) {
        if ($.cookie('work_status') === '0') {
            alert('请检查月收入');
        } else {
            alert('请检查月营业额');
        }
        return;
    } else if (!(/^\S+$/.test($('input[name="work_name"]').val()))) {
        if ($.cookie('work_status') === '0') {
            alert('请检查单位名称');
        } else if ($.cookie('work_status') === '1') {
            alert('请检查店铺链接');
        } else {
            alert('请检查学校名称');
        }
        return;
    } else if ($('select#work-years').val() !== undefined && $('select#work-years').val() === '0') {
        alert('请检查工作年限');
        return;
    } else if ($('select#work-state').val() !== undefined && $('select#work-state').val() === '0') {
        if ($.cookie('work_status') === '0') {
            alert('请检查单位省份');
        } else {
            alert('请检查经营省份');
        }
        return;
    } else if ($('input[name="work_phone"]').val() !== undefined && !(/^\d+$/.test($('input[name="work_phone"]').val()))) {
        if ($.cookie('work_status') === '0') {
            alert('请检查单位电话');
        } else {
            alert('请检查宿舍电话');
        }
        return;
    } else if (($('input[name="work_department"]').val() !== undefined && !(/^\S+$/.test($('input[name="work_department"]').val()))) ||
            ($('select[name="work_department"]').val() !== undefined && $('select[name="work_department"]').val() === '0')) {
        if ($.cookie('work_status') === '0') {
            alert('请检查任职部门');
        } else {
            alert('请检查经营网店');
        }
        return;
    } else if ($('input[name="work_title"]').val() !== undefined && !(/^\S+$/.test($('input[name="work_title"]').val()))) {
        if ($.cookie('work_status') === '0') {
            alert('请检查任职职位');
        } else {
            alert('请检查卖家昵称');
        }
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
    if (!(/^\S+$/.test($('input[name="first_name"]').val())) || !(/^\S+$/.test($('input[name="last_name"]').val()))) {
        alert('请检查姓名');
        return;
    } else if (!(/^\d+$/.test($('input[name="uid"]').val()))) {
        alert('请检查身份证');
        return;
    } else if (!(/^\d+$/.test($('input[name="cellphone"]').val()))) {
        alert('请检查手机号');
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
            $('#authen-modal').modal('hide');
            $('#charge-modal').modal('show');
        }
    });
}

function submit_charge() {
    'use strict';
    if (!(/^\S+$/.test($('input#name').val()))) {
        alert('请检查持卡人姓名');
        return;
    } else if (!(/^\d+$/.test($('input#card-number').val()))) {
        alert('请检查銀行卡號');
        return;
    } else if (!(/^\d+$/.test($('input#cellphone').val()))) {
        alert('请检查手机号');
        return;
    } else if (!(/^\d+$/.test($('input[name="remain"]').val()))) {
        alert('请检查充值金額');
        return;
    } else if (Number($('input[name="remain"]').val()) > 50000) {
        alert('充值金額应小于50000');
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
            $('div#content > div:nth-child(2) p > u > strong').html(member.remain);
            $('#charge-modal').modal('hide');
        }
    });
}

function submit_file_upload() {
    'use strict';
    load_product_confirm_page();
}

function submit_product_detail() {
    'use strict';
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
            $('div#content > div:nth-child(2)').html('<table class="table table-hover"><tr><th>借款名称</th><th>还款期限</th><th>借款金额</th><th>审核状态</th></tr><tr id="test"><td></td><td></td><td></td><td></td></tr></table><div class="alert alert-success" role="alert">已送交审核，谢谢您！</div>');
            $('tr#test > td:eq(0)').html(product.name);
            $('tr#test > td:eq(1)').html(product.term + '个月');
            $('tr#test > td:eq(2)').html(product.amount + '元');
            $('tr#test > td:eq(3)').html('審核中');
            product = null;
        }
    });
}

function submit_invest() {
    'use strict';
    $.ajax('php/request.php', {
        dataType: 'json',
        data: (function () {
            var request = {}, content = {};
            content.amount = $('#invest-modal h2 > strong').html();
            content.product_serial = $('#invest-modal h3:eq(0) > strong').html();
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
        alert('请检查还款期限');
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
    if (isNaN(tmp)) {
        alert('请检查投资金额');
    } else if (tmp === 0) {
        alert('投标金额须大于0');
    } else if (tmp > maximum) {
        alert('投标金额不可大于所需金额：' + maximum);
    } else if (Number(member.remain) < tmp) {
        charge();
    } else {
        get_member_from_server();
        $('#invest-modal h2 > strong').html(tmp);
        $('#invest-modal h3:eq(0) > strong').html(serial);
        $('#invest-modal').modal('show');
    }
}

$(document).ready(function () {
    'use strict';
    if ($.cookie('user_serial') !== undefined) {
        load_home_page();
    }
});