// function Person(name) {
//   this.name = name;
//
//   // this.sayHi = function() {
//   //   console.log("Hi, I'm " + this.name);
//   // };
// }
//
// Person.prototype.sayHi = function() {
//   console.log("Hi, I'm " + this.name);
// };
//
// const a = new Person("Alice");
// const b = new Person("Bob");
//
//
// console.log(a.sayHi === b.sayHi); // ❌ false：每个实例一份方法


class Person {
  constructor(name) {
    this.name = name;
  }

  sayHi() {
    console.log("Hi, I'm " + this.name);
  }
}

const a = new Person("Alice");
const b = new Person("Bob");

console.log(a.sayHi === b.sayHi); // ✅ true：共享方法（在 prototype 上）
