function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  if (typeof obj === 'string' || obj instanceof String) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

const myFunc = async (a, b, c) => {
  a.forEach(element => {
    console.log(element);
  });

  for (let c = 0; c < b.length; c++) {
    const element = b[c];
    console.log(element);
  }

  for (const sneezer in c) {
    if (c.hasOwnProperty(sneezer)) {
      const element = c[sneezer];
      if (isIterable(element)) {
        for (let index = 0; index < element.length; index++) {
          const element2 = element[index];
          console.log(element2);
        }
      }
      else {
        console.log(element);
      }
    }
  }
}

myFunc(['a', 'b'], ['1', 2, 3, 4, 5, 6], {a: 'quick', b: 'fox', c: [1,2,3,4,5,6], d: {e: [1,3,3,4]} });

