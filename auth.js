document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    const pathActual = window.location.pathname.split('/').pop();

    const paginasProtegidas = ['turnos.html', 'historiaclinica.html', 'mascotas.html', 'veterinarios.html'];
    if (paginasProtegidas.includes(pathActual) && !token) {
        window.location.href = 'login.html';
        return;
    }

    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav) {
        if (token) {
            navbarNav.innerHTML = `
                <li class="nav-item"><a class="nav-link text-white fw-bold" href="index.html">Inicio</a></li>
                <li class="nav-item"><a class="nav-link text-white fw-bold" href="institucional.html">Institucional</a></li>
                <li class="nav-item"><a class="nav-link text-white fw-bold" href="contacto.html">Contacto</a></li>
                <li class="nav-item"><a class="nav-link text-white fw-bold" href="mascotas.html">Mascotas</a></li>
                <li class="nav-item"><a class="nav-link text-white fw-bold" href="veterinarios.html">Veterinarios</a></li>
                <li class="nav-item"><a class="nav-link text-white fw-bold" href="turnos.html">Turnos</a></li>
                <li class="nav-item"><a class="nav-link text-white fw-bold" href="historiaclinica.html">Historia Clínica</a></li>
                <li class="nav-item"><button id="btnCerrarSesion" class="btn btn-outline-danger btn-sm ms-lg-3 mt-2 mt-lg-0">Cerrar Sesión</button></li>
            `;
            document.getElementById('btnCerrarSesion').addEventListener('click', () => {
                sessionStorage.clear();
                window.location.href = 'login.html';
            });
        } else {
            navbarNav.innerHTML = `
                <li class="nav-item"><a class="nav-link text-white fw-bold" href="index.html">Inicio</a></li>
                <li class="nav-item"><a class="nav-link text-white fw-bold" href="institucional.html">Institucional</a></li>
                <li class="nav-item"><a class="nav-link text-white fw-bold" href="contacto.html">Contacto</a></li>
                <li class="nav-item"><a class="nav-link text-white fw-bold" href="login.html">Iniciar Sesión</a></li>
            `;
        }
    }
});