import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Image must belong to a user.'],
      index: true,
    },
    prompt: {
      type: String,
      required: [true, 'A prompt is required.'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image data is required.'],
    },
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.model('Image', imageSchema);

export default Image;
