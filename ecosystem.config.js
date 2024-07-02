require('dotenv').config();

const {
  DEPLOY_USER, DEPLOY_PASS, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF = 'origin/master',
} = process.env;

module.exports = {
  apps: [{
    name: 'api-service',
    script: './dist/app.js',
  }],

  // Настройка деплоя
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: [DEPLOY_HOST],
      ref: DEPLOY_REF,
      ssh_options: "StrictHostKeyChecking=no",
      repo: 'https://github.com/themison/nodejs-mesto-backend.git',
      path: DEPLOY_PATH,
      'pre-deploy': `scp ./README.md ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`,
      'post-deploy': 'npm i && npm run build',
    },
  },
};