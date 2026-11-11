document.addEventListener('DOMContentLoaded', () => {
    const formHistoria = document.getElementById('formHistoria');
    const tablaHistorias = document.getElementById('tablaHistorias');
    const buscador = document.getElementById('buscador');
    const btnCancelar = document.getElementById('btnCancelar');

    let historias = JSON.parse(localStorage.getItem('historias_clinicas')) || [];
    let editandoId = null;

    function renderizarTabla(datos) {
        tablaHistorias.innerHTML = '';
        if (datos.length === 0) {
            tablaHistorias.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay historias clínicas registradas.</td></tr>`;
            return;
        }

        datos.forEach((h, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${h.mascota}</td>
                <td>${h.fecha}</td>
                <td>${h.servicio}</td>
                <td>${h.diagnostico}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarHistoria(${index})">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="prepararEliminar(${index})">Eliminar</button>
                </td>
            `;
            tablaHistorias.appendChild(tr);
        });
    }

    formHistoria.addEventListener('submit', (e) => {
        e.preventDefault();
        const mascota = document.getElementById('nombreMascota').value.trim();
        const fecha = document.getElementById('fechaIngreso').value;
        const servicio = document.getElementById('servicioBrindado').value;
        const diagnostico = document.getElementById('diagnostico').value.trim();

        if (!mascota || !fecha || !servicio || !diagnostico) {
            alert('Por favor complete todos los campos.');
            return;
        }

        const nuevaHistoria = { mascota, fecha, servicio, diagnostico };

        if (editandoId !== null) {
            historias[editandoId] = nuevaHistoria;
            editandoId = null;
            document.getElementById('tituloFormulario').textContent = "Nueva evolución / Historia clínica";
            document.getElementById('btnGuardar').textContent = "Guardar Historia";
            btnCancelar.classList.add('d-none');
        } else {
            historias.push(nuevaHistoria);
        }

        localStorage.setItem('historias_clinicas', JSON.stringify(historias));
        formHistoria.reset();
        renderizarTabla(historias);
    });

    buscador.addEventListener('input', (e) => {
        const texto = e.target.value.toLowerCase();
        const filtradas = historias.filter(h => 
            h.mascota.toLowerCase().includes(texto) ||
            h.servicio.toLowerCase().includes(texto) ||
            h.diagnostico.toLowerCase().includes(texto)
        );
        renderizarTabla(filtradas);
    });

    window.editarHistoria = (index) => {
        const h = historias[index];
        document.getElementById('nombreMascota').value = h.mascota;
        document.getElementById('fechaIngreso').value = h.fecha;
        document.getElementById('servicioBrindado').value = h.servicio;
        document.getElementById('diagnostico').value = h.diagnostico;

        editandoId = index;
        document.getElementById('tituloFormulario').textContent = "Editar Historia Clínica";
        document.getElementById('btnGuardar').textContent = "Actualizar";
        btnCancelar.classList.remove('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    btnCancelar.addEventListener('click', () => {
        formHistoria.reset();
        editandoId = null;
        document.getElementById('tituloFormulario').textContent = "Nueva evolución / Historia clínica";
        document.getElementById('btnGuardar').textContent = "Guardar Historia";
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
            historias.splice(indexAEliminar, 1);
            localStorage.setItem('historias_clinicas', JSON.stringify(historias));
            renderizarTabla(historias);
            const modalEl = document.getElementById('modalEliminar');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            indexAEliminar = null;
        }
    });

    renderizarTabla(historias);
});