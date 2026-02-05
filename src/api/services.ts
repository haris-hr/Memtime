import apiClient from './client';
import { ENDPOINTS } from '../config/api.config';
import type { Client, Project, Task, TimeEntry, TimeEntryPayload, PaginationParams } from '../types';

// Build query string from params
function buildQueryString(params?: PaginationParams): string {
  if (!params) return '';
  
  const searchParams = new URLSearchParams();
  if (params.limit !== undefined) searchParams.append('limit', String(params.limit));
  if (params.offset !== undefined) searchParams.append('offset', String(params.offset));
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.order) searchParams.append('order', params.order);
  
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

// Clients
export async function getClients(params?: PaginationParams): Promise<Client[]> {
  const response = await apiClient.get<Client[]>(`${ENDPOINTS.clients}${buildQueryString(params)}`);
  return response.data;
}

// Projects
export async function getClientProjects(clientId: number, params?: PaginationParams): Promise<Project[]> {
  const response = await apiClient.get<Project[]>(`${ENDPOINTS.clients}/${clientId}/projects${buildQueryString(params)}`);
  return response.data;
}

// Tasks
export async function getProjectTasks(projectId: number, params?: PaginationParams): Promise<Task[]> {
  const response = await apiClient.get<Task[]>(`${ENDPOINTS.projects}/${projectId}/tasks${buildQueryString(params)}`);
  return response.data;
}

// Time Entries
export async function getTimeEntries(params?: PaginationParams): Promise<TimeEntry[]> {
  const response = await apiClient.get<TimeEntry[]>(`${ENDPOINTS.timeEntries}${buildQueryString(params)}`);
  return response.data;
}

export async function getTimeEntry(id: number): Promise<TimeEntry> {
  const response = await apiClient.get<TimeEntry>(`${ENDPOINTS.timeEntries}/${id}`);
  return response.data;
}

export async function createTimeEntry(payload: TimeEntryPayload): Promise<TimeEntry> {
  const response = await apiClient.post<TimeEntry>(ENDPOINTS.timeEntries, payload);
  return response.data;
}

export async function updateTimeEntry(id: number, payload: TimeEntryPayload): Promise<TimeEntry> {
  const response = await apiClient.put<TimeEntry>(`${ENDPOINTS.timeEntries}/${id}`, payload);
  return response.data;
}

export async function deleteTimeEntry(id: number): Promise<void> {
  await apiClient.delete(`${ENDPOINTS.timeEntries}/${id}`);
}
