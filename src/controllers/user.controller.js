import jwt from 'jsonwebtoken';

class UserController {
    async login(req, res) {
        if (req.cookies.jwt) return res.redirect("/users/current");
        res.render("login");
    }

    async current(req, res) {
        res.render("current", { user: req.user });
    }

    async logout(req, res) {
        res.clearCookie("jwt");
        res.redirect("/users/login");
    }
}

export const userController = new UserController();