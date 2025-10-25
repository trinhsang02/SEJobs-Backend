export interface UpdateUserDto {
  username: string;
  email: string;
  password: string;
  role: "student" | "company" | "admin";
}
