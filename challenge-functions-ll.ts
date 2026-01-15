function processData(input: string | number,
                     config: { reverse: boolean } = { reverse: false }
): string | number {
  if (typeof input === "number") {
    return input * input;
  } else  {
    if (config.reverse) {
      return input.toUpperCase().split('').reverse().join('');
    } else {
      return input.toUpperCase();
    }
  }
}

console.log(processData(10));
console.log(processData("text"));
console.log(processData('text2', { reverse: true }));