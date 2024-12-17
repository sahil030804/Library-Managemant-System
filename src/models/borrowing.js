import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "books" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    borrowDate: { type: Date },
    dueDate: { type: Date },
    returnDate: { type: Date },
    status: {
      type: String,
      enum: ["borrowed", "returned", "overdue"],
    },
    fine: { type: Number },
  },
  { versionKey: false }
);

const borrow = mongoose.model("borrow", borrowSchema);

export default { borrow };
