import express, { Router } from "express";
import { LoginController } from "./adapters/http/auth/login.controller";
import { RegisterController } from "./adapters/http/auth/register.controller";
import { ProfileController } from "./adapters/http/user/profile.controller";
import { UpdateProfileController } from "./adapters/http/user/update-profile.controller";
import { DeleteUserController } from "./adapters/http/user/delete-user.controller";
import { RefreshTokenController } from "./adapters/http/auth/refresh-token.contoller";
import { LogoutController } from "./adapters/http/auth/logout.controller";
import { authenticateJWT } from "./adapters/middleware/auth.middleware";

const router = Router();

const loginController = new LoginController();
const registerController = new RegisterController();
const profileController = new ProfileController();
const updateProfileController = new UpdateProfileController();
const deleteUserController = new DeleteUserController();
const refreshTokenController = new RefreshTokenController();
const logoutController = new LogoutController();

const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/auth/login", asyncHandler(loginController.login.bind(loginController)));
router.post("/auth/register", asyncHandler(registerController.register.bind(registerController)));
router.post("/auth/refresh-token", asyncHandler(refreshTokenController.refreshToken.bind(refreshTokenController)));
router.post("/auth/logout", asyncHandler(logoutController.logout.bind(logoutController)));

router.get("/user/profile", authenticateJWT, asyncHandler(profileController.getProfile.bind(profileController)));
router.put("/user/update", authenticateJWT, asyncHandler(updateProfileController.update.bind(updateProfileController)));
router.delete("/user/delete", authenticateJWT, asyncHandler(deleteUserController.delete.bind(deleteUserController)));
export default router;
