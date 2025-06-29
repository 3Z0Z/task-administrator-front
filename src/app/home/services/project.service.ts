import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProjectDTO } from '../interfaces/projectDTO.interface';
import { PageDTO } from '../interfaces/pageDTO.interface';

import { SuccessResponse } from '../../shared/interfaces/success-response.interface';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.back_end_url}/project`;

  public createProject(request: ProjectDTO): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(`${this.baseUrl}/create`, request, { withCredentials: true });
  }

  public getProjects(page: number, size: number): Observable<PageDTO<ProjectDTO>> {
    return this.http.get<PageDTO<ProjectDTO>>(`${this.baseUrl}/page?page=${page}&size=${size}`, { withCredentials: true });
  }

  public getProjectById(projectId: string): Observable<ProjectDTO> {
    return this.http.get<ProjectDTO>(`${this.baseUrl}/${projectId}`, { withCredentials: true });
  }

  public updateProject(projectId: string, request: ProjectDTO): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(`${this.baseUrl}/${projectId}`, request, { withCredentials: true });
  }

  public deleteProject(projectId: string): Observable<SuccessResponse> {
    return this.http.delete<SuccessResponse>(`${this.baseUrl}/${projectId}`, { withCredentials: true });
  }

}
