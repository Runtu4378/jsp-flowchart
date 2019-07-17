const TemplateStart = `
<script type="jtk" id="tmplStart">
  <div style="left:\${left}px;top:${top}px;width:\${w}px;height:\${h}px;" class="flowchart-object flowchart-start">
    <div style="position:relative">
      <svg:svg width="\${w}" height="\${h}">
        <svg:ellipse cx="\${w/2}" cy="\${h/2}" rx="\${w/2}" ry="\${h/2}"></svg:ellipse>
        <svg:text text-anchor="middle" x="\${ w / 2 }" y="\${ h / 2 }" dominant-baseline="central">\${text}</svg:text>
      </svg:svg>
    </div>
    <jtk-source port-type="start" filter="svg *" filter-negate="true"></jtk-source>
  </div>
</script>
`

export default {
  name: 'fcTemplate',
  render (h) {
    return h('div', {
      domProps: {
        innerHTML: TemplateStart
      }
    }, '')
  }
}
