import {
  ProductDao as ProductDaoMongo,
  UserDao as UserDaoMongo,
  CartDao as CartDaoMongo,
  TicketDao as TicketDaoMongo,
} from "./mongodb/index.js";

import {
  ProductDao as ProductDaoMemory,
  UserDao as UserDaoMemory,
  CartDao as CartDaoMemory,
  TicketDao as TicketDaoMemory,
} from "./memory/index.js";

import { CONFIG } from "../config/config.js";
import { PERSISTENCE } from "../common/constants/persistence.js";

// Patrón Factory
function getDaos({ persistence }) {
  switch (persistence) {
    case PERSISTENCE.MONGODB:
      return {
        productDao: new ProductDaoMongo(),
        userDao: new UserDaoMongo(),
        cartDao: new CartDaoMongo(),
        ticketDao: new TicketDaoMongo(),
      };

    case PERSISTENCE.MEMORY:
      return {
        productDao: new ProductDaoMemory(),
        userDao: new UserDaoMemory(),
        cartDao: new CartDaoMemory(),
        ticketDao: new TicketDaoMemory(),
      };

    default:
      return {
        productDao: new ProductDaoMemory(),
        userDao: new UserDaoMemory(),
        cartDao: new CartDaoMemory(),
        ticketDao: new TicketDaoMemory(),
      };
  }
}

export const { productDao, userDao, cartDao, ticketDao } = getDaos({
  persistence: CONFIG.PERSISTENCE,
});
