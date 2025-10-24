import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../handlers/users.handler";

const router = Router();

// GET /api/users - Get all users
router.get("/", getUsers);

// GET /api/users/:id - Get user by ID
router.get("/:id", getUserById);

// POST /api/users - Create new user
router.post("/", createUser);

// PUT /api/users/:id - Update user
router.put("/:id", updateUser);

// DELETE /api/users/:id - Delete user
router.delete("/:id", deleteUser);

export default router;
