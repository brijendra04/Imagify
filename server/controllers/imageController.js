import mongoose from 'mongoose';
import userModel from '../models/userModel.js';
import imageModel from '../models/imageModel.js';
import geminiService from '../services/geminiService.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

const generateImage = catchAsync(async (req, res, next) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return next(new AppError('Prompt is required', 400));
  }
  
  if (prompt.length > 500) {
    return next(new AppError('Prompt is too long. Maximum 500 characters allowed.', 400));
  }

  const session = await mongoose.startSession();
  let responseData;

  try {
    await session.withTransaction(async () => {
      const user = await userModel.findById(req.user.id).session(session);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (user.creditBalance <= 0) {
        throw new AppError('Insufficient credits', 403);
      }

      const imageUrl = await geminiService.generateImageFromPrompt(prompt);

      if (!imageUrl) {
        throw new AppError('Image generation service failed', 502);
      }

      const newImage = new imageModel({
        user: user._id,
        prompt,
        image: imageUrl,
      });
      await newImage.save({ session });

      user.creditBalance -= 1;
      await user.save({ session });

      responseData = {
        image: newImage.image,
        creditBalance: user.creditBalance,
        imageId: newImage._id,
      };
    });

    res.status(201).json({
      success: true,
      message: 'Image generated successfully',
      ...responseData,
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
});

export { generateImage };
