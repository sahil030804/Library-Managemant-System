import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, require: [true, "Title is required (from DB)"] },
    authors: [
      {
        type: String,
        require: [true, "Authors is required (from DB)"],
      },
    ],
    ISBN: { type: String, require: [true, "ISBN is required (from DB)"] },
    category: {
      type: String,
      require: [true, "Category is required (from DB)"],
    },
    publicationYear: {
      type: Number,
      require: [true, "Publication year is required (from DB)"],
    },
    totalCopies: {
      type: Number,
      require: [true, "Total copies is required (from DB)"],
    },
    availableCopies: { type: Number },
    shelfNumber: {
      type: String,
      require: [true, "shelf number is required (from DB)"],
    },
    addedAt: { type: Date },
    lastUpdated: { type: Date },
  },
  { versionKey: false }
);

const book = mongoose.model("books", bookSchema);

export default book;
