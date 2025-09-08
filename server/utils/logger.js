import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const logDirectory = path.join(process.cwd(), 'logs');

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  level: 'debug',
  filename: path.join(logDirectory, '%DATE%-combined.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const consoleTransport = new winston.transports.Console({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    process.env.NODE_ENV !== 'production'
      ? consoleTransport
      : dailyRotateFileTransport,
  ],
  exitOnError: false,
});

export default logger;

