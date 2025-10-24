import { Request, Response } from "express-serve-static-core";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import { CreateUserQueryParams } from "../types/query-param";
import userService from "../services/users.service";
import logger from "../utils/logger";

export async function getUsers(request: Request, response: Response) {
  try {
    logger.info("Getting all users");
    const users = await userService.getAllUsers();
    response.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    logger.error("Error in getUsers:", error);
    response.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch users",
    });
  }
}

export async function getUserById(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    return response.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  try {
    logger.info(`Getting user by ID: ${id}`);
    const user = await userService.getUserById(id);
    if (!user) {
      return response.status(404).json({
        success: false,
        message: `User with ID ${id} not found`,
      });
    }
    response.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error(`Error in getUserById: ${id}`, error);
    if (error instanceof Error && error.message.includes("not found")) {
      return response.status(404).json({
        success: false,
        message: error.message,
      });
    }
    response.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch user",
    });
  }
}

export async function createUser(request: Request<{}, {}, CreateUserDto, CreateUserQueryParams>, response: Response) {
  try {
    const userData = request.body;
    if (!userData.username || !userData.email || !userData.password || !userData.role) {
      return response.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    logger.info("Creating new user");
    const newUser = await userService.createUser(userData);
    response.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    logger.error("Error in createUser:", error);
    response.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create user",
    });
  }
}

export async function updateUser(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    return response.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  try {
    logger.info(`Updating user: ${id}`);
    const userData = request.body;
    const updatedUser = await userService.updateUser(id, userData);
    response.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    logger.error(`Error in updateUser: ${id}`, error);
    if (error instanceof Error && error.message.includes("not found")) {
      return response.status(404).json({
        success: false,
        message: error.message,
      });
    }
    response.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update user",
    });
  }
}

export async function deleteUser(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    return response.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  try {
    logger.info(`Deleting user: ${id}`);
    const deletedUser = await userService.deleteUser(id);
    response.status(200).json({
      success: true,
      data: deletedUser,
    });
  } catch (error) {
    logger.error(`Error in deleteUser: ${id}`, error);
    if (error instanceof Error && error.message.includes("not found")) {
      return response.status(404).json({
        success: false,
        message: error.message,
      });
    }
    response.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete user",
    });
  }
}
