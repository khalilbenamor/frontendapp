// src/app/views/pages/page403/page403.component.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  ButtonDirective
} from '@coreui/angular';

@Component({
  selector: 'app-page403',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ContainerComponent,
    RowComponent,
    ColComponent,
    ButtonDirective
  ],
  template: `
    <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
      <c-container>
        <c-row class="justify-content-center">
          <c-col md="6" class="text-center">
            <div class="clearfix">
              <h1 class="display-1 fw-bold text-danger">403</h1>
              <h4 class="pt-3">Access Denied</h4>
              <p class="text-muted">
                You don't have permission to access this page.
              </p>
              <a routerLink="/tasks" cButton color="primary">
                Go to Tasks
              </a>
            </div>
          </c-col>
        </c-row>
      </c-container>
    </div>
  `
})
export class Page403Component {}