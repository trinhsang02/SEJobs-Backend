import { Request, Response } from "express-serve-static-core";
import userService from "@/services/users.service";
import logger from "@/utils/logger";
import { CreateUserDto } from "@/dtos/user/CreateUser.dto";
import { CreateUserQueryParams } from "@/types/query-param";
import { BadRequestError, NotFoundError } from "@/utils/errors";

export async function getUsers(req: Request, res: Response) {
  const users = await userService.getAllUsers();

  res.status(200).json({
    success: true,
    data: users,
  });
}

export async function getUserById(req: Request, res: Response) {
  const id = req.params.id;

  // TODO: MAKE CUSTOM VALIDATE FUNC
  if (!id) {
    throw new BadRequestError({ message: 'Missing required param: id'});
  }

  const user = await userService.getUserById(id);
  if (!user) {
    throw new NotFoundError({ message: `User with ID ${id} not found` });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
}


// TODO: REMOVE TRY_CATCH THROW ERROR
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
