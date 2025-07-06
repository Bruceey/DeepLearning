// const myObj = {
//   name: "John",
//   age: 30,
//   cars: [
//     {name:"Ford", models:["Fiesta", "Focus", "Mustang"]},
//     {name:"BMW", models:["320", "X3", "X5"]},
//     {name:"Fiat", models:["500", "Panda"]}
//   ]
// }
//
// for (let i in myObj.cars) console.log(i)

// function myCounter() {
//   let counter = 0;
//   return function() {
//     if (counter === 2) console.log(counter);
//     counter++;
//     return counter;
//   };
// }
// const add = myCounter();
// add();
// add();
// add();
//
// new Date()
//
// const arr1 = ["Emil", "Tobias", "Linus"];
// const myChildren = arr1.concat("Peter");

// "use strict";
// const obj = {};
// Object.defineProperty(obj, "x", {value:0, writable:false});
// console.log(obj.x);
// obj.x = 3.14;

// "use strict";
// eval ("x = 2");
// alert (x);

// class Car {
//   constructor(name, year) {
//     this.name = name;
//     this.year = year;
//   }
// }
// const myCar1 = new Car("Ford", 2014);
// console.log(typeof Car)

function Car(name) {
  this.name = name;
}

const car1 = new Car("Toyota");
const car2 = new Car("Honda");
