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
import { viewsRoutes } from "./routes/views.routes.js";
import { sessionRouter } from './routes/session.routes.js';
import { productRouter } from "./routes/product.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { productsModel } from "./models/products.model.js";
import { initializePassport } from "./config/passport.config.js";
import { error } from "console";

const app = express();
const PORT = 5000;
const SECRET_KEY='S3cr3t'

const mongoUser= 'natyayelenfernandez';
const mongoPassword= 'Naty191002.'
const mongoUrl= `mongodb+srv://${mongoUser}:${mongoPassword}@backednaty.7sfpl.mongodb.net/`

// Express configuration 
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

// Session config
app.use(session({
    secret: SECRET,
    store: MongoStore.create({
        mongoUrl,
        // ttl: 15
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
app.use("/products", viewsRoutes);
app.use("/api/products", productRouter);
app.use("/carts", cartRouter);
app.use("/api/sessions", sessionRouter);
app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use(express.static('public'));

// Mongo Connection
connect(mongoUrl)
    .then(() => console.log("MongoDB conectado"))
    .catch((error) => console.error(error));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})