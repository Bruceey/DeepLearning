// myNumbers = {};
//
// // Make it Iterable
// myNumbers[Symbol.iterator] = function() {
//   let n = 0;
//   done = false;
//   return {
//     next() {
//       n += 10;
//       if (n == 100) {done = true}
//       return {value:n, done:done};
//     }
//   };
// }
//
// let iterator = myNumbers[Symbol.iterator]()
// const result = iterator.next()


// const foo = "bar";
// const baz = {
//      foo,
// }
// console.log(baz);

// const cars = ["BMW", "Volvo", "Saab", "Ford"];
// let i = 0;
// let text = "";
//
// for (;cars[i];) {
//   text += cars[i];
//   i++;
// }
// console.log(text)
//
// const myFunction = new Function("a", "b", "return a * b");
//
// let x = myFunction(4, 3);

// console.log(x); // undefined（而不是报错）
// var x = 5;
// console.log(myFunction(5));

// function myFunction(y) {
//   console.log(arguments);
//   console.log(typeof arguments);
//   console.log(Array.isArray(arguments));
//   console.log(`参数是：${arguments[1]}`);
//   return y * y;
// }


// console.log(myFunction.toString())

// function sum(args) {
//   let sum = 0;
//   for (let arg of args) sum += arg;
//   return sum;
// }
//
// let x = sum(4, 9, 16, 25, 29, 100, 66, 77);
// let ff = 3;
// function findMax(a, b, ...c) {
//   let max = -Infinity;
//   ff = a + b;
//   for(let x of arguments)
//   	if (max < x) max = x;
//   return max;
// }
// let a = findMax(1, 123, 50, 1150, 44, 88);
// console.log(a)
// console.log(ff)

// const myObject = {
//   firstName:"John",
//   lastName: "Doe",
//   fullName: function() {
//     return this.toString();
//   }
// }
//
// console.log(myObject.fullName())
// console.log(myObject.toString())


function Person(first, last, age, eye) {
  this.firstName = first;
  this.lastName = last;
  this.age = age;
  this.eyeColor = eye;
}
const myFather = new Person("John", "Doe", 50, "blue");
console.log(myFather)

Math.max.apply(null, [1,2,3])