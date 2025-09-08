import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageGenerated, setIsImageGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  // Get user, credit balance, and login modal state from context
  const { generateImage, user, setShowLogin } = useContext(AppContext);


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.info("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setIsImageGenerated(false);

    const imageResult = await generateImage(input);
    console.log("Generated Image Result:", imageResult); 
    if (imageResult) {
      setImage(imageResult);
      setIsImageGenerated(true);
    }
    
    setLoading(false);
  };

  const handleReset = () => {
    setIsImageGenerated(false);
    setImage(assets.sample_img_1);
    setInput("");
  };

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className="flex flex-col min-h-[90vh] items-center justify-center p-4"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Image Generator</h1>
        {user && typeof user.creditBalance === 'number' && (
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            Credits Remaining: {user.creditBalance}
          </p>
        )}
        <p className="text-neutral-500 mt-2">
          {isImageGenerated
            ? `Result for: "${input}"`
            : "Describe what you want to create."}
        </p>
      </div>

      <div className="relative">
        <img
          src={image}
          alt={
            isImageGenerated
              ? `AI generated image based on the prompt: "${input}"`
              : "Placeholder image for AI generation"
          }
          className={`max-w-sm w-full rounded-lg shadow-lg transition-opacity duration-300 ${
            loading ? "opacity-50 animate-pulse" : "opacity-100"
          }`}
        />
      </div>
      
      {!user ? (
        <div className="text-center p-4 mt-10 w-full max-w-xl rounded-full bg-amber-100 border border-amber-300">
          <p>
            Please{" "}
            <button type="button" onClick={() => setShowLogin(true)} className="font-bold text-blue-600 hover:underline">
              sign in
            </button>{" "}
            to generate images.
          </p>
        </div>
      ) : (
        <div className="flex w-full max-w-xl bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white p-1 mt-10 rounded-full shadow-md">
          <label htmlFor="image-prompt" className="sr-only">
            Image generation prompt
          </label>
          <input
            id="image-prompt"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="A synthwave style sunset over a futuristic city..."
            className="flex-1 bg-transparent outline-none ml-5 placeholder-neutral-400"
            disabled={loading || isImageGenerated}
          />

          {isImageGenerated ? (
            <div className="flex items-center gap-1 p-1">
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full transition-colors"
              >
                New
              </button>
              <a
                href={image}
                download={`${input.substring(0, 30).replace(/\s/g, '_')}.png`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors"
              >
                Download
              </a>
            </div>
          ) : (
            <button
              type="submit"
              className="bg-zinc-900 hover:bg-zinc-700 text-white px-10 sm:px-12 py-3 rounded-full transition-colors disabled:bg-zinc-500 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          )}
        </div>
      )}
    </motion.form>
  );
};

export default Result;

