import borrowMdl from "../../models/borrowing.js";
import userMdl from "../../models/user.js";
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

    const newMember = await userMdl.user({
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
      _id: member._id,
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
    const allMembers = await userMdl.user.find();

    if (allMembers.length === 0) {
      const error = new Error("NO_MEMBER_FOUND");
      throw error;
    }

    const members = allMembers.map((member) => {
      return {
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
    });
    return members;
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

const singleMember = async (req) => {
  const memberId = req.params.id;
  try {
    if (memberId.length !== 24) {
      const error = new Error("INVALID_MEMBER_ID");
      throw error;
    }
    const memberData = await userMdl.user.findById(memberId);
    if (!memberData) {
      const error = new Error("NO_MEMBER_FOUND");
      throw error;
    }
    const member = {
      _id: memberData._id,
      name: memberData.name,
      email: memberData.email,
      phone: memberData.phone,
      address: memberData.address,
      role: memberData.role,
      membershipId: memberData.membershipId,
      status: memberData.status,
      createdAt: memberData.createdAt,
    };
    return member;
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

const updateMember = async (req) => {
  const memberId = req.params.id;
  const { name, email, phone, address, role, status } = req.body;
  try {
    const tokenData = await userMdl.user.findById(req.user._id);
    if (memberId.length !== 24) {
      const error = new Error("INVALID_MEMBER_ID");
      throw error;
    }

    const memberFound = await userMdl.user.findById(memberId);
    if (!memberFound) {
      const error = new Error("NO_MEMBER_FOUND");
      throw error;
    }

    let updateMember;
    if (tokenData.role == "admin") {
      updateMember = await userMdl.user.findByIdAndUpdate(
        memberId,
        {
          name: name,
          phone: phone,
          address: address,
          role: role,
          status: status,
        },
        { new: true }
      );
    }
    if (tokenData.role == "member") {
      updateMember = await userMdl.user.findByIdAndUpdate(
        memberId,
        {
          name: name,
          phone: phone,
          address: address,
        },
        { new: true }
      );
    }

    return { message: `Updated successfully` };
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

const viewHistory = async (req) => {
  try {
    const fetchHistory = await borrowMdl.borrow
      .find({ userId: req.params.id })
      .populate([{ path: "bookId", select: "-_id title authors" }]);

    if (fetchHistory.length === 0) {
      const error = new Error("NO_HISTORY");
      throw error;
    }

    const history = fetchHistory.map((history) => {
      return {
        _id: history._id,
        bookDetails: {
          title: history.bookId.title,
          authors: history.bookId.authors,
        },
        borrowDate: history.borrowDate,
        dueDate: history.dueDate,
        returnDate: history.returnDate,
        status: history.status,
        fine: history.fine,
      };
    });

    return history;
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};
export default {
  addMember,
  allMembers,
  singleMember,
  updateMember,
  viewHistory,
};
