document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que el formulario recargue la página

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('/api/sessions/login', {  // Asegúrate de que coincida con la ruta correcta
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = data.redirect;  // 🔹 Aquí se hace la redirección manual
        } else {
            alert(data.message); // Muestra el mensaje de error
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error de conexión con el servidor');
    }
});