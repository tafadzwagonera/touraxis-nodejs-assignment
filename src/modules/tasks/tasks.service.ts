import { EntityManager, EntityData, Loaded, FilterQuery } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { Task } from '../../entities/task.entity'

@Injectable()
export class TasksService {
  constructor(private readonly em: EntityManager) {}

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
    if ((Object.keys(where) ?? []).length)
      return await this.em.find(Task, where)

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
}
