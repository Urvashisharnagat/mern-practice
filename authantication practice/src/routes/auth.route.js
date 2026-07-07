import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register",authController.register)
authRouter.post("/login",authController.login)
authRouter.get("/get-me",authController.getme)
authRouter.get("/refreshtoken",authController.refreshtoken)
authRouter.get("/logout",authController.logout)
authRouter.get("/logout-all",authController.logoutall)
authRouter.get("/verify-email",authController.verifyemail)

export default authRouter;