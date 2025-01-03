import authService from "./auth.service.js";

const registerUser = async (req, res, next) => {
  try {
    const memberData = await authService.registerUser(req.body);
    req.session.userId = memberData.userDetail._id;
    res.status(201).json(memberData);
  } catch (error) {
    next(error);
  }
};
const loginUser = async (req, res, next) => {
  try {
    const memberData = await authService.loginUser(req.body);
    req.session.userId = memberData.userDetail._id;
    res.status(200).json(memberData);
  } catch (error) {
    next(error);
  }
};
const logoutUser = async (req, res, next) => {
  try {
    const loggedOut = await authService.logoutUser(req, res);
    res.status(200).json(loggedOut);
  } catch (error) {
    next(error);
  }
};
const resetPassword = async (req, res, next) => {
  try {
    const reset = await authService.resetPassword(req);
    res.status(200).json(reset);
  } catch (error) {
    next(error);
  }
};

export default { registerUser, loginUser, logoutUser, resetPassword };
