// 数据
var datas = [
  { pName: '牛奶', src: './uploads/01.jpg', price: 10, count: 1 },
  { pName: '三只松鼠', src: './uploads/02.jpg', price: 30, count: 4 },
  { pName: '蓝牙播放器', src: './uploads/03.jpg', price: 100, count: 1 },
  { pName: '大米', src: './uploads/04.jpg', price: 50, count: 10 },
  { pName: '路由器', src: './uploads/05.jpg', price: 110, count: 1 },
  { pName: '罐头', src: './uploads/06.jpg', price: 20, count: 5 }
];
// 功能 1：动态创建/追加tbody
// 获取datas中的数据，循环遍历
for (var i = 0; i < datas.length; i++) {
  var obj = datas[i];
  // 创建tr追加给tbody
  var newTr = $('<tr></tr>');
  newTr.appendTo('tbody');
  // 用模板字串符方式，把内容给tr
  var htmlStr = `
            <td>
              <input type="checkbox" >
            </td>
            <td>
              <img src="${obj.src}">
              <p>${obj.pName}</p>
            </td>
            <td>
            ${obj.price}￥
            </td>
            <td>
              <div class="count-c clearfix">
                <a href="javascript:" class="reduce ${obj.count == 1? 'disabled' : ''}">-</a>
                <input type="text" value="${obj.count}">
                <a href="javascript:" class="add">+</a>
              </div>
            </td>
            <td>
            ${obj.price * obj.count}￥
            </td>
            <td>
              <a href="javascript:" class="del">删除</a>
            </td>
  `;
  $('tbody tr').eq(i).html(htmlStr);
}
// 功能 2：点击thead中复选框，获取thead中的状态，设置给tbody
$('thead input').click(function () {
  // 获取thead中复选框的checked状态
  var isCheck = $(this).prop('checked');
  // 给tbody中复选框设置isCheck
  $('tbody input[type=checkbox]').prop('checked',isCheck);
  // 实现选中商品数量总和/商品总价
  getSumAndPrice();
});
// 功能 3：点击tbody中的复选框，当thead中的数量等于全部数量时，tbody被选中
$('tbody input[type=checkbox]').click(function () {
  // 获取tbody中复选框的数量
  var len1 = $('tbody input[type=checkbox]').length;
  // 获取tbody中复选框被选中的数量
  var len2 = $('tbody input[type=checkbox]:checked').length;
  // 判断当len1 和 len2一样时，tbody复选框选中
  if (len1 == len2) {
    $('thead input').prop('checked', true);
  } else {
    $('thead input').prop('checked', false);
  }
  // 实现选中商品数量总和/商品总价
  getSumAndPrice();
});
// 功能 4: 封装实现选中商品数量总和/商品总价
function getSumAndPrice() {
  // 定义总数/总价
  var sum = 0;
  var price = 0;
  // 找到被选中的复选框,循环遍历每一组中的、商品数量/商品总价（商品数量 * 商品单价）
  var $cks = $('tbody input[type=checkbox]:checked');
  for(var i = 0; i < $cks.length; i++) {
    // 先找到对应的tr，再去下面找商品数量和商品单价
    var trs = $cks.eq(i).parent().parent();
    // 找到商品数量,并求和
    var sumX = trs.find('input[type=text]').val();
    sum = sum + parseInt(sumX);
    // 找到商品单价,并求和
    var priceX = trs.find('td').eq(4).text();
    price = price + parseFloat(priceX);
  }
  // 把sum给#totalCount
  $('#totalCount').text(sum);
  // 把price给#totalPrice
  $('#totalPrice').text(price);
}
// 功能 5：点击商品数量中的右键时
$('.add').click(function () {
  // 找到当前点击的商品数量
  var txt = $(this).prev();
  // 获取当前商品数量
  var num = txt.val();
  num++;
  txt.val(num);
  // 点击后，使当前这一行的复选框被选中
  var trs = $(this).parent().parent().parent();
  trs.find('input[type=checkbox]').prop('checked',true);
  // 更新小计 获取单价*num = 小计 设置给小计
  var priceX =  parseFloat(trs.find('td').eq(2).text());
  trs.find('td').eq(4).text(priceX * num + '￥');
  // 设置减按钮可以点击
  txt.prev().removeClass('disabled');
  // 实现选中商品数量总和/商品总价
  getSumAndPrice();
  // 检测全选按钮是否被选中
  isChecked();
});
// 封装：检测全选按钮是否被选中
function isChecked() {
   // 获取tbody中复选框的数量
   var len1 = $('tbody input[type=checkbox]').length;
   // 获取tbody中复选框被选中的数量
   var len2 = $('tbody input[type=checkbox]:checked').length;
   // 判断当len1 和 len2一样时，tbody复选框选中
   if (len1 == len2) {
     $('thead input').prop('checked', true);
   } else {
     $('thead input').prop('checked', false);
   }
}
// 功能 6：点击商品数量中的左键时
$('.reduce').click(function () {
  // 找到当前点击的商品数量
  var txt = $(this).next();
  // 获取当前商品数量
  var num = txt.val();
  num--;
  // 判断
  if (num <= 1) {
    num = 1;
    $(this).addClass('disabled');
  }
  txt.val(num);
  // 点击后，使当前这一行的复选框被选中
  var trs = $(this).parent().parent().parent();
  trs.find('input[type=checkbox]').prop('checked',true);
  // 更新小计 获取单价*num = 小计 设置给小计
  var priceX =  parseFloat(trs.find('td').eq(2).text());
  trs.find('td').eq(4).text(priceX * num + '￥');
  // 实现选中商品数量总和/商品总价
  getSumAndPrice();
  // 检测全选按钮是否被选中
  isChecked();
});
// 功能 7：点击操作中的删除时，删除整行
$('.del').click(function () {
  var isOk = confirm('确认删除吗？')
  if(isOk) {
    var tr = $(this).parent().parent().remove();
    getSumAndPrice()
  }
  emptyOk();
});
// 封装：检测全部删除后，td的长度为0，切换到info
function emptyOk() {
  var len = $('tbody tr').length;
  if (len == 0) {
    $('.car').hide();
    $('.info').show(500);
  }
};
// 功能 8：点击删除所选商品
$('.del-all').click(function () {
  var trs = $('tbody tr').find('input[type=checkbox]:checked');
  if (trs.length == 0) {
    alert('请选中要删除的商品');
  } else {
    var isOk = confirm('真的要删除吗？');
    if (isOk) {
      trs.parent().parent().remove();
      getSumAndPrice();
    }
  }
  emptyOk();
});
// 功能 9：清理购物车
$('.clear').click(function () {
  var isOk = confirm('真的要删除吗？');
    if (isOk) {
      $('tbody').empty();
      emptyOk();
    }
});

