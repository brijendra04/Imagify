import React from "react";

const Steps = () => {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2">How it works</h1>
      <p className="text-text-lg text-gray-600 mb-8">
        Transform Words Into Stunning Images
      </p>

      <div>
        {stepsData.map((step, index) => (
          <div key={index}>
            <div className="flex items-center gap-2">
              <img src={step.icon} alt="" />
              <h3 className="text-lg font-semibold">{step.title}</h3>
            </div>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Steps;
