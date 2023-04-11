require("dotenv").config();
const jwt = require("jsonwebtoken");
const { connectDB } = require("../../server");
const { User } = require("../../models/users");
const { app } = require("../../app");

const { DB_HOST } = process.env;
const loginRoute = "/users/login";

describe("login controller", () => {
  const validUser = { email: "test@mail.com", password: "Admin123" };
  let createdUser;

  beforeAll(async () => {
    await connectDB(DB_HOST);
    createdUser = await User.create(validUser);
  });

  afterAll(async () => {
    await User.findByIdAndDelete(createdUser._id);
  });

  describe("body validation", () => {
    describe("email validation", () => {
      it("return 401 unauthorized, if email is not provided", async () => {
        const invalidData = { password: "Admin123" };
        const res = await request(app).post(loginRoute).send(invalidData);

        expect(res.status).toEqual(422);
      });

      it("return 401 unauthorized, if email is not a valid email", async () => {
        const invalidData = { email: "testtest" };
        const res = await request(app).post(loginRoute).send(invalidData);

        expect(res.status).toEqual(422);
      });
    });

    describe("password validation", () => {
      it("return 401 unauthorized, if password is not provided", async () => {
        const invalidData = { email: "test@mail.com" };
        const res = await request(app).post(loginRoute).send(invalidData);

        expect(res.status).toEqual(422);
      });

      it("return 401 unauthorized, if password is not valid", async () => {
        // at least 8 char, one number, one uppercase letter
        const invalidData = { email: "test@mail.com", password: "admin" };
        const res = await request(app).post(loginRoute).send(invalidData);

        expect(res.status).toEqual(422);
      });
    });
  });

  describe("authentication", () => {
    it("return 401 if user with provided email does not exist", async () => {
      const invalidData = {
        email: "doesNotExist@mail.com",
        password: "Admin123",
      };
      const res = await request(app).post(loginRoute).send(invalidData);

      expect(res.status).toEqual(401);
    });

    it("return 401 if provided password is not correct", async () => {
      const invalidData = {
        email: createdUser.email,
        password: "AAAAdmin123123",
      };
      const res = await request(app).post(loginRoute).send(invalidData);

      expect(res.status).toEqual(401);
    });

    it("return 200, and token in response if credentials are correct", async () => {
      const res = await request(app)
        .post(loginRoute)
        .send({ email: validUser.email, password: validUser.password });

      expect(res.status).toEqual(200);
      expect(res.body.token).toBeTruthy();
    });
  });
});

// server.js

// const connectDB = (url) => {
//   return mongoose.connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// };

// (async () => {
//   await connectDB(DB_HOST);
//   console.log(`Database connection established successfully!`);

//   app.listen(PORT, () => {
//     console.log(`The server is up and running on http://localhost:${PORT}`);
//   });
// })();

// module.exports = { connectDB };
