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
      createdAt: helper.currentDateAndTime(),
    });

    await newMember.save();

    return { message: "User added successfully" };
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
  const { page = 1, limit = 10, search = " " } = req.body;
  try {
    let filteredBorrows = await BorrowMdl.find().populate([
      {
        path: "bookId",
        select: "-_id title ISBN",
      },
      {
        path: "userId",
        select: "-_id name email phone address",
      },
    ]);

    if (search.toLowerCase().replaceAll(" ", "")) {
      filteredBorrows = filteredBorrows.filter((borrow) => {
        if (
          borrow.userId.name
            .toLowerCase()
            .replaceAll(" ", "")
            .includes(search.toLowerCase().replaceAll(" ", ""))
        ) {
          return true;
        }
        if (
          borrow.userId.email
            .toLowerCase()
            .replaceAll(" ", "")
            .includes(search.toLowerCase().replaceAll(" ", ""))
        ) {
          return true;
        }
        if (
          borrow.userId.phone
            .toString()
            .replaceAll(" ", "")
            .includes(search.toLowerCase().replaceAll(" ", ""))
        ) {
          return true;
        }
      });
    }
    if (filteredBorrows.length === 0) {
      throw new Error("NO_HISTORY");
    }
    const startIndex = (page - 1) * limit;
    const paginatedBorrows = filteredBorrows.slice(
      startIndex,
      startIndex + limit
    );
    if (paginatedBorrows.length === 0) {
      throw new Error("NO_MORE_DATA");
    }
    return paginatedBorrows;
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
