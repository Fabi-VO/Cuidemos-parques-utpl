// Obtener elementos del modal
const modal = document.getElementById('modalRegistro');
const btnAbrir = document.getElementById('btnAbrirModal');
const btnCerrar = document.getElementById('cerrarModal');

// Abrir modal al hacer clic en el botón
btnAbrir.onclick = function() {
    modal.style.display = 'block';
}

// Cerrar modal al hacer clic en la X
btnCerrar.onclick = function() {
    modal.style.display = 'none';
    limpiarModal(); // Limpiar campos y mensajes al cerrar
}

// Cerrar modal si el usuario hace clic fuera de la ventana blanca
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        limpiarModal();
    }
}

// Función para limpiar el modal
function limpiarModal() {
    document.getElementById('nombres').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('email').value = '';
    document.getElementById('mensajeRegistro').innerHTML = '';
}


async function registrarUsuario() {
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensajeRegistro');

    if (!nombres || !apellidos || !email ) {
        mensaje.innerHTML = '❌ Todos los campos son obligatorios';
        mensaje.style.color = 'red';
        return;
    }

    mensaje.innerHTML = '📡 Registrando...';
    mensaje.style.color = 'blue';

    try {
        await fetch('https://script.google.com/macros/s/AKfycbx_RifyL-uUw7M3a9Sp8CyEF4jsTiFDQbkIPvtI7gMlX0LJ8HX6Am6xO73ltNko57VU/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombres, apellidos, email, fecha: new Date() })
        });
        mensaje.innerHTML = '✅ ¡Registro exitoso! Gracias por ser parte de este proyecto local.';
        mensaje.style.color = 'green';
        
        // Cerrar modal después de 1.5 segundos
        setTimeout(() => {
            modal.style.display = 'none';
            limpiarModal();
        }, 2000);
        
    } catch (error) {
        mensaje.innerHTML = '❌ Error al registrar. Intenta de nuevo.';
        mensaje.style.color = 'red';
    }
}

