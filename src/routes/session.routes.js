import { Router } from "express";
import { userModel } from '../models/user.model.js';

export const sessionRouter = Router()

sessionRouter.post('/login', async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y password requeridos' })
    }

    try {
        const user = await userModel.findOne({ email }).lean()
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

        if (user.password !== password) {
            return res.status(401).json({ message: 'Pasword inválido' })
        }

        req.session.user = {
            id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
        }

        const token = jwt.sign(
            {
                id: "1",
                email,
                role: "admin",
            },
            SECRET_KEY,
            { expiresIn: "5m" }
        );

        res.cookie("token", token, {
            maxAge: 60 * 60 * 60,
            httpOnly: true,
        });

        res.json({ message: "Login successful", token });
        res.redirect('/profile')
    } catch (error) {

        res.status(500).json({ message: 'Error interno', error })

    }

})

sessionRouter.post('/register', async (req, res) => {
    const { first_name, last_name, age, email, password } = req.body
    if (!first_name || !last_name || !age || !email || !password)
        return res.status(400).json({ message: 'Todos los campos son requeridos' })

    try {

        const user = await userModel.create({
            first_name,
            last_name,
            age,
            email,
            password
        })

        res.redirect('/login')


    } catch (error) {
        res.status(500).json({ message: 'Error interno', error })
    }


})

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})