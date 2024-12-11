import user from "../models/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const emailExistingCheck = async (email) => {
  const countEmailExisting = await user.countDocuments({ email });

  if (countEmailExisting > 0) {
    return true;
  }
  return false;
};

const saltRounds = 10;

const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

const decryptPassword = (plain, hashed) => {
  return bcrypt.compareSync(plain, hashed);
};

const generateMembershipId = () => {
  const timestamp = Date.now();
  const randomdata = crypto.randomBytes(10).toString("hex");
  return `MEM-${timestamp}-${randomdata}`;
};
export default {
  emailExistingCheck,
  encryptPassword,
  decryptPassword,
  generateMembershipId,
};
