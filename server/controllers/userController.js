import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

const INITIAL_CREDIT_BALANCE = 5;
const JWT_EXPIRES_IN = '7d';

const signToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT Secret is not configured on the server.', 500);
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const userObj = user.toObject();
  delete userObj.password;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user: userObj,
    },
  });
};

const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email, and password!', 400));
  }

  const newUser = await userModel.create({
    name,
    email,
    password,
    creditBalance: INITIAL_CREDIT_BALANCE,
  });

  createAndSendToken(newUser, 201, res);
});

const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await userModel.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createAndSendToken(user, 200, res);
});

const getUserProfile = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      creditBalance: user.creditBalance,
    },
  });
});

export { registerUser, loginUser, getUserProfile };
