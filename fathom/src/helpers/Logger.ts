import React from "react";

export enum LogLevel {
  log = "log",
  info = "info",
  error = "error",
  debug = "debug",
}

export class Logger {
  log = (level: LogLevel, msg: string) => {
    console[level](msg);
  };
}

const LoggerContext = React.createContext(new Logger());

// this will be the function available for the app to connect to the stores
export const useLogger = () => React.useContext(LoggerContext);
