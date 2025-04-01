import {
  ProductDao as ProductDaoMongo,
  UserDao as UserDaoMongo,
  CartDao as CartDaoMongo,
} from "./mongodb/index.js";

import {
  ProductDao as ProductDaoMemory,
  UserDao as UserDaoMemory,
  CartDao as CartDaoMemory,
} from "./memory/index.js";

import { CONFIG } from "../config/config.js";
import { PERSISTENCE } from "../common/constants/persistence.js";

// Patrón Factory
// Se crea una instancia de los DAOs según el tipo de persistencia
function getDaos({ persistence }) {
  switch (persistence) {
    case PERSISTENCE.MONGODB:
      return {
        productDao: new ProductDaoMongo(),
        userDao: new UserDaoMongo(),
        cartDao: new CartDaoMongo(),
      };

    case PERSISTENCE.MEMORY:
      return {
        productDao: new ProductDaoMemory(),
        userDao: new UserDaoMemory(),
        cartDao: new CartDaoMemory(),
      };

    default:
      return {
        productDao: new ProductDaoMemory(),
        userDao: new UserDaoMemory(),
        cartDao: new CartDaoMemory(),
      };
  }
}

export const { productDao, userDao, cartDao } = getDaos({
  persistence: CONFIG.PERSISTENCE,
});
