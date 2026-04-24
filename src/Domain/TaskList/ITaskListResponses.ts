// Modelos base
export interface ITaskListItem {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}
export interface ITaskItem {
  id: string
  taskListId: string
  content: string
  isCompleted: boolean
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

// TaskList responses
export interface IGetTaskListsResponse {
  taskLists: ITaskListItem[]
}
export interface IGetTaskListByIdResponse {
  taskList: ITaskListItem
}
export interface ICreateTaskListResponse {
  taskList: ITaskListItem
}
export interface IUpdateTaskListResponse {
  taskList: ITaskListItem
}
export interface IDeleteTaskListResponse {
  success: true
}

// Task responses
export interface IGetTasksByListResponse {
  tasks: ITaskItem[]
}
export interface IGetTaskByIdResponse {
  task: ITaskItem
}
export interface ICreateTaskResponse {
  task: ITaskItem
}
export interface IUpdateTaskResponse {
  task: ITaskItem
}
export interface IDeleteTaskResponse {
  success: true
}
export interface IToggleTaskResponse {
  success: true
}
