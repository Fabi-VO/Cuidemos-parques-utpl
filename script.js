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



const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyP7DezW9WZ4mUId8v2GhoguFBglgN0g2dhUMgdreLRF-VgShh_0pucpI6ONrdTm_LI/exec";

/* =========================
   1. VISITA AUTOMÁTICA
========================= */

async function registrarUsuario() {

    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const email = document.getElementById('email').value.trim();

    const mensaje = document.getElementById('mensajeRegistro');

    if (!nombres || !apellidos || !email) {
        mensaje.innerHTML = "❌ Completa todos los campos";
        mensaje.style.color = "red";
        return;
    }

    const userAgent = navigator.userAgent;
    const idioma = navigator.language;

    // SO
    let sistema = "Desconocido";
    if (userAgent.includes("Windows")) sistema = "Windows";
    else if (userAgent.includes("Mac")) sistema = "MacOS";
    else if (userAgent.includes("Android")) sistema = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) sistema = "iOS";
    else if (userAgent.includes("Linux")) sistema = "Linux";

    // Navegador (MEJORADO)
    let navegador = "Desconocido";
    if (userAgent.includes("Edg")) navegador = "Edge";
    else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) navegador = "Chrome";
    else if (userAgent.includes("Firefox")) navegador = "Firefox";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) navegador = "Safari";

    let ciudad = "Desconocida";
    let pais = "Desconocido";

    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        ciudad = data.city || ciudad;
        pais = data.country_name || pais;
    } catch {}

    mensaje.innerHTML = "📡 Registrando...";
    mensaje.style.color = "blue";

    function enviar(lat = null, lng = null) {



        fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
        "Content-Type": "text/plain"
    },
    body: JSON.stringify({
        tipo: "registro",
        nombres,
        apellidos,
        email,
        sistema_operativo: sistema,
        navegador,
        idioma,
        ciudad,
        pais,
        latitud: lat,
        longitud: lng,
        user_agent: userAgent
    })
})
.then(() => {
    console.log("ENVIADO");
})
.catch(err => {
    console.error(err);
});



        

        mensaje.innerHTML = "✅ Registrado. Gracias por ser parte de este proyecto local";
        mensaje.style.color = "green";
    }

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                enviar(pos.coords.latitude, pos.coords.longitude);
            },
            () => {
                enviar();
            },
            {
                timeout: 8000
            }
        );

    } else {
        enviar();
    }
}




window.addEventListener("load", async () => {

  const userAgent = navigator.userAgent;
  const idioma = navigator.language;

  let sistema = "Desconocido";
  if (userAgent.includes("Windows")) sistema = "Windows";
  else if (userAgent.includes("Mac")) sistema = "MacOS";
  else if (userAgent.includes("Android")) sistema = "Android";
  else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) sistema = "iOS";
  else if (userAgent.includes("Linux")) sistema = "Linux";

  let navegador = "Desconocido";
  if (userAgent.includes("Edg")) navegador = "Edge";
  else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) navegador = "Chrome";
  else if (userAgent.includes("Firefox")) navegador = "Firefox";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) navegador = "Safari";

  let ciudad = "Desconocida";
  let pais = "Desconocido";

  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    ciudad = data.city || ciudad;
    pais = data.country_name || pais;
  } catch {}

  function enviarVisita(lat = null, lng = null) {
    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        tipo: "visita",   // 👈 ESTE ES EL CLAVE
        nombres: "",
        apellidos: "",
        email: "",
        sistema_operativo: sistema,
        navegador,
        idioma,
        ciudad,
        pais,
        latitud: lat,
        longitud: lng,
        user_agent: userAgent
      })
    });
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => enviarVisita(pos.coords.latitude, pos.coords.longitude),
      () => enviarVisita(),
      { timeout: 8000 }
    );
  } else {
    enviarVisita();
  }

});









