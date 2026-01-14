let arrayNames: string[] = ["asus", "lenovo", "hp"];

// function isNameInArray(arr: string[], name: string): boolean {
//   for (let element of arr) {
//     if (element === name) {
//       return true;
//     }
//   }
//
//   return false;
// }

function isNameInList(name: string): boolean {
  return arrayNames.includes(name);
}

console.log(isNameInList("asus"));
console.log(isNameInList('bmw'));