import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema(
  {
    accessToken: { type: String },
  },
  { versionKey: false }
);

const blacklist = mongoose.model("blacklist", blacklistSchema);

export default blacklist;
