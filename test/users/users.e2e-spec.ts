import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import * as jwt from 'jsonwebtoken';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let user_id: string;

  const loginCredentials = {
    email: 'daron@gmail.com',
    password: 'daron123',
  };

  const originalName = 'daron';
  const updatedName = 'NuevoNombre';

  // ========== LOGIN ==========
    /**
     * 0. Esto es un setup para iniciar sesión
     * y obtener el token JWT para las pruebas
     */
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginCredentials);

    expect(res.status).toBe(201);
    token = res.body.token;

    const decoded: any = jwt.decode(token);
    user_id = decoded.user_id;
  });
// |===============================|
// | _____ _____ ____ _____ ____   |
// | |_   _| ____/ ___|_   _/ ___| |
// |   | | |  _| \___ \ | | \___ \ |
// |   | | | |___ ___) || |  ___) ||
// |   |_| |_____|____/ |_| |____/ |
// |===============================|
                               
  /**
   * 1. Este test verifica que el token JWT 
   * se genere correctamente y contenga el ID de usuario
  */
  it('/users/me (GET) – debe retornar el perfil', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(user_id);
    expect(res.body.email).toBe(loginCredentials.email);
  });

  /**
   * 2. Este test verifica que el endpoint
   * /users/:id retorne el usuario por ID y sus credenciales
   * (email y nombre)
   */
  it('/users/:id (GET) – debe retornar el usuario por ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${user_id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(user_id);
    expect(res.body.email).toBe(loginCredentials.email);
  });

  /**
   * 3. Este test verifica que el endpoint
   * /users/:id aactualice el nombre del usuario
   * y retorne el usuario actualizado
   */
  it('/users/:id (PATCH) – actualizar nombre', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/users/${user_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: updatedName,
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(updatedName);
  });

  /**
   * 4. Este test verifica que el endpoint
   * /users/:id actualice el nombre del usuario al original
   * y retorne el usuario actualizado dejándolo como antes
   * (daron)
   */
  it('/users/:id (PATCH) – revertir nombre original', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/users/${user_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: originalName,
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(originalName);
  });

  /**
   * Y ya esta vuelta es para cerrar la sesión
   * y eliminar el token de la memoria
   */
  afterAll(async () => {
    await app.close();
  });
});
