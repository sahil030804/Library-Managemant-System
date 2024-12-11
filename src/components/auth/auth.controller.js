import authService from "./auth.service.js";

const registerUser = async (req, res, next) => {
  try {
    const memberData = await authService.registerUser(req.body);
    res.status(200).json(memberData);
  } catch (error) {
    next(error);
  }
};

export default { registerUser };
