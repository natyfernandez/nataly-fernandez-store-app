import jwt from 'jsonwebtoken';
import { Router } from 'express';

const router = Router()
const SECRET_KEY = 's3cr3t';

const authenticate = (req, res, next) => {
  const token = req.signedCookies.currentUser;
  if (!token) return res.redirect("/users/login");

  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    res.redirect("/users/login");
  }
};

// Vista de login
router.get("/login", (req, res) => {
  if (req.signedCookies.currentUser) return res.redirect("/users/current");
  
  res.render("login");
});

// Vista de usuario actual
router.get("/current", authenticate, (req, res) => {
  res.render("current", { user: req.user });
});

router.get("/logout", (req, res) => {
    res.clearCookie("currentUser");
    res.redirect("/users/login");
  });
  

export default router;
