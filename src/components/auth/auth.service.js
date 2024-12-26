import UserMdl from "../../models/user.js";
import helper from "../../utils/helper.js";

const registerUser = async (reqBody) => {
  const { name, email, password, confirm_password, phone, address } = reqBody;
  try {
    const emailExistCheck = await helper.emailExistingCheck(email);

    if (emailExistCheck) {
      throw new Error("USER_EXIST");
    }

    const hashedPassword = helper.encryptPassword(password);

    if (!helper.comparePassword(confirm_password, hashedPassword)) {
      throw new Error("PASSWORD_NOT_SAME");
    }

    const generateMembershipId = helper.generateMembershipId();

    const currentTime = helper.currentDateAndTime();

    const newMember = await UserMdl({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      address: address,
      membershipId: generateMembershipId,
      createdAt: currentTime,
    });

    const member = await newMember.save();

    const userDetail = {
      _id: member._id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      role: member.role,
      membershipId: member.membershipId,
      status: member.status,
      createdAt: member.createdAt,
    };

    return {
      userDetail,
      user: member,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginUser = async (reqBody) => {
  const { email, password } = reqBody;

  try {
    const userFound = await UserMdl.findOne({ email });

    if (!userFound) {
      throw new Error("USER_NOT_FOUND");
    }

    if (!helper.comparePassword(password, userFound.password)) {
      throw new Error("INVALID_PASSWORD");
    }

    const userDetail = {
      _id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      phone: userFound.phone,
      address: userFound.address,
      role: userFound.role,
      membershipId: userFound.membershipId,
      status: userFound.status,
      createdAt: userFound.createdAt,
    };
    return {
      userDetail,
      user: userFound,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    if (!req.session.user) {
      throw new Error("ALREADY_LOGOUT");
    }
    req.session.destroy((err) => {
      if (err) {
        throw new Error(err.message);
      }
    });

    res.clearCookie("connect.sid");
    return { message: "User logged out successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
};

const resetPassword = async (req) => {
  const { current_password, new_password, confirm_password } = req.body;
  try {
    const userFound = await UserMdl.findOne({ _id: req.user._id });

    if (!userFound) {
      throw new Error("USER_NOT_FOUND");
    }
    if (!helper.comparePassword(current_password, userFound.password)) {
      throw new Error("INVALID_PASSWORD");
    }

    const hashedPassword = helper.encryptPassword(new_password);
    if (!helper.comparePassword(confirm_password, hashedPassword)) {
      throw new Error("PASSWORD_NOT_SAME");
    }

    await UserMdl.findByIdAndUpdate(userFound._id, {
      password: hashedPassword,
    });

    return { message: "Password reseted successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
};
export default { registerUser, loginUser, logoutUser, resetPassword };
