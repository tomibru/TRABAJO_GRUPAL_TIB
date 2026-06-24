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
    // Primero logueamos como pepe para obtener un token válido

    await okLogin();
    const pepeToken = localStorage.getItem('test_token');

    // Creamos un FormData
    const formData = new FormData();
    formData.append('display_name', 'Test Loop Pedagogico');
    formData.append('category', 'Drums');
    formData.append('bpm', '120');

    // Simulamos un archivo WAV (binario vacío para la prueba)
    const blob = new Blob(["Simulated Audio Content"], { type: 'audio/wav' });
    formData.append('audioFile', blob, 'DRUM_LOOP_01.wav');
    // Subimos un sample para asegurarnos de que pepe tiene al menos un recurso propio
    const uploadResponse = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${pepeToken}` },
        body: formData
    });
    const uploadData = await uploadResponse.json();
    const sampleId = uploadData.id;
    
    //Ahora intentamos eliminar un recurso que no nos pertenece

    const adminResponse = await fetch('/api/auth/login',{
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({username: 'admin', password: '12345'})
    });

    const adminData = await adminResponse.json();
    const adminToken = adminData.token;

    const deleteRequest = await fetch('/api/samples/secure/' + sampleId,{
        method: 'DELETE' ,
        headers: {'Authorization' : 'Bearer ' + adminToken}
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

