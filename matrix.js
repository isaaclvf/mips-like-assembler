const a = [
  [5, 7, 9, 10],
  [2, 3, 3, 8],
  [8, 10, 2, 3],
  [3, 3, 4, 8],
];

const b = [
  [3, 10, 12, 18],
  [12, 1, 4, 9],
  [9, 10, 12, 2],
  [3, 12, 4, 10],
];

const empty = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const result = [
  [210, 267, 236, 271],
  [93, 149, 104, 149],
  [171, 146, 172, 268],
  [105, 169, 128, 169],
];

function decToBin(decimal, length) {
  return (decimal >>> 0).toString(2).padStart(length, "0");
}

function binaryToHex(binary) {
  const decimal = parseInt(binary, 2);
  const hexadecimal = decimal.toString(16).toUpperCase().padStart(8, "0");
  return hexadecimal;
}

const aHex = a
  .flat()
  .map((num) => decToBin(num))
  .map((b) => binaryToHex(b))
  .toString()
  .replaceAll(",", " ");

const bHex = b
  .flat()
  .map((num) => decToBin(num))
  .map((b) => binaryToHex(b))
  .toString()
  .replaceAll(",", " ");

const resultHex = result
  .flat()
  .map((num) => decToBin(num))
  .map((b) => binaryToHex(b))
  .toString()
  .replaceAll(",", " ");

const emptyHex = empty
  .flat()
  .map((num) => decToBin(num))
  .map((b) => binaryToHex(b))
  .toString()
  .replaceAll(",", " ");

console.log({ aHex, bHex, resultHex });

console.log(aHex + " " + bHex + " " + emptyHex + " " + resultHex);
