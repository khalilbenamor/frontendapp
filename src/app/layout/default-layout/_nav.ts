// src/app/layout/default-layout/_nav.ts

import { INavData } from '@coreui/angular';

export const managerNav: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },
  {
    name: 'Attendance',
    url: '/attendance',
    iconComponent: { name: 'cil-clock' },
    badge: {
      color: 'info',
      text: 'Manager'
    }
  },
  {
    name: 'Tasks',
    iconComponent: { name: 'cil-task' },
    children: [
      {
        name: 'My Tasks',
        url: '/tasks'
      },
      {
        name: 'Manage Tasks',
        url: '/tasks/manage',
        badge: {
          color: 'primary',
          text: 'Manager'
        }
      }
    ]
  }
];

export const employeeNav: INavData[] = [
  {
    name: 'My Tasks',
    url: '/tasks',
    iconComponent: { name: 'cil-task' },
    badge: {
      color: 'primary',
      text: 'NEW'
    }
  }
];