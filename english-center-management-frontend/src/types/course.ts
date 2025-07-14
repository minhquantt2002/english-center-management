export interface CourseCreate {
  course_name: string;
  description: string;
  level: string;
  price: number;
}

export interface CourseUpdate extends Partial<CourseCreate> {}

export interface CourseResponse extends CourseCreate {
  id: string;
  created_at: string;
}
