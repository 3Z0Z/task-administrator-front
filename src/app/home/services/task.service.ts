import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TaskDTO } from '../interfaces/taskDTO.interface';
import { PageDTO } from '../interfaces/pageDTO.interface';

import { SuccessResponse } from '../../shared/interfaces/success-response.interface';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.back_end_url}/task`;

  public createTask(projectId: string, taskDto: TaskDTO): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(`${this.baseUrl}/${projectId}/create`, taskDto, { withCredentials: true });
  }

  public getTasks(projectId: string, page: number, size: number): Observable<PageDTO<TaskDTO>> {
    return this.http.get<PageDTO<TaskDTO>>(`${this.baseUrl}/${projectId}/page?page=${page}&size=${size}`, { withCredentials: true });
  }

  public getTaskById(projectId: string, taskId: string): Observable<TaskDTO> {
    return this.http.get<TaskDTO>(`${this.baseUrl}/${projectId}/${taskId}`, { withCredentials: true });
  }

  public updateTask(projectId: string, taskId: string, taskDto: TaskDTO): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(`${this.baseUrl}/${projectId}/${taskId}`, taskDto, { withCredentials: true });
  }

  public changeTaskStatus(projectId: string, taskId: string): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(`${this.baseUrl}/${projectId}/${taskId}/change-status`, null, { withCredentials: true });
  }

  public deleteTask(projectId: string, taskId: string): Observable<SuccessResponse> {
    return this.http.delete<SuccessResponse>(`${this.baseUrl}/${projectId}/${taskId}`, { withCredentials: true });
  }

}
