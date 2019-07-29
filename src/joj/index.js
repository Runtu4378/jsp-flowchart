export default class Joj {
  /** 挂载dom的id */
  id = null

  /** 节点表 */
  nodes = new Map()
  /** 连接表 */
  connections = new Map()

  constructor ({
    id,
    value
  }) {
    this.id = id
  }
}
