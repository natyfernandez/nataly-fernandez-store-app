import { cartService } from "../services/cart.service";

// Ejecutar limpieza de carritos cada 24 horas
export const startCartCleanupJob = () => {
    setInterval(() => {
        cartService.clearExpiredCarts();
    }, 24 * 60 * 60 * 1000); 
};
