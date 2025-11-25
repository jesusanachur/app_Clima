const API_BASE = 'http://localhost:3000';

// Cargar ciudades al iniciar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌤️ App del Clima iniciada');
    cargarCiudadesLocales();
});

// Manejar la tecla Enter en el input
function handleEnter(event) {
    if (event.key === 'Enter') {
        buscarClimaReal();
    }
}

// Mostrar/ocultar loading
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

// Mostrar/ocultar error
function showError(message) {
    const errorCard = document.getElementById('errorCard');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorCard.classList.remove('hidden');
    
    // Ocultar resultado si está visible
    document.getElementById('resultado').classList.add('hidden');
}

// Ocultar error
function hideError() {
    document.getElementById('errorCard').classList.add('hidden');
}

// Cargar ciudades locales desde la API
async function cargarCiudadesLocales() {
    try {
        console.log('Cargando ciudades locales...');
        const response = await fetch(`${API_BASE}/ciudades`);
        
        if (!response.ok) {
            throw new Error('Error al conectar con el servidor');
        }
        
        const data = await response.json();
        
        if (data.success) {
            mostrarCiudadesEnGrid(data.data);
        } else {
            throw new Error(data.message || 'Error en los datos');
        }
        
    } catch (error) {
        console.error('Error cargando ciudades:', error);
        showError('No se pudieron cargar las ciudades: ' + error.message);
    }
}

// Mostrar ciudades en el grid
function mostrarCiudadesEnGrid(ciudades) {
    const lista = document.getElementById('listaCiudades');
    
    if (ciudades.length === 0) {
        lista.innerHTML = '<p>No hay ciudades disponibles</p>';
        return;
    }
    
    lista.innerHTML = ciudades.map(ciudad => `
        <div class="ciudad-item" onclick="mostrarClimaLocal('${ciudad.ciudad}')">
            <strong>${ciudad.ciudad}</strong>
            <div>🌡 ${ciudad.temperatura}°C</div>
            <div>${ciudad.descripcion}</div>
        </div>
    `).join('');
}

// Buscar clima real (OpenWeatherMap)
async function buscarClimaReal() {
    const ciudadInput = document.getElementById('ciudadInput');
    const ciudad = ciudadInput.value.trim();
    
    if (!ciudad) {
        showError('Por favor ingresa el nombre de una ciudad');
        ciudadInput.focus();
        return;
    }
    
    await mostrarClimaReal(ciudad);
}

// Mostrar clima real desde la API
async function mostrarClimaReal(ciudad) {
    try {
        showLoading(true);
        hideError();
        
        console.log(`Buscando clima real para: ${ciudad}`);
        const response = await fetch(`${API_BASE}/clima-real/${encodeURIComponent(ciudad)}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            mostrarResultadoClimaReal(data.data);
        } else {
            throw new Error(data.message || 'Error en los datos del clima');
        }
        
    } catch (error) {
        console.error('Error obteniendo clima real:', error);
        showError('Error: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Mostrar resultado del clima real
function mostrarResultadoClimaReal(datos) {
    const resultado = document.getElementById('resultado');
    
    document.getElementById('ciudadNombre').textContent = `${datos.ciudad}, ${datos.pais}`;
    document.getElementById('temperatura').textContent = `${datos.temperatura}°C`;
    document.getElementById('descripcion').textContent = datos.descripcion;
    document.getElementById('humedad').textContent = `${datos.humedad}%`;
    document.getElementById('viento').textContent = `${datos.viento.velocidad} m/s`;
    document.getElementById('pais').textContent = datos.pais;
    document.getElementById('sensacion').textContent = `${datos.sensacion_termica}°C`;
    
    resultado.classList.remove('hidden');
    hideError();
}

// Mostrar clima local (datos de prueba)
async function mostrarClimaLocal(ciudad) {
    try {
        showLoading(true);
        hideError();
        
        console.log(`Buscando clima local para: ${ciudad}`);
        const response = await fetch(`${API_BASE}/clima/${encodeURIComponent(ciudad)}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            mostrarResultadoClimaLocal(data.data);
        } else {
            throw new Error(data.message || 'Ciudad no encontrada');
        }
        
    } catch (error) {
        console.error('Error obteniendo clima local:', error);
        showError('Error: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Mostrar resultado del clima local
function mostrarResultadoClimaLocal(datos) {
    const resultado = document.getElementById('resultado');
    
    document.getElementById('ciudadNombre').textContent = datos.ciudad;
    document.getElementById('temperatura').textContent = `${datos.temperatura}°C`;
    document.getElementById('descripcion').textContent = datos.descripcion;
    document.getElementById('humedad').textContent = '--';
    document.getElementById('viento').textContent = '--';
    document.getElementById('pais').textContent = '--';
    document.getElementById('sensacion').textContent = '--';
    
    resultado.classList.remove('hidden');
    hideError();
}