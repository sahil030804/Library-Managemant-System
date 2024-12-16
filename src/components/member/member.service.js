import user from "../../models/user.js";
import helper from "../../utils/helper.js";

const addMember = async (reqBody) => {
  const {
    name,
    email,
    password,
    confirm_password,
    phone,
    address,
    role,
    status,
  } = reqBody;

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

    const newMember = await user({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
      phone: phone,
      address: address,
      membershipId: generateMembershipId,
      status: status,
      createdAt: new Date().toISOString(),
    });

    const member = await newMember.save();

    const userDetails = {
      name: member.name,
      email: member.email,
      password: member.password,
      phone: member.phone,
      address: member.address,
      role: member.role,
      membershipId: member.membershipId,
      status: member.status,
      createdAt: member.createdAt,
    };

    return userDetails;
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

const allMembers = async () => {
  try {
    const allMembers = await user.find();

    if (allMembers.length === 0) {
      const error = new Error("NO_MEMBER_FOUND");
      throw error;
    }

    const members = allMembers.map((member) => {
      return {
        name: member.name,
        email: member.email,
        phone: member.phone,
        address: member.address,
        role: member.role,
        membershipId: member.membershipId,
        status: member.status,
        createdAt: member.createdAt,
      };
    });
    return members;
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

export default { addMember, allMembers };
