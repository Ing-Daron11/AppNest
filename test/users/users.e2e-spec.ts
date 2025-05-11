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

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // LOGIN
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginCredentials);

    expect(res.status).toBe(201);
    token = res.body.token;

    const decoded: any = jwt.decode(token);
    user_id = decoded.user_id;
  });

  it('/users/me (GET) – debe retornar el perfil', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(user_id);
    expect(res.body.email).toBe(loginCredentials.email);
  });

  it('/users/:id (GET) – debe retornar el usuario por ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${user_id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(user_id);
    expect(res.body.email).toBe(loginCredentials.email);
  });

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

  afterAll(async () => {
    await app.close();
  });
});
