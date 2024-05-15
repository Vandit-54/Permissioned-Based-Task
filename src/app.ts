import 'reflect-metadata';
import dotenv from "dotenv";
import  express  from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import cookieParser from 'cookie-parser';
import { container } from './inversify.config';
import { connectDB } from './config';
import "./config/globals/express"
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

connectDB();

// Set up InversifyExpressServer
const server = new InversifyExpressServer(container, null, { rootPath: '/api' }, app);

const appConfigured = server.build();

const PORT = process.env.PORT || 3000

appConfigured.listen(PORT, () => {
    console.log('Server is running on port '+PORT);
});
