document.addEventListener('DOMContentLoaded', function () {
  // Acceso
  const claveInput = document.getElementById("clave");
  const acceso = document.getElementById("acceso");
  const mensaje = document.getElementById("mensaje");

  window.validar = function () {
    const clave = claveInput.value.toUpperCase();
    if (clave === "ETHERE4LYFE") {
      acceso.style.display = "none";
    } else {
      mensaje.textContent = "Contraseña incorrecta.";
    }
  };

  // Productos
  const productos = Array.from(document.querySelectorAll('.producto')).map(productoEl => {
    const id = productoEl.dataset.productoId;
    const titulo = productoEl.querySelector('h2').textContent;
    const precio = productoEl.querySelectorAll('p')[0].textContent;
    const descripcion = productoEl.querySelectorAll('p')[1]?.textContent || '';
    const imagenes = Array.from(productoEl.querySelectorAll('.carrusel img')).map(img => img.getAttribute('src'));
    return { id, titulo, precio, descripcion, imagenes };
  });

  // Modal elementos
  const modal = document.getElementById('modalProducto');
  const cerrarModal = document.getElementById('cerrarModal');
  const imagenActiva = document.getElementById('imagenActiva');
  const tituloEl = document.getElementById('modalTitulo');
  const precioEl = document.getElementById('modalPrecio');
  const descripcionEl = document.getElementById('modalDescripcion');
  const relacionadosContenedor = document.getElementById('relacionadosContenedor');
  const btnAnterior = document.getElementById('btnAnterior');
  const btnSiguiente = document.getElementById('btnSiguiente');

  let productoActual = null;
  let imagenActualIndex = 0;

  // Mostrar modal
  function abrirModal(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    productoActual = producto;
    imagenActualIndex = 0;

    // Actualizar contenido
    actualizarModal();

    modal.classList.remove('oculto');
    document.body.style.overflow = 'hidden';
  }

  // Cerrar modal
  cerrarModal.addEventListener('click', () => {
    modal.classList.add('oculto');
    document.body.style.overflow = '';
  });

  // Navegar entre imágenes
  btnAnterior.addEventListener('click', () => {
    if (!productoActual) return;
    imagenActualIndex = (imagenActualIndex - 1 + productoActual.imagenes.length) % productoActual.imagenes.length;
    actualizarImagen();
  });

  btnSiguiente.addEventListener('click', () => {
    if (!productoActual) return;
    imagenActualIndex = (imagenActualIndex + 1) % productoActual.imagenes.length;
    actualizarImagen();
  });

  // Cargar datos al modal
  function actualizarModal() {
    if (!productoActual) return;

    // Imagen principal
    actualizarImagen();

    // Detalles
    tituloEl.textContent = productoActual.titulo;
    precioEl.textContent = productoActual.precio;
    descripcionEl.textContent = productoActual.descripcion;

    // Productos relacionados
    relacionadosContenedor.innerHTML = '';

    const relacionados = productos.filter(p => p.id !== productoActual.id).slice(0, 6); // Máx 6
    relacionados.forEach(rel => {
      const img = document.createElement('img');
      img.src = rel.imagenes[0];
      img.alt = rel.titulo;
      img.title = rel.titulo;
      img.addEventListener('click', () => abrirModal(rel.id));
      relacionadosContenedor.appendChild(img);
    });
  }

  function actualizarImagen() {
    if (productoActual && productoActual.imagenes.length > 0) {
      imagenActiva.src = productoActual.imagenes[imagenActualIndex];
    }
  }

  // Evento para cada producto
  document.querySelectorAll('.producto').forEach(producto => {
    producto.addEventListener('click', () => {
      const id = producto.dataset.productoId;
      abrirModal(id);
    });
  });
});
