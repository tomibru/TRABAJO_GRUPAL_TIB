

/**
 * Función para asegurar independencia de los tests de samples 
 * y no depender de otro test para tener un token de sesión válido
 */
 async function okLogin()
 {
    // 1. Login como productor (pepe) para obtener un token válido
     const response = await fetch('/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ username: 'pepe', password: '12345' }) // Usamos pepe hardcodeado
     });
     const data = await response.json();
     // Guardamos el token para tests de samples
     localStorage.setItem('test_token', data.token);
 }

/**
 * Test: GET /api/samples/my-samples
 */
 testUtils.createTestButton("Test Listar Mis Samples", async (btn) => {
    // 1. Asegurar y guardar una sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');
    
    // 2. Realizar la petición
    const response = await fetch('/api/samples/my-samples', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    testUtils.log(data);
    if (response.ok) testUtils.setSuccess(btn);
});

/**
 * Test: POST /api/samples/upload (Simulado)
 */
testUtils.createTestButton("Test Subir Sample (Simulado)", async (btn) => {
    // 1. Asegurar y guardar una sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');
    
    // Creamos un FormData
    const formData = new FormData();
    formData.append('display_name', 'Test Loop Pedagogico');
    formData.append('category', 'Drums');
    formData.append('bpm', '120');

    // Simulamos un archivo WAV (binario vacío para la prueba)
    const blob = new Blob(["Simulated Audio Content"], { type: 'audio/wav' });
    formData.append('audioFile', blob, 'DRUM_LOOP_01.wav');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);
    if (response.ok) testUtils.setSuccess(btn);
});


// TEST #4 - Subida con tipo MIME inválido (debe responder 415)
testUtils.createTestButton("Test #4 - Archivo .wav falso (MIME inválido)", async (btn) => {

    await okLogin();
    const token = localStorage.getItem('test_token');

    const fakeContent = new Blob(['esto es texto, no audio'], { type: 'text/plain' });
    const fakeFile = new File([fakeContent], 'trampa.wav', { type: 'text/plain' });

    const formData = new FormData();
    formData.append('audioFile', fakeFile);
    formData.append('display_name', 'Test MIME');
    formData.append('category', 'Test');
    formData.append('bpm', '120');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    const data = await response.json();
    testUtils.log(data);

    if (response.status === 415) {
        testUtils.setSuccess(btn);
    }
});

//FACU

testUtils.createTestButton("Test Subida - Límite de Peso (HTTP 413)", async (btn) => {
    await okLogin();
    const token = localStorage.getItem('test_token');

    const bigBlob = new Blob([new Uint8Array(6 * 1024 * 1024)], { type: 'audio/wav' }); //Generamos archivo de peso mayor a 5 MB para la prueba

    const formData = new FormData(); //Genero la const con el archivo y sus atributos
    formData.append('display_name', 'Test Peso');
    formData.append('category', 'Drums');
    formData.append('bpm', '120');
    formData.append('audioFile', bigBlob, 'archivo_pesado.wav');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    }); //Le envio la const al servidor para q responda con el codigo HTTP y mensaje

    const data = await response.json();
    testUtils.log(data);

    if (response.status === 413 && data.message === "El archivo supera el limite de tamaño permitido.") {
        testUtils.setSuccess(btn);
    }//Si devuelve el codigo HTTP 413 y el mensaje que se toma arriba se considera el test como exitoso y se pone al boton verde
});


/**
 * Test: Validación de BPM inválido - Validación #6
 * Autor: ferrando_ignacio
 */

// Función para obtener un token válido (igual que en los otros tests)
async function okLogin() {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '12345' })
    });
    const data = await response.json();
    localStorage.setItem('test_token', data.token);
}

/**
 * Test: BPM con letras ("ciento veinte") → debe responder 400
 */
testUtils.createTestButton("Test BPM inválido - letras (ciento veinte)", async (btn) => {
    await okLogin();
    const token = localStorage.getItem('test_token');

    const formData = new FormData();
    formData.append('display_name', 'Test BPM Letras');
    formData.append('category', 'Kick');
    formData.append('bpm', 'ciento veinte'); // BPM inválido
    const blob = new Blob(["Simulated Audio Content"], { type: 'audio/wav' });
    formData.append('audioFile', blob, 'test.wav');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);
    if (response.status === 400) testUtils.setSuccess(btn);
});

/**
 * Test: BPM negativo (-15) → debe responder 400
 */
testUtils.createTestButton("Test BPM inválido - negativo (-15)", async (btn) => {
    await okLogin();
    const token = localStorage.getItem('test_token');

    const formData = new FormData();
    formData.append('display_name', 'Test BPM Negativo');
    formData.append('category', 'Kick');
    formData.append('bpm', '-15'); // BPM inválido
    const blob = new Blob(["Simulated Audio Content"], { type: 'audio/wav' });
    formData.append('audioFile', blob, 'test.wav');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);
    if (response.status === 400) testUtils.setSuccess(btn);
});

/**
 * Test: BPM válido (120) → debe responder 201 (éxito)
 */
testUtils.createTestButton("Test BPM válido (120) - debe subir OK", async (btn) => {
    await okLogin();
    const token = localStorage.getItem('test_token');

    const formData = new FormData();
    formData.append('display_name', 'Test BPM Correcto');
    formData.append('category', 'Kick');
    formData.append('bpm', '120'); // BPM válido
    const blob = new Blob(["Simulated Audio Content"], { type: 'audio/wav' });
    formData.append('audioFile', blob, 'test.wav');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);
    if (response.status === 201) testUtils.setSuccess(btn);
});