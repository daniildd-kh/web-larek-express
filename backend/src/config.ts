import dotenv from 'dotenv';

dotenv.config();

const config = {
  DB_ADDRESS: process.env.DB_ADDRESS || 'mongodb://localhost:27017/mydatabase',
  PORT : process.env.PORT || 3000,

}

export default config