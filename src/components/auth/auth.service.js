import user from "../../models/user.js";
import helper from "../../utils/helper.js";

const registerUser = async (reqBody) => {
  const { name, email, password, phone, address } = reqBody;
  try {
    const emailExistCheck = await helper.emailExistingCheck(email);

    if (emailExistCheck) {
      const error = new Error("USER_EXIST");
      throw error;
    }

    const hashedPassword = helper.encryptPassword(password);
    const generateMembershipId = helper.generateMembershipId();

    const newMember = await user({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      address: address,
      membershipId: generateMembershipId,
      createdAt: new Date().toISOString(),
    });

    const member = await newMember.save();

    const userDetails = {
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      createdAt: member.createdAt,
    };

    return { userDetails };
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

const loginUser = async (reqBody) => {
  const { email, password } = reqBody;

  try {
    const userFound = await user.findOne({ email });

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

    return {
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
    const userFound = await user.findOne(req.user.email);
    req.session.destroy((err) => {
      if (err) {
        const error = new Error(err.message);
        throw error;
      }
    });

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
  const { email, password } = reqBody;
  try {
    const userFound = await user.findOne({ email });

    if (!userFound) {
      const error = new Error("USER_NOT_FOUND");
      throw error;
    }

    if (helper.decryptPassword(password, userFound.password)) {
      const error = new Error("CURRENT_PASSWORD");
      throw error;
    }

    const hashedPassword = helper.encryptPassword(password);

    await user.findByIdAndUpdate(userFound._id, {
      password: hashedPassword,
    });

    return { message: "Password reseted successfully" };
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};
export default { registerUser, loginUser, logoutUser, resetPassword };
