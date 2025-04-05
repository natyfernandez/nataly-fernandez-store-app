document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".delete-product-in-cart").forEach(form => {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const cartId = form.getAttribute("data-cart-id");
            const productId = form.getAttribute("data-product-id");

            try {
                const response = await fetch(`/carts/${cartId}/product/${productId}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    window.location.href = `/carts/${cartId}/`;
                } else {
                    const errorData = await response.text(); // Intentamos leerlo como texto
                    alert(`Error: ${errorData}`);
                }
            } catch (error) {
                alert("Hubo un problema al eliminar el producto.");
            }
        });
    });
    document.querySelectorAll(".buy-products").forEach(form => {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const cartId = form.getAttribute("data-cart-id");

            try {
                const response = await fetch(`/carts/${cartId}/purchase/`, {
                    method: "POST",
                });

                if (response.ok) {
                    window.location.href = `/carts/${cartId}/`;
                    const ticket = await response.text();
                    console.log(`Compra realizada!, ticket: ${ticket}`)
                } else {
                    const errorData = await response.text();
                    console.log(`Error: ${errorData}`);
                }
            } catch (error) {
                alert("Hubo un problema al finalizar la compra.");
            }
        });
    });
});
