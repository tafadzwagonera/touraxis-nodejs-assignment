import { EntityManager, EntityData, Loaded, FilterQuery } from '@mikro-orm/core'
import { Injectable, Logger } from '@nestjs/common'
import { Status, Task } from '../../entities/task.entity'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class TasksService {
  constructor(
    private readonly em: EntityManager,
    private readonly logger: Logger,
  ) {}

  async create(tasks: Task[]): Promise<Loaded<Task>[]> {
    const persistedTasks = tasks.map((task: Task) =>
      this.em.create(Task, task, { persist: true }),
    )

    await this.em.flush()
    return persistedTasks
  }

  async delete(id: string) {
    await this.em.remove(this.em.getReference(Task, id)).flush()
  }

  async deleteMany(ids: string[]) {
    await Promise.all(
      ids.map((id) => this.em.remove(this.em.getReference(Task, id))),
    )

    await this.em.flush()
  }

  async find(where: FilterQuery<Task>): Promise<Loaded<Task>[]> {
    if (Object.keys(where ?? []).length) return await this.em.find(Task, where)
    return await this.em.find(Task, {})
  }

  async findOne(taskId: string, userId?: string): Promise<Task | null> {
    if (!userId) return await this.em.findOne(Task, { id: taskId })
    return this.em.findOne(Task, { id: taskId, user: userId })
  }

  async update(
    foundTask: Task,
    updatedTask: EntityData<Task>,
  ): Promise<Loaded<Task> | null> {
    foundTask.assign(updatedTask, {
      mergeObjectProperties: true,
    })

    await this.em.flush()
    return foundTask
  }

  @Cron('30 * * * * *', { name: 'update-pending-tasks' })
  async handleCron() {
    const forkedEm = this.em.fork()

    const pendingTasks = await forkedEm.find(Task, {
      status: Status.Pending,
    })

    const now = new Date()

    const tasksToUpdate = pendingTasks.filter((task: Task) => {
      const nextExecuteDateTime = new Date(task.next_execute_date_time)
      return now >= nextExecuteDateTime
    })

    if (tasksToUpdate.length) {
      this.logger.log(
        `Found (${tasksToUpdate.length}) pending tasks to update`,
        TasksService.name,
      )

      for (const taskToUpdate of tasksToUpdate) {
        taskToUpdate.status = Status.Done

        this.logger.log(
          `Task '${taskToUpdate.name}' marked as '${Status.Done}'`,
          TasksService.name,
        )
      }

      await forkedEm.flush()
      return
    }

    this.logger.log('No pending tasks found', TasksService.name)
  }
}
