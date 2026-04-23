// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGetTaskListsRequest {}
export interface IGetTaskListByIdRequest {
  id: string
}
export interface ICreateTaskListRequest {
  name: string
  description?: string | null
}
export interface IUpdateTaskListRequest {
  id: string
  name: string
  description?: string | null
}
export interface IDeleteTaskListRequest {
  id: string
}
export interface IGetTasksByListRequest {
  taskListId: string
}
export interface IGetTaskByIdRequest {
  id: string
}
export interface ICreateTaskRequest {
  taskListId: string
  title: string
  description?: string | null
  dueDate?: string
}
export interface IUpdateTaskRequest {
  id: string
  taskListId: string
  title: string
  description?: string | null
  dueDate?: string
}
export interface IDeleteTaskRequest {
  id: string
  taskListId: string
}
export interface IToggleTaskRequest {
  id: string
}
