/*const test = require("node:test");*/

/**
 * Test: POST /api/auth/login
 */
 testUtils.createTestButton("Test Login Correcto (Pepe y 12345)", async (btn) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '12345' }) // Usamos pepe hardcodeado
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.ok) {
        localStorage.setItem('token', data.token);
        testUtils.setSuccess(btn);
    }
});

testUtils.createTestButton("Test Login - Password Incorrecto (Pepe y 123)", async (btn) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '123' }) // Usamos pepe hardcodeado
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.status === 401) {
        testUtils.setSuccess(btn);
    }
});

testUtils.createTestButton("Test Login - Usuario Incorrecto (Juan y 12345)", async (btn) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '123' }) // Usamos pepe hardcodeado
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.status === 401) {
        testUtils.setSuccess(btn);
    }
});

testUtils.createTestButton("Eliminación de Recurso Ajeno", async(btn)=>{
    const response = await fetch('/api/auth/login',{
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({username: 'admin', password: '12345'})
    });

    const data = await response.json();
    const token = data.token;

    const deleteRequest = await fetch('/api/samples/secure/1',{
        method: 'DELETE' ,
        headers: {'Authorization' : 'Bearer ' + token}
    });

    if(deleteRequest.status == 403){
        testUtils.setSuccess(btn);
    }

    const deleteData = await deleteRequest.json();
    testUtils.log(deleteData);
});
testUtils.createTestButton("Test Registro - Contraseña Corta", async (btn) => {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '1' })
    });

    const data = await response.json();
    
    testUtils.log(data);

    if (response.status === 400) {
        testUtils.setSuccess(btn);
    } else {
        btn.className = "w3-button w3-block w3-section w3-round w3-red";
        testUtils.log({
            error: `Se esperaba HTTP 400 (Bad Request), pero el servidor respondió HTTP ${response.status}`,
            respuestaServidor: data
        }, true);
    }
});

// TEST #4 - Subida con tipo MIME inválido (debe responder 415)
testUtils.createTestButton("Test #4 - Archivo .wav falso (MIME inválido)", async (btn) => {

    const fakeContent = new Blob(['esto es texto, no audio'], { type: 'text/plain' });
    const fakeFile = new File([fakeContent], 'trampa.wav', { type: 'text/plain' });

    const token = localStorage.getItem('token');

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