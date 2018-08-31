export default{
  // 全屏
  launchFullScreen: (element,that) =>{
    var element = element || document.documentElement
    that.fullScreen = !that.fullScreen
    console.log(that.fullScreen)
    console.log(element)
    if(that.fullScreen){
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }else{
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozExitFullScreen) {
            document.mozExitFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
  },

  //url获取页面参数
  getParam: (id) => {
    var url = window.location.href;
    if (url.lastIndexOf('?') == -1) return "";
    var params = url.split('?')[1];
    if (params.length == 0) return "";
    var p = {};
    var r = params.split('&');
    for (var i = 0; i < r.length; i++) {
        if (r[i].indexOf('=') == -1) continue;
        var a = r[i].split('=');
        p[a[0]] = a[1];
    }
    return typeof p[id] == 'undefined' ? '' : decodeURI(p[id]);
  },

  //时间戳转换
  formatDate: (date) =>{
    var date = new Date(date);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d;
  }
}