import { cartService } from "../services/cart.service.js";
import { userService } from "../services/user.service.js";
import { verifyToken } from "../utils/jwt.js";

class UserController {
    async login(req, res) {
        if (req.cookies.jwt) return res.redirect("/users/current");
        res.render("login");
    }

    async current(req, res) {
        try{
            const token = req.cookies.jwt;
            const decoded = verifyToken(token);

            let userData = await userService.getUserByEmail({ email: decoded.email });
            let cart = await cartService.getCartByUser({ user: decoded._id });

            if (!cart) {
                cart = await cartService.createCart({ user: decoded._id });
            }

            const cartQuantity = cart.products.length > 0
                ? cart.products.reduce((acc, item) => acc + item.quantity, 0)
                : 0;

            res.render("current", {
                isSession: true,
                cartUser: cart._id,
                cartQuantity,
                title: "Current",
                homeUrl: "/",
                user: userData
            });
        } catch(error){
            return res.status(500).json({
                message: "Error al ver el usuario actual",
                error: error.message
            });
        }
    }

    async logout(req, res) {
        res.clearCookie("jwt");
        res.redirect("/users/login");
    }
}

export const userController = new UserController();