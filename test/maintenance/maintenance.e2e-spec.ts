import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { v4 as uuidv4 } from 'uuid';

describe('Maintenance (e2e)', () => {
  let app: INestApplication;
  let server: any;

  let technicianToken: string;
  let userToken: string;
  let adminToken: string;

  let technicianId: string;
  let userId: string;
  let equipmentId: string;
  let maintenanceId: string;

  const baseUrl = '/';

  const uniqueEmail = (prefix: string) => `${prefix}-${uuidv4()}@e2e.com`;

  const createUser = async (name: string, email: string, password: string) => {
    const res = await request(server).post(`${baseUrl}auth/register`).send({
      name,
      email,
      password,
    });
    expect(res.status).toBe(201);
    return res.body;
  };

  const updateUserRole = async (userId: string, token: string, roles: string[]) => {
    const res = await request(server)
      .patch(`${baseUrl}auth/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ roles });
    expect(res.status).toBe(200);
  };

  const loginUser = async (email: string, password: string) => {
    const res = await request(server).post(`${baseUrl}auth/login`).send({
      email,
      password,
    });
    expect(res.status).toBe(201);
    return res.body.token;
  };

  const createEquipment = async (token: string) => {
    const res = await request(server)
      .post(`${baseUrl}equipment`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Equipo de prueba',
        model: 'Modelo Y',
        description: 'Equipo de laboratorio',
        category: 'electronic',
      });
    expect(res.status).toBe(201);
    return res.body.id;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer();

    // Login como admin
    adminToken = await loginUser('daron@gmail.com', 'daron123');

    // Crear técnico y usuario (con correos únicos)
    const techEmail = uniqueEmail('tech');
    const userEmail = uniqueEmail('user');

    const tech = await createUser('Tech Tester', techEmail, '123456');
    technicianId = tech.id;

    const user = await createUser('User Tester', userEmail, '123456');
    userId = user.id;

    // Asignar roles
    await updateUserRole(technicianId, adminToken, ['technical']);
    await updateUserRole(userId, adminToken, ['user']);

    // Login usuarios
    technicianToken = await loginUser(techEmail, '123456');
    userToken = await loginUser(userEmail, '123456');

    // Crear equipo
    equipmentId = await createEquipment(technicianToken);
  });

  it('debería crear un mantenimiento con técnico autorizado', async () => {
    const res = await request(server)
      .post(`${baseUrl}maintenance`)
      .set('Authorization', `Bearer ${technicianToken}`)
      .send({
        technicianId,
        equipmentId,
        description: 'Mantenimiento E2E test',
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.description).toBe('Mantenimiento E2E test');

    maintenanceId = res.body.id;
  });

  it('debería obtener el mantenimiento por ID', async () => {
    const res = await request(server)
      .get(`${baseUrl}maintenance/${maintenanceId}`)
      .set('Authorization', `Bearer ${technicianToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(maintenanceId);
  });

  it('debería actualizar la descripción del mantenimiento', async () => {
    const res = await request(server)
      .patch(`${baseUrl}maintenance/${maintenanceId}`)
      .set('Authorization', `Bearer ${technicianToken}`)
      .send({ description: 'Descripción actualizada' });

    expect(res.status).toBe(200);
    expect(res.body.description).toBe('Descripción actualizada');
  });

  it('no debería permitir a un usuario sin rol técnico crear mantenimiento', async () => {
    const res = await request(server)
      .post(`${baseUrl}maintenance`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        technicianId: userId,
        equipmentId,
        description: 'Mantenimiento inválido',
      });

    expect(res.status).toBe(403);
  });

  it('debería eliminar el mantenimiento', async () => {
    const res = await request(server)
      .delete(`${baseUrl}maintenance/${maintenanceId}`)
      .set('Authorization', `Bearer ${technicianToken}`);

    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    if (technicianId) {
      await request(server)
        .delete(`${baseUrl}auth/${technicianId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    }

    if (userId) {
      await request(server)
        .delete(`${baseUrl}auth/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    }

    if (equipmentId) {
      await request(server)
        .delete(`${baseUrl}equipment/${equipmentId}`)
        .set('Authorization', `Bearer ${technicianToken}`);
    }

    await app.close();
  });
});
