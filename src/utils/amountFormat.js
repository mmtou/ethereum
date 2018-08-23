function formatAmount(value) {
  if(!value) return '0.00';
  let intPart = Number(value).toFixed(0); //获取整数部分
  let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
  let floatPart = ".00"; //预定义小数部分
  let value2Array = value.split(".");
  //=2表示数据有小数位
  if(value2Array.length == 2) {
    floatPart = value2Array[1].toString(); //拿到小数部分
    if(floatPart.length == 1) { //补0,实际上用不着
      return intPartFormat + "." + floatPart + '0';
    } else {
      return intPartFormat + "." + floatPart;
    }
  } else {
    return intPartFormat + floatPart;
  }
}

export {formatAmount};
