import express from 'express';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import { verifyPassword } from '../utils/password.utils.js';

const apiUserRouter= Router()

// Crear usuario
apiUserRouter.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    const user = await userModel.create(req.body);

    res.status(201).json({ message: "Usuario creado", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Leer usuarios
apiUserRouter.get("/", async (req, res) => {
  const users = await userModel.find({}, "-password"); 
  res.json(users);
});

// Actualizar usuario
apiUserRouter.put("/:id", async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar usuario
apiUserRouter.delete("/:id", async (req, res) => {

  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
    
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error.message
  });
  }

});

// Login
apiUserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).lean();

  if (!user ){
    return res.redirect("/users/login?error=Login falló!");
  }

  const isPasswordCorrect = await verifyPassword(password, user.password);

  if (!isPasswordCorrect ){
    return res.status(400).send({
      status: 'error',
      message: 'Password incorrecto'
  });
  }
  
    const token = jwt.sign({ id: user._id, role: user.role, email:user.email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    
    res.cookie("currentUser", token, { httpOnly: true, signed: true });
    res.redirect("/users/current");
});

export default apiUserRouter;
