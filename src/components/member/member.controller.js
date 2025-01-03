import memberService from "./member.service.js";

const addMember = async (req, res, next) => {
  try {
    const memberData = await memberService.addMember(req.body);
    res.status(201).json(memberData);
  } catch (error) {
    next(error);
  }
};
const allMembers = async (req, res, next) => {
  try {
    const allMembers = await memberService.allMembers(req.body);
    res.status(200).json(allMembers);
  } catch (error) {
    next(error);
  }
};
const singleMember = async (req, res, next) => {
  try {
    const member = await memberService.singleMember(req);
    res.status(200).json(member);
  } catch (error) {
    next(error);
  }
};
const updateMember = async (req, res, next) => {
  try {
    const updateMember = await memberService.updateMember(req);
    res.status(200).json(updateMember);
  } catch (error) {
    next(error);
  }
};
const viewMembersBorrowHistory = async (req, res, next) => {
  try {
    const history = await memberService.viewMembersBorrowHistory(req.body);
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};
const toggleAdmin = async (req, res, next) => {
  try {
    const history = await memberService.toggleAdmin(req);
    res.status(200).json(history);
  } catch (error) {
    next(error);
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
