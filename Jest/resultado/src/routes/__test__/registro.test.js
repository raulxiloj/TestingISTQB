const request = require('supertest');
const app = require('../../app');

it('Existe una ruta /api/users/signup de tipo POST', async () => {
    return request(app).
        post('/api/users/registro')
        .expect([201,400]);
}); 

it('Retorna un codigo 400 si no se le envian los parametros', async () => {
    const response = await request(app).post('/api/users/registro');
    expect(response.status).toEqual(400, {msg: 'No se reciben los parametros'});
}); 

it('Retorna un codigo 201 si se registra de manera exitosa', async () => {
    return request(app)
    .post('/api/users/registro')
    .send({
        nombre: 'Raul Xiloj',
        correo: 'raul@gmail.com',
        password: '123456'
    })
    .expect(201,{ msg: 'Usuario registrado con exito'});
});

it('No se permiten una contrasena de menos de 6 caracteres', async () => {
    return request(app)
    .post('/api/users/registro')
    .send({
        nombre: 'Raul Xiloj',
        correo: 'raul@gmail.com',
        password: '12345'
    })
    .expect(400,{msg: 'La contrasena debe de ser de 6 caracteres minimo'});
});

it('Retorna un codigo 400 si se trata de registrar un correo ya existente', async () => {
    await request(app)
    .post('/api/users/registro')
    .send({
        nombre: 'Raul Xiloj',
        correo: 'raul@gmail.com',
        password: '123456'
    })
    .expect(201);

    await request(app)
    .post('/api/users/registro')
    .send({
        nombre: 'Raul Xiloj',
        correo: 'raul@gmail.com',
        password: '123456'
    })
    .expect(400,{msg: 'Ya existe un usuario con ese correo'});
})