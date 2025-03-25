import { Router } from 'express';

import { apiUserController } from './../controllers/api.users.controller.js';

export const apiUserRouter = Router()

apiUserRouter.post("/", apiUserController.createUser)

apiUserRouter.get("/", apiUserController.getAllUsers)

apiUserRouter.put("/:id", apiUserController.updateUser)

apiUserRouter.delete("/:id", apiUserController.deleteUser)

apiUserRouter.post("/login", apiUserController.login)