export const Config = {
  NodeEnv: process.env.NODE_ENV,
  WebSocketUrl: process.env.REACT_APP_WEBSOCKET_URL2,
  SentryDsn: process.env.REACT_APP_SENTRY_DSN
}

export enum Environment {
  Production = "production",
  Development = "development"
}
