export default {
  nodes: [
    {
      id: 'start_001',
      type: 'Start',
      text: '开始',
      x: 100,
      y: 0
    },
    {
      id: 'task_001',
      type: 'Task',
      text: 'task 001',
      x: 50,
      y: 160
    },
    {
      id: 'judge_001',
      type: 'Judge',
      text: '是否登录',
      x: 60,
      y: 320
    },
    {
      id: 'end_001',
      type: 'End',
      text: '结束',
      x: 100,
      y: 500
    }
  ],
  connections: [
    {
      // id: 1,
      source: {
        node: 'start_001',
        endpoint: 'start_001_source_BottomCenter'
      },
      target: {
        node: 'task_001',
        endpoint: 'task_001_target_TopCenter'
      },
      data: {
        label: 'connection 001'
      }
    },
    {
      // id: 2,
      source: {
        node: 'task_001',
        endpoint: 'task_001_source_BottomCenter'
      },
      target: {
        node: 'judge_001',
        endpoint: 'judge_001_target_TopCenter'
      },
      data: {
        label: 'connection 002'
      }
    },
    {
      // id: 3,
      source: {
        node: 'judge_001',
        endpoint: 'judge_001_source_BottomCenter'
      },
      target: {
        node: 'end_001',
        endpoint: 'end_001_target_TopCenter'
      },
      data: {
        label: 'Y'
      }
    }
  ]
}
