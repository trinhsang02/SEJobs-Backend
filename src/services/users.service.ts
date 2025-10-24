import { CreateUserDto } from "../dtos/CreateUser.dto";
import userRepository from "../repositories/user.repository";
import { Database } from "../types/database";
import { NotFoundError } from "../utils/errors";

type UserUpdate = Partial<Database["public"]["Tables"]["users"]["Update"]>;

export class UserService {
  async getAllUsers() {
    try {
      const users = await userRepository.getAll();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData: CreateUserDto) {
    try {
      const newUser = await userRepository.create({
        name: userData.username,
        email: userData.email,
        password: userData.password, // In real app, hash this before saving
        role: userData.role,
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<CreateUserDto>) {
    try {
      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }

      const updateData: UserUpdate = {};

      if (userData.username) updateData.name = userData.username;
      if (userData.email) updateData.email = userData.email;
      if (userData.password) updateData.password = userData.password;
      if (userData.role) updateData.role = userData.role;

      const updatedUser = await userRepository.update(id, updateData);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }

      const deletedUser = await userRepository.delete(id);
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
