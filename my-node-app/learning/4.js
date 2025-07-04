// 创建一个"半锁定"的配置对象
// "use strict"
const config = {};

Object.defineProperty(config, 'version', {
  value: '1.0.0',
  writable: false,      // 防止意外修改
  configurable: true,   // 但允许程序化升级
  enumerable: true
});

// 用户无法意外修改
config.version = '2.0.0';  // 失败
console.log(config.version); // '1.0.0'

// 但系统可以程序化升级
function upgradeVersion(newVersion) {
  Object.defineProperty(config, 'version', {
    value: newVersion,
    // writable: false,  // 继续保持锁定
    // configurable: true
  });
}

upgradeVersion('2.0.0');
console.log(config.version); // '2.0.0'
let a = Object.getOwnPropertyDescriptors( config)
console.log(JSON.stringify(a))