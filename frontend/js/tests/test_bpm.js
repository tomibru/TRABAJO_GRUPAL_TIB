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