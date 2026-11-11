document.addEventListener('DOMContentLoaded', () => {
    const formTurno = document.getElementById('formTurno');
    const tablaTurnos = document.getElementById('tablaTurnos');
    const totalTurnos = document.getElementById('totalTurnos');
    const buscador = document.getElementById('buscador');
    const btnCancelar = document.getElementById('btnCancelar');
    
    let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
    let editandoId = null;

    function renderizarTabla(datos) {
        tablaTurnos.innerHTML = '';
        if (datos.length === 0) {
            tablaTurnos.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No hay turnos registrados.</td></tr>`;
            totalTurnos.textContent = 0;
            return;
        }

        datos.forEach((t, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${t.mascota}</td>
                <td>${t.especie}</td>
                <td>${t.contacto}</td>
                <td>${t.motivo}</td>
                <td>${t.fecha}</td>
                <td>${t.horario}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarTurno(${index})">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="prepararEliminar(${index})">Eliminar</button>
                </td>
            `;
            tablaTurnos.appendChild(tr);
        });
        totalTurnos.textContent = datos.length;
    }

    formTurno.addEventListener('submit', (e) => {
        e.preventDefault();
        const mascota = document.getElementById('nombreMascota').value.trim();
        const especie = document.getElementById('especie').value;
        const contacto = document.getElementById('contactoDuenio').value.trim();
        const motivo = document.getElementById('motivoConsulta').value.trim();
        const fecha = document.getElementById('fechaTurno').value;
        const horario = document.querySelector('input[name="horarioPreferido"]:checked').value;

        if (!mascota || !especie || !contacto || !motivo || !fecha) {
            alert('Por favor complete todos los campos obligatorios.');
            return;
        }

        const nuevoTurno = { mascota, especie, contacto, motivo, fecha, horario };

        if (editandoId !== null) {
            turnos[editandoId] = nuevoTurno;
            editandoId = null;
            document.getElementById('tituloFormulario').textContent = "Solicitar turno";
            document.getElementById('btnGuardar').textContent = "Guardar Turno";
            btnCancelar.classList.add('d-none');
        } else {
            turnos.push(nuevoTurno);
        }

        localStorage.setItem('turnos', JSON.stringify(turnos));
        formTurno.reset();
        renderizarTabla(turnos);
    });

    buscador.addEventListener('input', (e) => {
        const texto = e.target.value.toLowerCase();
        const filtrados = turnos.filter(t => 
            t.mascota.toLowerCase().includes(texto) ||
            t.contacto.toLowerCase().includes(texto) ||
            t.motivo.toLowerCase().includes(texto)
        );
        renderizarTabla(filtrados);
    });

    window.editarTurno = (index) => {
        const t = turnos[index];
        document.getElementById('nombreMascota').value = t.mascota;
        document.getElementById('especie').value = t.especie;
        document.getElementById('contactoDuenio').value = t.contacto;
        document.getElementById('motivoConsulta').value = t.motivo;
        document.getElementById('fechaTurno').value = t.fecha;
        document.querySelector(`input[name="horarioPreferido"][value="${t.horario}"]`).checked = true;

        editandoId = index;
        document.getElementById('tituloFormulario').textContent = "Editar Turno";
        document.getElementById('btnGuardar').textContent = "Actualizar";
        btnCancelar.classList.remove('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    btnCancelar.addEventListener('click', () => {
        formTurno.reset();
        editandoId = null;
        document.getElementById('tituloFormulario').textContent = "Solicitar turno";
        document.getElementById('btnGuardar').textContent = "Guardar Turno";
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
            turnos.splice(indexAEliminar, 1);
            localStorage.setItem('turnos', JSON.stringify(turnos));
            renderizarTabla(turnos);
            const modalEl = document.getElementById('modalEliminar');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            indexAEliminar = null;
        }
    });

    renderizarTabla(turnos);
});