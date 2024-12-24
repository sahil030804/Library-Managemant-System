import BorrowMdl from "../../models/borrowing.js";
import UserMdl from "../../models/user.js";
import helper from "../../utils/helper.js";
import { USER_ROLE } from "../../utils/constant.js";

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
      throw new Error("USER_EXIST");
      
    }

    const hashedPassword = helper.encryptPassword(password);

    if (!helper.comparePassword(confirm_password, hashedPassword)) {
      throw new Error("PASSWORD_NOT_SAME");
      
    }
    const generateMembershipId = helper.generateMembershipId();

    const newMember = await UserMdl({
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
    throw new Error(err.message);
    
  }
};

const allMembers = async () => {
  try {
    const allMembers = await UserMdl.find();

    if (allMembers.length === 0) {
      throw new Error("NO_MEMBER_FOUND");
      
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
    return { members };
  } catch (err) {
    throw new Error(err.message);
    
  }
};

const singleMember = async (req) => {
  const memberId = req.params.id;
  try {
    if (memberId.length !== 24) {
      throw new Error("INVALID_MEMBER_ID");
      
    }
    const memberData = await UserMdl.findById(memberId);
    if (!memberData) {
      throw new Error("NO_MEMBER_FOUND");
      
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
    return { member };
  } catch (err) {
    throw new Error(err.message);
    
  }
};

const updateMember = async (req) => {
  const memberId = req.params.id;
  const { name, email, phone, address, role, status } = req.body;
  try {
    const userData = await UserMdl.findById(req.user._id);
    if (memberId.length !== 24) {
      throw new Error("INVALID_MEMBER_ID");
      
    }

    const memberFound = await UserMdl.findById(memberId);
    if (!memberFound) {
      throw new Error("NO_MEMBER_FOUND");
      
    }

    let updateMember;
    if (userData.role == USER_ROLE.ADMIN) {
      updateMember = await UserMdl.findByIdAndUpdate(
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
    if (userData.role == USER_ROLE.MEMBER) {
      updateMember = await UserMdl.findByIdAndUpdate(
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
    throw new Error(err.message);
    
  }
};

const viewHistory = async (req) => {
  try {
    const fetchHistory = await BorrowMdl
      .find({ userId: req.params.id })
      .populate([{ path: "bookId", select: "-_id title authors" }]);

    if (fetchHistory.length === 0) {
      throw new Error("NO_HISTORY");
      
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

    return { history };
  } catch (err) {
    throw new Error(err.message);
    
  }
};
export default {
  addMember,
  allMembers,
  singleMember,
  updateMember,
  viewHistory,
};
