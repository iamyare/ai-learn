type LogLevel = 'info' | 'warn' | 'error'

interface LogMessage {
  level: LogLevel
  message: string
  metadata?: Record<string, unknown>
  timestamp: string
}

class Logger {
  private static instance: Logger
  private logs: LogMessage[] = []

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
    const logMessage: LogMessage = {
      level,
      message,
      metadata,
      timestamp: new Date().toISOString()
    }
    
    this.logs.push(logMessage)
    
    // En desarrollo, también imprimimos en consola
    if (process.env.NODE_ENV === 'development') {
      const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : ''
      console.log(`[${logMessage.timestamp}] ${level.toUpperCase()}: ${message}${metadataStr}`)
    }
  }

  info(message: string, metadata?: Record<string, unknown>) {
    this.log('info', message, metadata)
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.log('warn', message, metadata)
  }

  error(message: string, metadata?: Record<string, unknown>) {
    this.log('error', message, metadata)
  }

  getLogs(): LogMessage[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

export const logger = Logger.getInstance()