/**
 * Validates required environment variables and exits the process if any are missing
 */
const validateEnv = () => {
  const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'GEMINI_API_KEY'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error('Error: Missing required environment variables:');
    missingEnvVars.forEach(envVar => {
      console.error(`- ${envVar}`);
    });
    console.error('\nPlease set these variables in your .env file');
    process.exit(1);
  }

  // Validate specific environment variables
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error('Error: JWT_SECRET should be at least 32 characters long for security');
    process.exit(1);
  }
};

export default validateEnv;