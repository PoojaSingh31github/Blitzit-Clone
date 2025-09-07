export const boards = [
  {
    id: 'backlog',
    name: 'Backlog',
    tasks: [],
    scheduled: [], // Scheduled tasks (tasks which has `scheduleTime` property)
    recurring: [], // Only backlog board contains recurring managers (tasks which has `recurringType` property)
  },
  {
    id: 'this-week',
    name: 'This Week',
    tasks: [],
    scheduled: [], // Scheduled tasks (tasks which has `scheduleTime` property)
  },
  {
    id: 'today',
    name: 'Today',
    tasks: [],
    scheduled: [], // Scheduled tasks (tasks which has `scheduleTime` property)
  },
  {
    id: 'done',
    name: 'Done',
    tasks: [], // Only done tasks are present in done board so no scheduled tasks
  },
]
