import path from "path";
import morgan from "morgan";
import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { connect } from 'mongoose';
import Handlebars from "handlebars";
import session from 'express-session';
import MongoStore from "connect-mongo";
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

import { __dirname } from "./dirname.js";
import userRouter from './routes/users.routes.js';
import apiUserRouter from './routes/api.users.routes.js';
import { viewsRoutes } from "./routes/views.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { sessionRouter } from './routes/session.routes.js';
import { productRouter } from "./routes/product.routes.js";
import { initializePassport } from "./config/passport.config.js";
import { authenticate, generateToken, verifyToken } from "./utils/jwt.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 5000;

const mongoUrl = `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPassword}@backednaty.7sfpl.mongodb.net/`

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(express.static(path.resolve(__dirname, "../public")));

// Session config
app.use(session({
    secret: process.env.SECRET_KEY,
    store: MongoStore.create({
        mongoUrl,
    }),
    resave: false,
    saveUninitialized: false,
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Handlebars config
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "main",
        handlebars: allowInsecurePrototypeAccess(Handlebars),
    })
);
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "./views"));

// Routes
app.use("/", viewsRoutes);
app.use("/users", userRouter);
app.use("/carts", cartRouter);
app.use("/api/users", apiUserRouter);
app.use("/api/products", productRouter);
app.use("/api/sessions", sessionRouter);

// Vista de usuario actual
userRouter.get("/current", authenticate, (req, res) => {
    res.render("current", { user: req.user });
});

app.get("/admin", authenticate, (req, res) => {
    res.json({ message: 'Ruta de admin' });
});

app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Configuración de cookies
app.get("/cookies", (req, res) => {
    const token = jwt.sign(
        {
            id: "abcd",
            username: "test",
            role: "admin",
        },
        process.env.SECRET_KEY,
        { expiresIn: "5m" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 60,
    });

    res.json({ message: "Cookie set", token });
});

// Mongo Connection
connect(mongoUrl)
    .then(() => console.log("MongoDB conectado"))
    .catch((error) => console.error(error));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
