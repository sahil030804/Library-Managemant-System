import { faker } from "@faker-js/faker";
import path from "path";
import fs from "fs";
import csv from "fast-csv";

const timestamp = Date.now();
// const __dirname = path.dirname(import.meta.dirname);

// const filePath = path.resolve(__dirname, "..", "..", "sample_csv", `1000.csv`);
// console.log(filePath);

const generateBookCsv = (length) => {
  const __dirname = path.dirname(import.meta.dirname);

  const filePath = path.resolve(
    __dirname,
    "..",
    "..",
    "sample_csv",
    `${length}.csv`
  );
  // console.log(filePath);
  try {
    const csvStream = csv.format({ headers: true });
    const fileStream = fs.createWriteStream(filePath);
    csvStream.pipe(fileStream);
    for (let i = 0; i < length; i++) {
      csvStream.write({
        ISBN: faker.commerce.isbn(),
        title: faker.book.title(),
        authors: faker.book.author(),
        category: faker.book.genre(),
        publicationYear: new Date(faker.date.anytime()).getFullYear(),
        totalCopies: faker.number.int({ min: 1, max: 300 }),
        shelfNumber: `${faker.string.alpha({
          length: 1,
          casing: "upper",
        })}-${String(faker.number.int({ min: 1, max: 99 })).padStart(2, "0")}`,
      });
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
console.log(faker.date.anytime());

generateBookCsv(50);

export default { generateBookCsv };
