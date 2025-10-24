export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: "student" | "company" | "admin";
}
