import { Container } from 'inversify';
import { UserService, RoleService, ModuleService } from '@services';
import { UserController, RoleController,ModuleController } from '@controllers';
import { TYPES } from '@constant';
import { AuthMiddleware } from '@middlewares';


const container = new Container();

// Bind Services
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<RoleService>(TYPES.RoleService).to(RoleService);
container.bind<ModuleService>(TYPES.ModuleService).to(ModuleService);

// Bind Controllers
container.bind<UserController>(UserController).toSelf();
container.bind<RoleController>(RoleController).toSelf();
container.bind<ModuleController>(ModuleController).toSelf();

//Bind Middelwear
container.bind<AuthMiddleware>(AuthMiddleware).toSelf();


export { container };
