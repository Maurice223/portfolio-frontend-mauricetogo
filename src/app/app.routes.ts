
import { Routes } from '@angular/router';

import { HomeComponent } from './layouts/home/home';
import { LoginComponent } from './admin/auth/login/login';
import { AdminLayoutComponent } from './admin/layout/admin-layout/admin-layout';
import { DashboardComponent } from './admin/dashboard/dashboard/dashboard';
import { AdminProjectsComponent } from './admin/projects/projects/projects';
import { AdminSkillsComponent } from './admin/skills/skills/skills';
import { AdminExperiencesComponent } from './admin/experiences/experiences/experiences';
import { AdminEducationsComponent } from './admin/educations/educations/educations';
import { AdminMessagesComponent } from './admin/messages/messages/messages';

import { authGuard } from './services/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'admin/login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'projects',
        component: AdminProjectsComponent
      },
      {
        path: 'skills',
        component: AdminSkillsComponent
      },
      {
        path: 'experiences',
        component: AdminExperiencesComponent
      },
      {
        path: 'educations',
        component: AdminEducationsComponent
      },
      {
        path: 'messages',
        component: AdminMessagesComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
