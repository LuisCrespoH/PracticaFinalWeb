const supertest = require('supertest');
const { app, server } = require('../app');
const mongoose = require('mongoose');
const usersModel = require('../models/users');

const api = supertest(app);

const newUser = {
  name: "Laura",
  email: "laura@correo.es",
  password: "supersegura123",
  code: "123456"
};

let token;

beforeAll(async () => {
  await new Promise((resolve) => mongoose.connection.once('connected', resolve));
  await usersModel.deleteMany({});

  // Registrar un usuario para poder probar el login
  await api.post('/api/auth/register')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

it('Debe registrar un nuevo usuario', async () => {
  const users = await usersModel.find({});
  expect(users).toHaveLength(1);
  expect(users[0].email).toBe(newUser.email);
});

it('Debe hacer login de un usuario correctamente', async () => {
  const loginData = {
    email: newUser.email,
    password: newUser.password
  };

  const response = await api.post('/api/auth/login')
    .send(loginData)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  // Verificar que se reciba un token
  expect(response.body).toHaveProperty('token');
  token = response.body.token; // Guardamos el token para usarlo en tests posteriores
  expect(typeof token).toBe('string');  // Verificamos que el token es una cadena de texto
});
it('No debe registrar un usuario con el mismo correo', async () => {

  // Intentamos registrar un segundo usuario con el mismo correo
  const response = await api.post('/api/auth/register')
    .send(newUser) // Intentamos registrar un usuario con el mismo correo
    .expect(409);  // Esperamos un conflicto

  // Verificamos que el mensaje esté en formato texto
  expect(response.text).toBe('EMAIL_ALREADY_REGISTERED'); // El mensaje debe estar como texto
  expect(response.headers['content-type']).toMatch(/text\/html/); // Esperamos tipo text/html
});
/*it('Debe validar el codigo de un usuario correctamente', async () => {
  const validation = {
    code: String(newUser.code) // asegúrate de que es string
  };

  const response = await api.post('/api/auth/validation')
    .set('Authorization', `Bearer ${token}`)
    .send(validation)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body).toHaveProperty('message', 'Código validado correctamente');
});
*/
it('Debe actualizar los datos personales del usuario autenticado', async () => {
  const updatedData = {
    name: "Laura Actualizada",
    email: "laura.actualizada@correo.es"
  };

  const response = await api.put('/api/auth/register') // Asumiendo ruta completa con prefijo
    .set('Authorization', `Bearer ${token}`) // Usa el token obtenido en el login
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  // Verifica la respuesta
  expect(response.body).toHaveProperty('name', updatedData.name);
  expect(response.body).toHaveProperty('email', updatedData.email);

  // Opcional: verifica en la base de datos también
  const userInDb = await usersModel.findOne({ email: updatedData.email });
  expect(userInDb).not.toBeNull();
  expect(userInDb.name).toBe(updatedData.name);
});


afterAll(async () => {
  server.close();
  await mongoose.connection.close();
});


