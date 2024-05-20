import { Container } from 'inversify';
import { UserService } from './services';
import { UserController } from './controllers';
import { TYPES } from './constants';
import { AuthMiddleware } from './middlewares';


const container = new Container();

// Bind Services
container.bind<UserService>(TYPES.UserService).to(UserService);

// Bind Controllers
container.bind<UserController>(UserController).toSelf();

//Bind Middelwear
container.bind<AuthMiddleware>(AuthMiddleware).toSelf();

export { container };
