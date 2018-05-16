/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */

let baseUrl = '';
let routerMode = 'history';
let imgBaseUrl = '';
if (process.env.NODE_ENV == 'development') {
  baseUrl = 'http://192.168.3.50:8080/old-backstage'; //本地环境
  // baseUrl = 'http://192.168.3.40:8881/old-backstage'; //测试环境
  // baseUrl = 'http://wyb.yindantech.com:8991/old-backstage'; //线上生产环境
} else if (process.env.NODE_ENV == 'production') {
  routerMode = 'hash';
  // baseUrl = 'http://192.168.3.40:8881/old-backstage'; //测试环境
  baseUrl = 'http://wyb.yindantech.com:8991/old-backstage'; //线上生产环境
}
export {
  baseUrl,
  routerMode,
  imgBaseUrl
}
