export function getConfig() {
  const env = process.env.NODE_ENV || 'development';

  const dbURL = process.env.MONGO_URI || 'mongodb://localhost:27017';

  const dbName = process.env.DB_NAME || 'miss_bug';

  const port = parseInt(process.env.PORT || '3030', 10);

  const frontendUrl = process.env.FRONTEND_URL || '';

  return {
    app: {
      port,
      env,
    },
    database: {
      url: dbURL,
      name: dbName,
    },
    cors: {
      origin: frontendUrl,
    },
  };
}

export const config = getConfig();
