/**
 * Created by ming on 15/12/8.
 */

//0-45 , 46-90 , 91-135 , 136-180 ,181-225 , 226-270 , 271-315, 316-360

var jiaodu = 0;   //角度
var liwu;     //奖品
var type;   //状态
var Rand;   //产生随机数

//从数据库拿出奖品的数据
$(document).ready(function () {

  //轮盘抽奖事件/
  $('#Turntable_btn').click(function () {

    //var UserName = Openid;

    //取出所有奖品数据
    $.get("/selectlottery", function (giftsDate) {

      var openid_nickname_headimgurl = {Openid: Openid, NickName: nickname, Headimgurl: headimgurl};
      $.get("/checkUseropenid", openid_nickname_headimgurl, function (msg) {
        if (msg == "000") {

          Rand = Math.ceil(Math.random() * 600);

          if (0 < Rand && Rand < 2) {
            type = 1;
          }
          else if (50 < Rand && Rand<  52) {
            type = 2;
          }
          else if (100 < Rand && Rand<  103) {
            type = 3;
          }
          else if (210 < Rand && Rand<  213) {
            type = 4;
          }
          else  if (300 < Rand && Rand<  303) {
            type = 5;
          }
          else if (400 < Rand && Rand<  403) {
            type = 6;
          }
          else if (450 < Rand && Rand<  452) {
            type = 7;
          }
          else {
            type = 8;
          }

          if (giftsDate[type - 1].gift_Number == 0) {
            type = 8;
          }else {
            type = type;
          }
          //判断
          switch (type) {
            case 1:
              jiaodu = 22;
              liwu = "小米智能手环";
              break;
            case 2:
              jiaodu = 68;
              liwu = "欧美品牌彩妆礼盒";
              break;
            case 3:
              jiaodu = 168;
              liwu = "围巾手套帽子礼盒";
              break;
            case 4:
              jiaodu = 203;
              liwu = "抗寂寞拉面碗";
              break;
            case 5:
              jiaodu = 248;
              liwu = "50元话费";
              break;
            case 6:
              jiaodu = 293;
              liwu = "韩国大牌面膜";
              break;
            case 7:
              jiaodu = 338;
              liwu = "韩国品牌手表";
              break;
            case 8:
              jiaodu = 112;
              liwu = "热情拥抱";
              break;
          }

          $('#Turntable').rotate({
            duration: 4000,               //转动时间
            angle: 0,                    //起始角度
            animateTo: 1800 + jiaodu,      //结束的角度
            callback: function () {
              //alert("恭喜你获得:"+liwu);    //简单的弹出获奖信息
              if (type < 8) {
                window.scrollTo(0, 0);
                $('#winner').modal('show');
                $('#p2').text(liwu);
                var user_bingo = {user_liwu: liwu, Openid: Openid};
                $.get("/user_bingo", user_bingo, function (zj) {
                });
                //修改奖品数量
                var gift_name = type - 1
                var gift_id = type;
                var gift = giftsDate[gift_name].gift_Number;
                var giftnums = gift - 1;
                var updagift = {giftnums: giftnums, giftid: gift_id}
                //修改奖品数量
                $.get("/UpdateGift_number", updagift, function (giftMsg) {

                });

              } else {
                //检查用户抽奖次数
                var openid = {Openid: Openid};
                $.get("/check_user_lottery_Number", openid, function (msg) {
                  if (msg == "01") {
                    $('#lose_one').modal('show');
                  } else if (msg == "02") {
                    $('#lose_two').modal('show');
                  } else {
                    alert("出现错误了!");
                  }
                });
              }
            }
          });
        } else if (msg == "006") {
          alert("亲,您需要分享朋友圈或者分享给好友才能继续抽奖喔!");
        } else {
          alert("亲,已获奖或者抽奖次数超过两次不能再抽咯!");
        }
      });
    });
  });


  //查看奖品按钮触发
  $('#prize').click(function () {
    var openid = {Openid: Openid};
    $.get("/check_User_lottery", openid, function (lottery_date) {
      //alert(lottery_date);
      if (lottery_date == "nolottery") {
        alert("抽中才能看到奖品!");
      } else {
        window.scrollTo(0, 0);
        $('#prize_pop').modal('show');
        $('.p2').text(lottery_date);
      }
    });
  });


  //传值到信息填写页面
  $('#userinfo_fill_out').click(function () {
    var openid = {Openid: Openid};
    location.href = '/lottery.html?openid=' + openid.Openid;
  });


  //拿出10条数据
  $.get('index_select_Users_top_ten',function (result) {

    if (result == "nolottery"){
      $('#show_users').append("<div class='col-xs-12'></div>");
    }
    else{
      for (var show_num = 0; show_num < 10; show_num++) {
        var usersinfo = result[show_num];
        $('#show_users').append("<div class='col-xs-12'><div style='margin-top: 15px;margin-bottom: 15px;padding: 0px'><div class='col-xs-2' style='padding: 0px'><img src='" + usersinfo.headimgurl + "' width='34pt' height='34pt' style='border: 2px solid white;border-radius: 20px;'/></div><div class='col-xs-10' style='padding: 0px'><div class='col-xs-6' style='padding-right: 5px'>" + usersinfo.UserInfo_NickName + "</div><div class='col-xs-6' style='padding: 0px;text-align: center'><p style='margin-top: 2px;font-size: 12px;color: #6F604F'>" + usersinfo.time + "</p></div><div class='col-xs-12' style='padding: 0px;text-align: right;color: #d22f57'>恭喜获得:" + usersinfo.Lottery + "</div><div class='col-xs-12'><p style='color:#6F604F;font-size: 14px'>人品大爆发。</p></div></div></div><div class='col-xs-12' style='background-color: #44423C;height: 1px'></div></div>");

      }
    }

  });

});


