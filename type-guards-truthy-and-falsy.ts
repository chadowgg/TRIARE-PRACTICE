function printLength(str: string | null | undefined) {
  // if (typeof str === 'string') {
  if (str) {
    console.log(str.length);
  } else {
    console.log('No string provided');
  }
}

printLength('Hello, World!');
printLength(null);
printLength('');
printLength(undefined);
