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