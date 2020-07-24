var DOMAIN = (function () {
  const ENV = {
    dev: 'http://ttob.hundun.cn:9999',
    test: 'https://uni.hnaunicare.com:18443',
    prod: 'https://ghxcx.bjhxzlyy.com'
  };

  const envname = 'dev';
  console.log('当前环境', envname, '  当前域名::: ', ENV[envname]);
  return ENV[envname];
})();
export default DOMAIN;