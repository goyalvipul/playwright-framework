/* eslint-diable detect-non-literal-require */

import path from 'path';

const environment = process.env.ENV || 'qa';
const configPath = path.join(__dirname, `./${environment}.env.json`);
export const config = require(configPath);
