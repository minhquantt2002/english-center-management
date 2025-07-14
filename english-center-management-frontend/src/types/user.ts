export interface UserBase {
  name: string;
  email: string;
  role_name: string;
  bio: string | null;
  date_of_birth: string | null;
  phone_number: string | null;
  input_level: string | null;

  specialization: string | null;
  address: string | null;
  education: string | null;
  experience_years: number | null;

  level: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  student_id: string | null;
  status: string | null;
}

export interface UserCreate extends UserBase {
  password: string;
}

export interface UserUpdate extends UserBase {
  name: string | null;
  email: string | null;
  password: string | null;
  role_name: string | null;
  bio: string | null;
  date_of_birth: string | null;
  phone_number: string | null;
  input_level: string | null;

  specialization: string | null;
  address: string | null;
  education: string | null;
  experience_years: number | null;

  level: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  student_id: string | null;
  status: string | null;
}

export interface UserResponse extends UserBase {
  id: string;
  created_at: string;
}

export interface UserInDB extends UserBase {
  id: string;
  password: string;
  created_at: string;
}
