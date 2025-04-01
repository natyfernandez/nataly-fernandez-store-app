import { Router } from 'express';

import { apiUserController } from './../controllers/api.users.controller.js';
import { validate, validateId } from '../middlewares/validate.middleware.js';
import { userDto } from './../dtos/user.dto.js';

export const apiUserRouter = Router()

apiUserRouter.get("/", apiUserController.getAllUsers)

apiUserRouter.post("/", validate(userDto), apiUserController.createUser)

apiUserRouter.put("/:id", validateId, apiUserController.updateUser)

apiUserRouter.delete("/:id", validateId, apiUserController.deleteUser)

apiUserRouter.post("/login", apiUserController.login)