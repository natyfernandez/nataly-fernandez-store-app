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
});
