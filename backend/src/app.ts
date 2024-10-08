import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes/'
import path from 'path';
import { errors } from 'celebrate';
import errorHandler from './middlewares/error-handler';
import { requestLogger, errorLogger } from './middlewares/logger';
import config from './config';
import cookieParser from 'cookie-parser';


const corsOptions ={
  origin:'http://localhost:5173',
  credentials:true,
  optionSuccessStatus:200,
}


mongoose.connect(config.DB_ADDRESS)
.then(() => console.log('Connected to MongoDB'))
.catch((err) =>{ console.error(err)});

const app = express();

app.use(requestLogger);
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(routes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(config.PORT, () =>{
  console.log('listening on port ' + config.PORT)
})