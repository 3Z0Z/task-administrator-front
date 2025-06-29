import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ProjectDTO } from '../../interfaces/projectDTO.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './project-card.component.html'
})
export class ProjectCardComponent {

  @Input({ required: true }) 
  public project: ProjectDTO = {} as ProjectDTO;

}
