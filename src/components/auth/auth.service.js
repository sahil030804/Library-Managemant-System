import userMdl from "../../models/user.js";
import blacklistMdl from "../../models/blacklist.js";
import helper from "../../utils/helper.js";

const registerUser = async (reqBody) => {
  const { name, email, password, confirm_password, phone, address } = reqBody;
  try {
    const emailExistCheck = await helper.emailExistingCheck(email);

    if (emailExistCheck) {
      const error = new Error("USER_EXIST");
      throw error;
    }

    const hashedPassword = helper.encryptPassword(password);

    if (!helper.decryptPassword(confirm_password, hashedPassword)) {
      const error = new Error("PASSWORD_NOT_SAME");
      throw error;
    }

    const generateMembershipId = helper.generateMembershipId();

    const newMember = await userMdl.user({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      address: address,
      membershipId: generateMembershipId,
      createdAt: new Date().toISOString(),
    });

    const member = await newMember.save();

    const accessAndRefreshToken = await helper.generateAccessAndRefreshToken(
      member._id,
      member.role
    );

    const userDetails = {
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
      userDetails,
      accessToken: accessAndRefreshToken.accessToken,
      refreshToken: accessAndRefreshToken.refreshToken,
    };
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

const loginUser = async (reqBody) => {
  const { email, password } = reqBody;

  try {
    const userFound = await userMdl.user.findOne({ email });

    if (!userFound) {
      const error = new Error("USER_NOT_FOUND");
      throw error;
    }

    if (!helper.decryptPassword(password, userFound.password)) {
      const error = new Error("INVALID_PASSWORD");
      throw error;
    }

    const accessAndRefreshToken = await helper.generateAccessAndRefreshToken(
      userFound._id,
      userFound.role
    );
    const userDetail = {
      _id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      role: userFound.role,
      membershipId: userFound.membershipId,
      status: userFound.status,
    };
    return {
      userDetail,
      accessToken: accessAndRefreshToken.accessToken,
      refreshToken: accessAndRefreshToken.refreshToken,
    };
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

const logoutUser = async (req, res) => {
  try {
    const userFound = await userMdl.user.findById(req.user._id);
    req.session.destroy((err) => {
      if (err) {
        const error = new Error(err.message);
        throw error;
      }
    });
    const blacklisted = await blacklistMdl.blacklist({
      accessToken: req.accessToken,
    });
    await blacklisted.save();

    userFound.refreshToken = null;
    await userFound.save();

    res.clearCookie("connect.sid");
    return { message: "User logged out successfully" };
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

const resetPassword = async (reqBody) => {
  const { email, new_password, confirm_password } = reqBody;
  try {
    const userFound = await userMdl.user.findOne({ email });

    if (!userFound) {
      const error = new Error("USER_NOT_FOUND");
      throw error;
    }

    if (helper.decryptPassword(new_password, userFound.password)) {
      const error = new Error("CURRENT_PASSWORD");
      throw error;
    }
    const hashedPassword = helper.encryptPassword(new_password);

    if (!helper.decryptPassword(confirm_password, hashedPassword)) {
      const error = new Error("PASSWORD_NOT_SAME");
      throw error;
    }

    await userMdl.user.findByIdAndUpdate(userFound._id, {
      password: hashedPassword,
    });

    return { message: "Password reseted successfully" };
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};
export default { registerUser, loginUser, logoutUser, resetPassword };
