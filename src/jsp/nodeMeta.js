export default new Map([
  // 开始
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
      w = 40, h = 40,
      fontSize = 14,
      text = 'start'
    }) => {
      return `
      <div id="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;" class="flowchart-object flowchart-start">
        <div class="flowchart-inner">
          <svg width="${w}" height="${h + fontSize + 14}">
            <ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2}" ry="${h / 2}" fill="#444" stroke="#444" stroke-width="1" />
            <text text-anchor="middle" x="${w / 2}" y="${h + 14}" dominant-baseline="central" font-size="${fontSize}">${text}</text>
          </svg>
        </div>
      </div>
      `
    }
  }],
  // 结束
  ['End', {
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
      w = 40, h = 40,
      fontSize = 14,
      text = 'end'
    }) => {
      const centerRatio = 0.5
      return `
      <div id="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;" class="flowchart-object flowchart-end">
        <div class="flowchart-inner">
          <svg width="${w}" height="${h + fontSize + 14}">
            <ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2}" ry="${h / 2}" fill="#fff" stroke="#444" stroke-width="2" />
            <ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * centerRatio / 2}" ry="${h * centerRatio / 2}" fill="#444" stroke="#444" stroke-width="1" />
            <text text-anchor="middle" x="${w / 2}" y="${h + 14}" dominant-baseline="central" font-size="${fontSize}">${text}</text>
          </svg>
        </div>
      </div>
      `
    }
  }],
  // 任务
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
      fontSize = 14,
      text = 'task'
    }) => {
      return `
      <div id="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;" class="flowchart-object flowchart-task">
        <div class="flowchart-inner">
          <svg width="${w}" height="${h}">
            <polygon points="0,0 ${w},0 ${w},${h} 0,${h}" fill="#fff" stroke="#444" stroke-width="4" />
            <text text-anchor="middle" x="${w / 2}" y="${h / 2}" dominant-baseline="central" font-size="${fontSize}">${text}</text>
          </svg>
        </div>
      </div>
      `
    }
  }],
  // 判断
  ['Judge', {
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
      w = 120, h = 80,
      fontSize = 14,
      text = 'judge'
    }) => {
      return `
      <div id="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;" class="flowchart-object flowchart-judge">
        <div class="flowchart-inner">
          <svg width="${w}" height="${h}">
            <polygon points="${w / 2},0 ${w},${h / 2} ${w / 2},${h} 0,${h / 2}" fill="#fff" stroke="#444" stroke-width="2" />
            <text text-anchor="middle" x="${w / 2}" y="${h / 2}" dominant-baseline="central" font-size="${fontSize}">${text}</text>
          </svg>
        </div>
      </div>
      `
    }
  }]
])
