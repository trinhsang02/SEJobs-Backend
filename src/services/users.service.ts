import _ from "lodash";
import * as bcrypt from "bcrypt";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import userRepository from "@/repositories/user.repository";
import { CreateUserDto } from "@/dtos/user/CreateUser.dto";
import { UpdateUserDto } from "@/dtos/user/UpdateUser.dto";
import { LoginDto } from "@/dtos/user/Login.dto";
import { Student, User, UserQueryParams } from "@/types/common";
import { RegisterDto } from "@/dtos/user/Register.dto";
import { generateToken } from "@/utils/jwt.util";
import companyRepository from "@/repositories/company.repository";
import studentRepository from "@/repositories/student.repository";

export class UserService {
  async login(input: { loginData: LoginDto }) {
    const { loginData } = input;

    const curUser = await userRepository.findOne({
      email: loginData.email,
      fields: userRepository.fields + ", password, is_active",
    });

    if (!curUser) {
      throw new BadRequestError({ message: `Invalid email or password` });
    }
    if (curUser.is_active === false) {
      throw new BadRequestError({ message: "Account is deactivated" });
    }

    const isValidPassword = await bcrypt.compare(loginData.password, curUser.password);

    if (!isValidPassword) {
      throw new BadRequestError({ message: `Invalid email or password` });
    }

    const { password, ...user } = curUser;

    const token = generateToken({
      userId: user.user_id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      token,
    };
  }

  async register(input: { registerData: RegisterDto }) {
    const { registerData } = input;

    if (registerData.password !== registerData.confirm_password) {
      throw new BadRequestError({ message: "Confirm password is not correct" });
    }

    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    const { email, first_name, last_name, role, company, student_info, confirm_password, ...rest } = registerData;

    const newUser = await userRepository.create({
      userData: {
        email,
        first_name,
        last_name,
        role,
        password: hashedPassword,
      },
    });

    if (newUser.role === "Employer") {
      if (!company) {
        throw new BadRequestError({ message: "Company profile is required for Employer accounts" });
      }

      const {
        name,
        logo,
        background,
        description,
        phone,
        email: companyEmail,
        website_url,
        images,
        tech_stack,
        employee_count,
      } = company;

      await companyRepository.create({
        companyData: {
          name,
          user_id: newUser.user_id,
          email: companyEmail || email,
          logo: logo ?? null,
          background: background ?? null,
          description: description ?? null,
          phone: phone ?? null,
          website_url: website_url ?? null,
          images: images ?? null,
          tech_stack: tech_stack ?? null,
          employee_count: employee_count ?? null,
          external_id: null,
        },
      });
    }

    if (newUser.role === "Student") {
      if (!student_info) {
        throw new BadRequestError({ message: "Student info is required for Student accounts" });
      }

      const { about, location, skills, open_for_opportunities } = student_info;

      await studentRepository.create({
        studentData: {
          user_id: newUser.user_id,
          about: about || null,
          location: location || null,
          open_for_opportunities: open_for_opportunities || null,
          skills: skills || null,
        },
      });
    }

    return newUser;
  }

  async findAll(input: UserQueryParams) {
    const { data: users, pagination } = await userRepository.findAll<User>(input);

    return {
      data: await this.joinData({ users: users }),
      pagination,
    };
  }

  async findOne(input: { userId: number }) {
    const { userId } = input;

    const user = await userRepository.findOne({ user_id: userId });
    if (!user) {
      throw new NotFoundError({ message: `User with ID ${userId} not found` });
    }

    const joinedUser = await this.joinData({ users: [user] });

    return joinedUser[0];
  }

  async joinData(input: { users: User[] }) {
    const { users } = input;

    const user_student_ids = users.filter((user) => user.role === "Student").map((user) => user.user_id);

    const { data: students } = await studentRepository.findAll<Student>({
      user_ids: user_student_ids,
    });

    const students_map = _.keyBy(students, "user_id");

    return users.map((user) => ({
      ...user,
      student_info: students_map[user.user_id] || null,
    }));
  }

  async createUser(input: { userData: CreateUserDto }) {
    const { userData } = input;
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await userRepository.create({
      userData: {
        ...userData,
        password: hashedPassword,
        avatar: _.get(userData, "avatar", null),
      },
    });

    return newUser;
  }

  async updateUser(input: { userId: number; userData: UpdateUserDto }) {
    const { userId, userData } = input;

    const existingUser = await this.findOne({ userId });
    if (!existingUser) {
      throw new NotFoundError({ message: `User with ID ${input.userId} not found` });
    }

    if (userData.email) {
      const userWithEmail = await userRepository.findOne({ email: userData.email });
      if (userWithEmail && userWithEmail.user_id !== userId) {
        throw new BadRequestError({ message: "Email already exists" });
      }
    }

    if (userData.updated_at && userData.updated_at !== existingUser.updated_at) {
      throw new BadRequestError({
        message: "Record was modified by another user. Please refresh and try again.",
      });
    }

    const updateData = _.pickBy(
      {
        avatar: userData.avatar ?? null,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        updated_at: new Date().toISOString(),
      },
      (value) => value !== undefined
    );

    const updatedUser = await userRepository.update({
      userId,
      userData: updateData,
    });

    if (userData.student_info && updatedUser?.role === "Student") {
      const { about, location, skills, open_for_opportunities } = userData.student_info;

      await studentRepository.update({
        userId,
        studentData: _.pickBy(
          {
            about: about || null,
            location: location || null,
            open_for_opportunities: open_for_opportunities || null,
            skills: skills || null,
          },
          (value) => value != null && value !== ""
        ),
      });
    }

    return updatedUser;
  }

  async deleteUser(userId: number) {
    const deletedUser = await userRepository.delete(userId);

    if (!deletedUser) {
      throw new NotFoundError({ message: `User with ID ${userId} not found` });
    }

    return deletedUser;
  }

  /**
   * Request password reset: generate token and expiry, persist on user.
   * Note: email delivery should be handled by caller using returned token.
   */
  async requestPasswordReset(input: { email: string }) {
    const { email } = input;
    const user = await userRepository.findOne({
      email,
      fields: userRepository.fields + ", reset_token, reset_token_expires, is_active",
    });

    if (!user) {
      throw new NotFoundError({ message: "User not found" });
    }
    if ((user as any).is_active === false) {
      throw new BadRequestError({ message: "Account is deactivated" });
    }

    // Generate secure token and expiry (1 hour)
    const token = require("crypto").randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await userRepository.update({
      userId: user.user_id,
      userData: {
        // casting to any to allow new columns before Supabase types update
        ...({ reset_token: token, reset_token_expires: expires } as any),
        updated_at: new Date().toISOString(),
      } as any,
    });

    return { user_id: user.user_id, email: user.email, reset_token: token, reset_token_expires: expires };
  }

  /**
   * Reset password using token. Clears token fields after successful reset.
   */
  async resetPassword(input: { token: string; new_password: string }) {
    const { token, new_password } = input;

    // Find user by reset_token
    const { data: users } = await userRepository.findAll<User>({
      fields: userRepository.fields + ", reset_token, reset_token_expires, is_active",
    });
    const target = users.find((u) => (u as any).reset_token === token);

    if (!target) {
      throw new BadRequestError({ message: "Invalid reset token" });
    }
    if ((target as any).is_active === false) {
      throw new BadRequestError({ message: "Account is deactivated" });
    }

    const expiresAt = (target as any).reset_token_expires ? new Date((target as any).reset_token_expires).getTime() : 0;
    if (Date.now() > expiresAt) {
      throw new BadRequestError({ message: "Reset token expired" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await userRepository.update({
      userId: target.user_id,
      userData: {
        password: hashedPassword,
        ...({ reset_token: null, reset_token_expires: null } as any),
        updated_at: new Date().toISOString(),
      } as any,
    });

    return { success: true };
  }
}

export default new UserService();
