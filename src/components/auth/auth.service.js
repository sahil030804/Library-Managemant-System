import UserMdl from "../../models/user.js";
import helper from "../../utils/helper.js";
import sendMail from "../../utils/emailService.js";
import registrationTemplate from "../../mailTemplates/registrationTemplate.js";

const registerUser = async (userData) => {
  const { name, email, password, phone, address } = userData;
  try {
    const emailExistCheck = await helper.emailExistingCheck(email);

    if (emailExistCheck) {
      throw new Error("EMAIL_EXIST");
    }

    const hashedPassword = helper.encryptPassword(password);

    const generateMembershipId = helper.generateMembershipId();

    const newMember = await UserMdl({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      address: address,
      membershipId: generateMembershipId,
      createdAt: helper.currentDateAndTime(),
    });

    const member = await newMember.save();
    await sendMail(
      email,
      "Registration Successfull",
      "",
      registrationTemplate(name)
    );

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

    return { message: "User registered successfully", userDetail };
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginUser = async (userData) => {
  const { email, password } = userData;

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
    return { message: "User loggedin successfully", userDetail };
  } catch (err) {
    throw new Error(err.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    if (!req.session.userId) {
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
  const { current_password, new_password } = req.body;
  try {
    const userFound = await UserMdl.findOne({ _id: req.user._id });

    if (!userFound) {
      throw new Error("USER_NOT_FOUND");
    }
    if (!helper.comparePassword(current_password, userFound.password)) {
      throw new Error("INVALID_PASSWORD");
    }

    const hashedPassword = helper.encryptPassword(new_password);

    await UserMdl.findByIdAndUpdate(userFound._id, {
      password: hashedPassword,
    });

    return { message: "Password reseted successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
};
export default { registerUser, loginUser, logoutUser, resetPassword };
