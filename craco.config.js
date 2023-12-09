/* eslint-disable */

if (process.env.REACT_APP_BUILD_MODE === 'dev') {
  require('dotenv').config({ path: './config/.env.development' });
} else if (process.env.REACT_APP_BUILD_MODE === 'prod') {
  require('dotenv').config({ path: './config/.env.production' });
} else {
  require('dotenv').config({ path: './config/.env.local' });
}

module.exports = {
  plugins: []
};
