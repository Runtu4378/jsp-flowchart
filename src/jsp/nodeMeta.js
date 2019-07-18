export default new Map([
  ['Start', {
    draggable: true,
    endpoint: [
      'TopCenter',
      'BottomCenter',
      'LeftMiddle',
      'RightMiddle'
    ],
    render: ({
      id,
      x = 0, y = 0,
      w = 60, h = 60,
      text = 'start'
    }) => {
      return `
      <div id="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;" class="flowchart-object flowchart-start">
        <div class="flowchart-inner">
          <svg width="${w}" height="${h}">
            <text text-anchor="middle" x="${w / 2}" y="${h / 2}" dominant-baseline="central">${text}</text>
          </svg>
        </div>
      </div>
      `
    }
  }],
  ['Task', {
    draggable: true,
    endpoint: [
      'TopCenter',
      'BottomCenter',
      'LeftMiddle',
      'RightMiddle'
    ],
    render: ({
      id,
      x = 0, y = 0,
      w = 140, h = 60,
      text = 'task'
    }) => {
      return `
      <div id="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;" class="flowchart-object flowchart-task">
        <div class="flowchart-inner">
          <svg width="${w}" height="${h}">
            <text text-anchor="middle" x="${w / 2}" y="${h / 2}" dominant-baseline="central">${text}</text>
          </svg>
        </div>
      </div>
      `
    }
  }]
])
