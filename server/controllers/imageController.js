import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";

export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    if (
      !userId ||
      !prompt ||
      typeof prompt !== "string" ||
      prompt.trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. User ID and prompt are required.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.creditBalance <= 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient Balance",
        creditBalance: user.creditBalance,
      });
    }

    if (!process.env.CLIPDROP_API) {
      console.error("Clipdrop API Key is missing!");
      return res
        .status(500)
        .json({ success: false, message: "Server error: Missing API key" });
    }

    const formData = new FormData();
    formData.append("prompt", prompt); 

    const headers = {
      "x-api-key": process.env.CLIPDROP_API,
      ...formData.getHeaders(),
    };

    console.log("Sending request to Clipdrop:", { prompt });

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      { headers, responseType: "arraybuffer" }
    );

    console.log("Received response from Clipdrop...");

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    const updatedUser = await userModel.findByIdAndUpdate(
      user.id,
      { $inc: { creditBalance: -1 } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Image generated successfully",
      creditBalance: updatedUser.creditBalance,
      resultImage,
    });
  } catch (error) {
    let errorMessage = "Internal Server Error";
    if (error.response?.data) {
      try {
        errorMessage = error.response.data.toString();
      } catch (err) {
        errorMessage = "Error parsing API response";
      }
    }

    console.error("Clipdrop API Error:", errorMessage);

    return res.status(500).json({ success: false, message: errorMessage });
  }
};
