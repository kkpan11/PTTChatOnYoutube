import { Ptt } from './Ptt'
/**
 * @this {Ptt}
 * @typedef {{lock, taskList, addTask, next, reset}} PttTaskManager
 */
export function PttTaskManager () {
  return {
    taskList: [],
    addTask: (newTask, ...args) => {
      this.taskManager.taskList.push({ fn: newTask, args })
    },
    next: () => {
      if (this.taskManager.taskList.length > 0) {
        return this.taskManager.taskList.shift()
      }
      return null
    },
    reset: () => {
      this.taskManager.taskList = []
    }
  }
}
