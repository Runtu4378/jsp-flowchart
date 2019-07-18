export default {
  nodes: [
    {
      id: 'start_001',
      type: 'Start',
      text: '开始'
    },
    {
      id: 'task_001',
      type: 'Task',
      text: 'task 001',
      x: 80,
      y: 100
    },
    {
      id: 'judge_001',
      type: 'Judge',
      text: '是否登录',
      x: 120,
      y: 180
    },
    {
      id: 'end_001',
      type: 'End',
      text: '结束',
      x: 260,
      y: 180
    }
  ],
  edges: [
    {
      id: 1,
      label: 'connection 001',
      source: {
        node: 'start_001',
        endpoint: 'start_001_source_TopCenter'
      },
      target: {
        node: 'task_001',
        endpoint: 'task_001_target_TopCenter'
      }
    }
  ]
}
