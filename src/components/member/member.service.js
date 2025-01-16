import BorrowMdl from "../../models/borrowing.js";
import UserMdl from "../../models/user.js";
import helper from "../../utils/helper.js";
import { USER_ROLE } from "../../utils/constant.js";

const addMember = async (reqBody) => {
  const { name, email, password, phone, address, role, status } = reqBody;

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

const allMembers = async (paginationCriteria) => {
  const { page, limit, search } = paginationCriteria;
  const sanitizedSearch = search.trim();
  try {
    const query = {
      $or: [
        {
          name: { $regex: sanitizedSearch, $options: "i" },
        },
        {
          email: {
            $regex: sanitizedSearch,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: sanitizedSearch,
          },
        },
      ],
    };
    const projection = "-password";
    const options = {
      limit: limit,
      skip: (page - 1) * limit,
    };
    let filteredMembers = await UserMdl.find(query, projection, options);
    if (filteredMembers.length === 0) {
      throw new Error("NO_MEMBER_FOUND");
    }

    return {
      members: filteredMembers,
    };
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
    console.log(memberData);

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

const viewMembersBorrowHistory = async (paginationCriteria) => {
  const { page, limit, search } = paginationCriteria;
  const sanitizedSearch = search.trim();
  console.log(page);
  console.log(limit);
  console.log(search);

  try {
    const query = {
      $or: [
        { "user.name": { $regex: sanitizedSearch, $options: "i" } },
        { "user.email": { $regex: sanitizedSearch, $options: "i" } },
        { "user.phone": { $regex: sanitizedSearch } },
        { "book.title": { $regex: sanitizedSearch, $options: "i" } },
        { "book.authors": { $regex: sanitizedSearch, $options: "i" } },
        { "book.category": { $regex: sanitizedSearch, $options: "i" } },
        { status: { $regex: sanitizedSearch, $options: "i" } },
      ],
    };

    const skip = (page - 1) * limit;

    // Perform the query with populate
    let borrowHistory = await BorrowMdl.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: query },
      {
        $project: {
          _id: 1,
          borrowDate: 1,
          dueDate: 1,
          returnDate: 1,
          status: 1,
          book: {
            _id: "$book._id",
            title: "$book.title",
            authors: "$book.authors",
            category: "$book.category",
            ISBN: "$book.ISBN",
          },
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
            phone: "$user.phone",
            address: "$user.address",
          },
          fine: 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    if (borrowHistory.length === 0) {
      throw new Error("NO_HISTORY");
    }
    console.log("history ", borrowHistory.length);

    return {
      history: borrowHistory,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const toggleAdmin = async (req) => {
  const { userId, role } = req.body;
  try {
    await UserMdl.findByIdAndUpdate(userId, {
      role,
    });
    return { message: "User changes saved" };
  } catch (err) {
    throw new Error(err.message);
  }
};
export default {
  addMember,
  allMembers,
  singleMember,
  updateMember,
  viewMembersBorrowHistory,
  toggleAdmin,
};
