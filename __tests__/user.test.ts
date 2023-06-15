import { mongoConnect } from "../src/domain/repositories/mongo-repository";
import mongoose from "mongoose";
import { appInstance } from "../src/index";
import request from "supertest";
import { IUserCreate, User, ROLE } from "../src/domain/entities/user.entity";
import { app } from "../src/server";

describe("User controller", () => {
  const adminUserMock: IUserCreate = {
    email: "admin@mail.com",
    password: "12345678",
    firstName: "SUPER",
    lastName: "ADMIN",
    children: [],
    role: ROLE.ADMIN,
  };

  const teacherUserMock: IUserCreate = {
    email: "teacher1@mail.com",
    password: "12345678",
    firstName: "Teacher",
    lastName: "Number 1",
    children: [],
    role: ROLE.TEACHER,
  };

  let adminToken: string;
  let teacherToken: string;
  let createdUserId: string;

  beforeAll(async () => {
    await mongoConnect();
    await User.collection.drop();
    await new User(adminUserMock).save();
    await new User(teacherUserMock).save();
    console.log("Eliminados todos los usuarios");
  });

  afterAll(async () => {
    await mongoose.connection.close();
    appInstance.close();
  });

  it("POST /user/login", async () => {
    // WRONG LOGIN -> 401
    const wrongCredentials = { email: adminUserMock.email, password: "NOT VALID" };
    const wrongResponse = await request(app).post("/user/login").send(wrongCredentials).expect(401);
    expect(wrongResponse.body.token).toBeUndefined();

    // TEACHER LOGIN OK -> 200
    const teacherCredential = { email: teacherUserMock.email, password: teacherUserMock.password };
    const teacherResponse = await request(app).post("/user/login").send(teacherCredential).expect(200);
    expect(teacherResponse.body.token).toBeDefined();
    teacherToken = teacherResponse.body.token;

    // ADMIN LOGIN OK -> 200
    const adminCredentials = { email: adminUserMock.email, password: adminUserMock.password };
    const adminResponse = await request(app).post("/user/login").send(adminCredentials).expect(200);
    expect(adminResponse.body.token).toBeDefined();
    adminToken = adminResponse.body.token;
  });

  it("POST /user", async () => {
    const userToCreate = { ...teacherUserMock, email: "teacher2@mail.com" };

    // Not logged -> 401
    await request(app).post("/user").send(userToCreate).expect(401);

    // Logged with teacher -> 401
    await request(app).post("/user").set("Authorization", `Bearer ${teacherToken}`).send(userToCreate).expect(401);

    // Logged with admin -> 201
    const response = await request(app).post("/user").set("Authorization", `Bearer ${adminToken}`).send(userToCreate).expect(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.email).toBe(userToCreate.email);

    createdUserId = response.body._id;
  });

  it("GET /user", async () => {
    // Not logged -> 401
    await request(app).get("/user").expect(401);

    // Logged with teacher -> 200
    const teacherResponse = await request(app).get("/user").set("Authorization", `Bearer ${teacherToken}`).expect(200);
    expect(teacherResponse.body.data?.length).toBeDefined();

    // Logged with admin -> 200
    const adminResponse = await request(app).get("/user").set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.data?.length).toBeDefined();
  });

  it("GET /user/:id", async () => {
    // Not logged -> 401
    await request(app).get(`/user/${createdUserId}`).expect(401);

    // Logged with teacher -> 200
    const teacherResponse = await request(app).get(`/user/${createdUserId}`).set("Authorization", `Bearer ${teacherToken}`).expect(200);
    expect(teacherResponse.body.firstName).toBeDefined();

    // Logged with admin -> 200
    const adminResponse = await request(app).get(`/user/${createdUserId}`).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.firstName).toBeDefined();
  });

  it("PUT /user/id", async () => {
    const updatedData = { firstName: "MODIFIED" };

    // Not logged -> 401
    await request(app).put(`/user/${createdUserId}`).send(updatedData).expect(401);

    // Logged with teacher -> 401
    await request(app).put(`/user/${createdUserId}`).send(updatedData).set("Authorization", `Bearer ${teacherToken}`).expect(401);

    // Logged with admin -> 200
    const adminResponse = await request(app).put(`/user/${createdUserId}`).send(updatedData).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.firstName).toBe(updatedData.firstName);
  });

  it("DELETE /user/id", async () => {
    // Not logged -> 401
    await request(app).delete(`/user/${createdUserId}`).expect(401);

    // Logged with teacher -> 401
    await request(app).delete(`/user/${createdUserId}`).set("Authorization", `Bearer ${teacherToken}`).expect(401);

    // Logged with admin -> 200
    const adminResponse = await request(app).delete(`/user/${createdUserId}`).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body._id).toBe(createdUserId);
  });
});
