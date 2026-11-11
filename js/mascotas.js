document.addEventListener('DOMContentLoaded', () => {
    const formMascota = document.getElementById('formMascota');
    const tablaMascotas = document.getElementById('tablaMascotas');
    const totalMascotas = document.getElementById('totalMascotas');
    const buscador = document.getElementById('buscador');
    const btnCancelar = document.getElementById('btnCancelar');

    let mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
    let editandoId = null;

    function renderizarTabla(datos) {
        tablaMascotas.innerHTML = '';
        if (datos.length === 0) {
            tablaMascotas.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No hay mascotas registradas.</td></tr>`;
            totalMascotas.textContent = 0;
            return;
        }

        datos.forEach((m, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${m.nombre}</td>
                <td>${m.duenio}</td>
                <td>${m.color}</td>
                <td>${m.edad}</td>
                <td>${m.peso}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarMascota(${index})">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="prepararEliminar(${index})">Eliminar</button>
                </td>
            `;
            tablaMascotas.appendChild(tr);
        });
        totalMascotas.textContent = datos.length;
    }

    formMascota.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombreMascota').value.trim();
        const duenio = document.getElementById('nombreDuenio').value.trim();
        const color = document.getElementById('color').value.trim();
        const edad = document.getElementById('edad').value;
        const peso = document.getElementById('peso').value;

        if (!nombre || !duenio || !color || !edad || !peso) {
            alert('Por favor complete todos los campos.');
            return;
        }

        const nuevaMascota = { nombre, duenio, color, edad, peso };

        if (editandoId !== null) {
            mascotas[editandoId] = nuevaMascota;
            editandoId = null;
            document.getElementById('tituloFormulario').textContent = "Registrar mascota";
            document.getElementById('btnGuardar').textContent = "Guardar";
            btnCancelar.classList.add('d-none');
        } else {
            mascotas.push(nuevaMascota);
        }

        localStorage.setItem('mascotas', JSON.stringify(mascotas));
        formMascota.reset();
        renderizarTabla(mascotas);
    });

    buscador.addEventListener('input', (e) => {
        const texto = e.target.value.toLowerCase();
        const filtradas = mascotas.filter(m => 
            m.nombre.toLowerCase().includes(texto) ||
            m.duenio.toLowerCase().includes(texto) ||
            m.color.toLowerCase().includes(texto)
        );
        renderizarTabla(filtradas);
    });

    window.editarMascota = (index) => {
        const m = mascotas[index];
        document.getElementById('nombreMascota').value = m.nombre;
        document.getElementById('nombreDuenio').value = m.duenio;
        document.getElementById('color').value = m.color;
        document.getElementById('edad').value = m.edad;
        document.getElementById('peso').value = m.peso;

        editandoId = index;
        document.getElementById('tituloFormulario').textContent = "Editar Mascota";
        document.getElementById('btnGuardar').textContent = "Actualizar";
        btnCancelar.classList.remove('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    btnCancelar.addEventListener('click', () => {
        formMascota.reset();
        editandoId = null;
        document.getElementById('tituloFormulario').textContent = "Registrar mascota";
        document.getElementById('btnGuardar').textContent = "Guardar";
        btnCancelar.classList.add('d-none');
    });

    let indexAEliminar = null;
    window.prepararEliminar = (index) => {
        indexAEliminar = index;
        const modal = new bootstrap.Modal(document.getElementById('modalEliminar'));
        modal.show();
    };

    document.getElementById('btnConfirmarEliminar').addEventListener('click', () => {
        if (indexAEliminar !== null) {
            mascotas.splice(indexAEliminar, 1);
            localStorage.setItem('mascotas', JSON.stringify(mascotas));
            renderizarTabla(mascotas);
            const modalEl = document.getElementById('modalEliminar');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            indexAEliminar = null;
        }
    });

    renderizarTabla(mascotas);
});