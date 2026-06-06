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

    // Validaciones
    if (!nombres || !apellidos || !email) {
        mensaje.innerHTML = '❌ Todos los campos son obligatorios';
        mensaje.style.color = 'red';
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mensaje.innerHTML = '❌ Correo inválido. Ejemplo: nombre@gmail.com';
        mensaje.style.color = 'red';
        return;
    }

    // 🔍 CAPTURAR DATOS DEL DISPOSITIVO (sin permisos)
    const userAgent = navigator.userAgent;
    const idioma = navigator.language;
    const resolucion = `${screen.width}x${screen.height}`;

    // Detectar SO y navegador (simplificado)
    let sistema = "Desconocido";
    let navegador = "Desconocido";

    if (userAgent.includes("Windows")) sistema = "Windows";
    else if (userAgent.includes("Mac")) sistema = "MacOS";
    else if (userAgent.includes("Linux")) sistema = "Linux";
    else if (userAgent.includes("Android")) sistema = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) sistema = "iOS";

    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) navegador = "Chrome";
    else if (userAgent.includes("Firefox")) navegador = "Firefox";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) navegador = "Safari";
    else if (userAgent.includes("Edg")) navegador = "Edge";

    mensaje.innerHTML = '📡 Registrando...';
    mensaje.style.color = 'blue';

    // 🌐 Obtener ubicación por IP (ciudad/país aproximado, sin permiso)
    let ciudad = "Desconocida";
    let pais = "Desconocido";
    
    try {
        const geoResponse = await fetch('https://ipapi.co/json/');
        const geoData = await geoResponse.json();
        ciudad = geoData.city || "Desconocida";
        pais = geoData.country_name || "Desconocido";
    } catch (e) {
        console.log("No se pudo obtener geolocalización por IP");
    }

    // 📍 FUNCIÓN PARA ENVIAR LOS DATOS A GOOGLE SHEETS
    async function enviarDatos(lat, lng) {
        try {
            await fetch('https://script.google.com/macros/s/AKfycbzhFK5nxQIcln3laIuGf58jjq_AqLukzz7AjenLarO3XTuWpk9Sbi4BrYMNX92d6V4C/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombres, apellidos, email,
                    fecha: new Date(),
                    sistema_operativo: sistema,
                    navegador: navegador,
                    idioma: idioma,
                    resolucion: resolucion,
                    ciudad: ciudad,
                    pais: pais,
                    latitud: lat || "No permitió",
                    longitud: lng || "No permitió",
                    user_agent: userAgent
                })
            });
            
            mensaje.innerHTML = '✅ ¡Registro exitoso! Gracias.';
            mensaje.style.color = 'green';
            
            setTimeout(() => {
                modal.style.display = 'none';
                limpiarModal();
            }, 2000);
            
        } catch (error) {
            console.error(error);
            mensaje.innerHTML = '❌ Error al registrar. Intenta de nuevo.';
            mensaje.style.color = 'red';
        }
    }

    // 📡 PEDIR UBICACIÓN EXACTA (GPS) - SOLO DESPUÉS DE LOS DATOS BÁSICOS
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (posicion) => {
                const lat = posicion.coords.latitude;
                const lng = posicion.coords.longitude;
                console.log(`📍 Ubicación exacta: ${lat}, ${lng}`);
                enviarDatos(lat, lng);
            },
            (error) => {
                console.log("Usuario no permitió la ubicación o error:", error.message);
                enviarDatos(null, null);  // Enviar sin ubicación exacta
            }
        );
    } else {
        console.log("Navegador no soporta geolocalización");
        enviarDatos(null, null);
    }
                    }

