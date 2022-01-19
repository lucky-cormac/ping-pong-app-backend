import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import methodOverride from 'method-override';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import routes from '../api/routes/v1';
import vars from './vars';
import errorHandler from '../api/middlewares/error.middleware';
import configurePassport from './passport';

configurePassport();

const app = express();

app.use(morgan(vars.logs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(helmet());
app.use(cors());
app.use(passport.initialize());

app.use('/v1', routes);
app.use(errorHandler.converter);
app.use(errorHandler.notFound);
app.use(errorHandler.handler);

export default app;
