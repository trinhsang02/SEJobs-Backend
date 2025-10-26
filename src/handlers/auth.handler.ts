import _ from "lodash";
import validate from "@/utils/validate";
import { Request, Response } from "express-serve-static-core";
import { loginSchema } from "@/dtos/user/Login.dto";
import UsersService from "@/services/users.service";
import { registerSchema } from "@/dtos/user/Register.dto";

export async function login(req: Request, res: Response) {
  const loginData = validate.schema_validate(loginSchema, req.body);

  const user = await UsersService.login({ loginData });

  // TODO: ADD JWT
  res.status(200).json({
    success: true,
    data: user,
  });
}

export async function register(req: Request, res: Response) {
  const registerData = validate.schema_validate(registerSchema, req.body);

  const user = await UsersService.register({ registerData });

  res.status(200).json({
    success: true,
    data: user,
  });
}