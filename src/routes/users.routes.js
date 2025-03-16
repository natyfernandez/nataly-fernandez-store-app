import jwt from 'jsonwebtoken';
import { Router } from 'express';

const userRouter = Router()

const authenticate = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.redirect("/users/login");

  try {
    req.user = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch {
    res.redirect("/users/login");
  }
};

// Vista de login
userRouter.get("/login", (req, res) => {
  if (req.cookies.jwt) return res.redirect("/users/current");
  
  res.render("login");
});

// Vista de usuario actual
userRouter.get("/current", authenticate, (req, res) => {
  res.render("current", { user: req.user });
});

userRouter.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/users/login");
  });
  

export default userRouter;
