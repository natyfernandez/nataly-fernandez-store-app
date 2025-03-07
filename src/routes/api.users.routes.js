import express from 'express';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import { verifyPassword } from '../utils/password.utils.js';

const router= Router()
const SECRET_KEY = 's3cr3t';

// Crear usuario
router.post("/", async (req, res) => {
  // const {password} = req.body
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
router.get("/", async (req, res) => {
  const users = await userModel.find({}, "-password"); 
  res.json(users);
});

// Actualizar usuario
router.put("/:id", async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // new true: Devuelve el documento actualizado.
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {

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
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).lean();

  if (!user ){
    return res.redirect("/users/login?error=Login falló!");
  }

  // ⛔⛔ HACEN ALUMNOS, CREAR CARPETA UTILS CON UTILS.JS Y FUNCION "verifyPassword"
  const isPasswordCorrect = await verifyPassword(password, user.password);

  if (!isPasswordCorrect ){
    return res.status(400).send({
      status: 'error',
      message: 'Password incorrecto'
  });
  }
  
    const token = jwt.sign({ id: user._id, role: user.role, email:user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    
    res.cookie("currentUser", token, { httpOnly: true, signed: true });
    res.redirect("/users/current");
  
});

export default router;
