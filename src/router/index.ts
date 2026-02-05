import { createRouter, createWebHistory } from 'vue-router';

// Lazy load views for better initial bundle size
const HierarchyView = () => import('../views/HierarchyView.vue');
const TimeEntriesView = () => import('../views/TimeEntriesView.vue');
const TimeEntryForm = () => import('../views/TimeEntryForm.vue');
const NotFoundView = () => import('../views/NotFoundView.vue');

const routes = [
  {
    path: '/',
    name: 'hierarchy',
    component: HierarchyView,
  },
  {
    path: '/time-entries',
    name: 'time-entries',
    component: TimeEntriesView,
  },
  {
    path: '/time-entry/new',
    name: 'time-entry-new',
    component: TimeEntryForm,
  },
  {
    path: '/time-entry/:id/edit',
    name: 'time-entry-edit',
    component: TimeEntryForm,
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
