module.exports = {
  apps: [
    {
      name: 'kdong-admin',
      script: 'node ws.js',
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      // args: 'node ws.js',
      instances: 1,
      autorestart: true,
      watch: false,
      exec_mode: 'fork',
      source_map_support: false,
      env: {
        PORT: 5656,
        NODE_ENV: 'development'
      },
      env_production: {
        PORT: 5656,
        NODE_ENV: 'production'
      }
    }
  ]
};
