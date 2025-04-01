import { isValidObjectId } from "mongoose";
import { verifyPassword } from '../utils/password.utils.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { userService } from "../services/user.service.js";

class ApiUserController {
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const { first_name, last_name, age, email, password, cart, role } = req.body;

      if (!first_name || !last_name || !age || !email || !password || !cart || !role) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;

      const user = await userService.create({
        user: {
          first_name,
          last_name,
          age, email,
          password,
          cart,
          role
        },
      });

      res.status(201).json({ message: "Usuario creado", user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;

      const user = await userService.updateUser(id, req.body);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      await userService.deleteUser(id);
      res.json({ message: "Usuario eliminado" });

    } catch (error) {
      res.status(400).send({
        status: 'error',
        message: error.message
      });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail({ email });

    if (!user) {
      return res.redirect("/users/login?error=Login falló!");
    }

    const isPasswordCorrect = await verifyPassword(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).send({
        status: 'error',
        message: 'Password incorrecto'
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, CONFIG.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("currentUser", token, { httpOnly: true, signed: true });
    res.redirect("/users/current");
  }
}

export const apiUserController = new ApiUserController();
