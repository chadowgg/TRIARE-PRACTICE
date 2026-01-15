function processInput(arg: number | string): void {
  if (typeof arg === "string") {
    console.log(arg.toUpperCase());
  } else {
    console.log(arg * 2);
  }
}

processInput(10);
processInput("text");
