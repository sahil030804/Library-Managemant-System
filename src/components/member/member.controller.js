import memberService from "./member.service.js";

const addMember = async (req, res, next) => {
  try {
    const memberData = await memberService.addMember(req.body);
    res.status(200).json({ Member_Details: memberData });
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

export default { addMember, allMembers };
