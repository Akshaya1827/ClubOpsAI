import {
  loginUser,
} from "./services/authService";

const testLogin =
  async () => {
    try {
      const result =
        await loginUser(
          "YOUR_EMAIL",
          "YOUR_PASSWORD"
        );

      console.log(
        "LOGIN SUCCESS:",
        result
      );
    } catch (error) {
      console.error(
        "LOGIN FAILED:",
        error.message
      );
    }
  };

testLogin();