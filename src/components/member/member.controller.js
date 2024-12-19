import memberService from "./member.service.js";

const addMember = async (req, res, next) => {
  try {
    const memberData = await memberService.addMember(req.body);
    res.status(201).json({ Member_Details: memberData });
  } catch (error) {
    next(error);
  }
};
const allMembers = async (req, res, next) => {
  try {
    const allMembers = await memberService.allMembers();
    res.status(200).json({ Members: allMembers });
  } catch (error) {
    next(error);
  }
};
const singleMember = async (req, res, next) => {
  try {
    const member = await memberService.singleMember(req);
    res.status(200).json({ Member: member });
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
const viewHistory = async (req, res, next) => {
  try {
    const history = await memberService.viewHistory(req);
    res.status(200).json({ history: history });
  } catch (error) {
    next(error);
  }
};

export default {
  addMember,
  allMembers,
  singleMember,
  updateMember,
  viewHistory,
};
