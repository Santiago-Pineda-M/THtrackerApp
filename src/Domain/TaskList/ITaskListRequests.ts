// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGetTaskListsRequest {}
export interface IGetTaskListByIdRequest {
  id: string
}
export interface ICreateTaskListRequest {
  name: string
  description?: string
}
export interface IUpdateTaskListRequest {
  id: string
  name: string
  description?: string
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
  description?: string
  dueDate?: string
}
export interface IUpdateTaskRequest {
  id: string
  title: string
  description?: string
  dueDate?: string
}
export interface IDeleteTaskRequest {
  id: string
}
export interface IToggleTaskRequest {
  id: string
}
