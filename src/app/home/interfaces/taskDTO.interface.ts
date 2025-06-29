export interface TaskDTO {
  id?: string;
  task_name: string;
  task_description: string;
  is_completed?: boolean;
  created_at?: Date;
}