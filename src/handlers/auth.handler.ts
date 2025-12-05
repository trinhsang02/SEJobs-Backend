import _ from "lodash";
import validate from "@/utils/validate";
import { Request, Response } from "express-serve-static-core";
import { loginSchema } from "@/dtos/user/Login.dto";
import UsersService from "@/services/users.service";
import { registerSchema } from "@/dtos/user/Register.dto";
import { generateRefreshToken, verifyToken, generateToken } from "@/utils/jwt.util";
import { forgotPasswordSchema, resetPasswordSchema } from "@/dtos/user/Password.dto";

export async function login(req: Request, res: Response) {
  const loginData = validate.schema_validate(loginSchema, req.body);

  const { user, token } = await UsersService.login({ loginData });

  const refreshToken = generateRefreshToken({ userId: user.user_id, email: user.email, role: user.role });

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: parseInt(process.env.JWT_EXPIRES_IN!, 10),
    path: "/",
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
  });
  const fullUser = await UsersService.findOne({ userId: user.user_id });
  return res.status(200).json({
    success: true,
    data: { user: fullUser },
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

export async function getMe(req: Request, res: Response) {
  const user = await UsersService.findOne({ userId: req.user!.userId });

  res.status(200).json({
    success: true,
    data: user,
  });
}
export async function logout(req: Request, res: Response) {
  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/" });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}
export async function refreshToken(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Refresh token missing" });
    }

    let payload;
    try {
      payload = verifyToken(refreshToken);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
    }
    const newAccessToken = generateToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });
    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: parseInt(process.env.JWT_EXPIRES_IN!, 10),
      path: "/",
    });

    return res.status(200).json({ success: true, message: "Token refreshed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function requestPasswordReset(req: Request, res: Response) {
  const { email } = validate.schema_validate(forgotPasswordSchema, req.body);

  const { reset_token, reset_token_expires } = await UsersService.requestPasswordReset({ email });

  res.status(200).json({
    success: true,
    data: { reset_token, reset_token_expires },
  });
}

export async function resetPassword(req: Request, res: Response) {
  const { token, new_password } = validate.schema_validate(resetPasswordSchema, req.body);
  await UsersService.resetPassword({ token, new_password });
  res.status(200).json({ success: true });
}
