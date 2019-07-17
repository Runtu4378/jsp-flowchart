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
        <div style="position:relative">
          <svg:svg width="${w}" height="${h}">
            <svg:ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2}" ry="${h / 2}"></svg:ellipse>
            <svg:text text-anchor="middle" x="${w / 2}" y="${h / 2}" dominant-baseline="central">${text}</svg:text>
          </svg:svg>
        </div>
        <jtk-source port-type="start" filter="svg *" filter-negate="true"></jtk-source>
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
        <div style="position:relative">
          <svg:svg width="${w}" height="${h}">
            <svg:ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2}" ry="${h / 2}"></svg:ellipse>
            <svg:text text-anchor="middle" x="${w / 2}" y="${h / 2}" dominant-baseline="central">${text}</svg:text>
          </svg:svg>
        </div>
        <jtk-source port-type="start" filter="svg *" filter-negate="true"></jtk-source>
      </div>
      `
    }
  }]
])
