import React from "react";
import { assets } from "../assets/assets";

const Description = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center my-24 p-6 md:px-28">
      <h1 className="text-3xl sm:text-4xl font-semibold">Create AI Images</h1>
      <p className="text-gray-500 mb-8">Turn your imagination into visuals</p>

      <div className="flex felx-col gap-5 md:gap-14 md:flex-row items-center">
        <img
          src={assets.sample_img_1}
          alt=""
          className="w-80 xl:w-96 rounded-lg "
        />
        <div>
          <h2 className="text-3xl font-medium max-w-lg mb-4">Introducing the AI-Powered Text to Image Generator</h2>
          <p className="text-gray-600 mb-4 text-left">
            Easily bring your ideas to life with our free AI image generator.
            Whether you need stunning visuals or unique imagery, our tool
            transforms your text into eye-catching images with just a few
            clicks. Imagine it, describe it, and watch it come to life
            instantly.
          </p>
          <p className="text-gray-600 text-left">
            Simply type your text, choose your preferred style, and let our AI
            generator do the rest. Our tool is perfect for generating high-quality images for social media, blogs, websites, and more. Get started today and unleash your creativity with our AI image generator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Description;
