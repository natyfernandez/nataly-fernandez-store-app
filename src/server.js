import path from "path";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import Handlebars from "handlebars";
import session from 'express-session';
import MongoStore from "connect-mongo";
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

import { CONFIG } from "./config/config.js";
import { routes } from "./routes/index.routes.js";
import { __dirname } from "./dirname.js";
import { PERSISTENCE } from "./common/constants/persistence.js";
import { initializePassport } from "./config/passport.config.js";
import { mongodbProvider } from "./providers/mongodb.provider.js";

const app = express();

// Middleware
app.use(cors({}))
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(CONFIG.SECRET_KEY));
app.use(express.static(path.resolve(__dirname, "../public")));

// Session config
app.use(session({
    secret: CONFIG.SECRET_KEY,
    store: MongoStore.create({
        mongoUrl: CONFIG.MONGO_URI,
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
app.use("/", routes);

// Connect to MongoDB
if (CONFIG.PERSISTENCE === PERSISTENCE.MONGODB) {
    mongodbProvider
        .connect(CONFIG.MONGO_URI)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((error) => {
            console.error("Error connecting to MongoDB", error);
        });    
}

app.listen(CONFIG.PORT, async () => {
    console.log(`Server running on http://localhost:${CONFIG.PORT}`);
});