import express from "express";
import {
  getUsers,
  login,
  logout,
  signup,
  updateUser,
} from "../controllers/user.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/update-user", authenticate, updateUser);
router.get("/users", authenticate, getUsers);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
