// Queue System for Background Jobs
// ===============================

const EventEmitter = require('events')

class QueueSystem extends EventEmitter {
  constructor() {
    super()
    this.jobs = new Map()
    this.processing = new Map()
    this.failedJobs = []
    this.maxRetries = 3
    this.concurrency = 5
  }

  async addJob(jobName, data, options = {}) {
    const jobId = `${jobName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const job = {
      id: jobId, name: jobName, data,
      status: 'queued', attempts: 0, maxAttempts: options.maxRetries || this.maxRetries,
      delay: options.delay || 0, priority: options.priority || 'normal',
      createdAt: new Date(), startedAt: null, completedAt: null, failedAt: null, error: null
    }
    this.jobs.set(jobId, job)
    console.log(`[QUEUE] Job added: ${jobId} (${jobName})`)
    if (job.delay > 0) {
      setTimeout(() => this.processJob(jobId), job.delay)
    } else {
      this.processJob(jobId)
    }
    return jobId
  }

  async processJob(jobId) {
    const job = this.jobs.get(jobId)
    if (!job || job.status !== 'queued') return

    if (this.processing.size >= this.concurrency) {
      setTimeout(() => this.processJob(jobId), 1000)
      return
    }

    job.status = 'processing'
    job.startedAt = new Date()
    this.processing.set(jobId, job)

    try {
      const handler = this.getJobHandler(job.name)
      if (!handler) throw new Error(`No handler for job: ${job.name}`)
      await handler(job.data)
      job.status = 'completed'
      job.completedAt = new Date()
      this.processing.delete(jobId)
      console.log(`[QUEUE] Job completed: ${jobId}`)
      this.emit('job:completed', job)
    } catch (error) {
      job.attempts++
      job.error = error.message
      this.processing.delete(jobId)

      if (job.attempts < job.maxAttempts) {
        job.status = 'queued'
        const delay = Math.pow(2, job.attempts) * 1000
        setTimeout(() => this.processJob(jobId), delay)
        console.log(`[QUEUE] Job retry: ${jobId}, attempt ${job.attempts}`)
      } else {
        job.status = 'failed'
        job.failedAt = new Date()
        this.failedJobs.push(job)
        console.error(`[QUEUE] Job failed: ${jobId}`, error)
        this.emit('job:failed', job)
      }
    }
  }

  getJobHandler(jobName) {
    const handlers = {
      'send-email': async (data) => { console.log(`[EMAIL] Sending to: ${data.to}`) },
      'process-payment': async (data) => { console.log(`[PAYMENT] Processing: ${data.transactionId}`) },
      'generate-prize': async (data) => { console.log(`[PRIZE] Generating for user: ${data.userId}`) },
      'send-notification': async (data) => { console.log(`[NOTIF] Sending to user: ${data.userId}`) },
      'cleanup': async (data) => { console.log(`[CLEANUP] Running cleanup task`) }
    }
    return handlers[jobName]
  }

  getJob(jobId) { return this.jobs.get(jobId) }

  getStats() {
    return {
      queued: [...this.jobs.values()].filter(j => j.status === 'queued').length,
      processing: this.processing.size,
      completed: [...this.jobs.values()].filter(j => j.status === 'completed').length,
      failed: this.failedJobs.length,
      total: this.jobs.size
    }
  }

  getFailedJobs() { return this.failedJobs }

  async retryJob(jobId) {
    const job = this.failedJobs.find(j => j.id === jobId)
    if (!job) return null
    job.status = 'queued'
    job.attempts = 0
    job.error = null
    this.jobs.set(jobId, job)
    this.processJob(jobId)
    return jobId
  }

  cancelJob(jobId) {
    const job = this.jobs.get(jobId)
    if (!job || job.status === 'completed') return false
    job.status = 'cancelled'
    job.cancelledAt = new Date()
    return true
  }

  scheduleRecurring(jobName, data, interval) {
    return setInterval(() => { this.addJob(jobName, data) }, interval)
  }
}

module.exports = new QueueSystem()
