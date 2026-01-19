import { Router } from "express";
import { signupController } from "../controllers/auth/signup.controller";
import { signinController } from "../controllers/auth/signin.controller";
import { resendVerification } from "../controllers/auth/resendVerification.controller";
import { verifyEmail } from "../controllers/auth/verifyEmail.controller";

const router = Router();

router.post("/signup", signupController);
router.post("/verification", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/signin", signinController);

export default router;