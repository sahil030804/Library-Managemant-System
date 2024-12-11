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

export default { registerUser };
