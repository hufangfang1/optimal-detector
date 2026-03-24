/**
 * 检测器名称常量
 */
const PROBE_NAMES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * 计算检测 N 个目标单元所需的检测器数量
 * @param {number} n 目标单元总数
 * @returns {number} 检测器数量
 */
export function calcProbeCount(n) {
  if (n <= 1) return 0
  return Math.ceil(Math.log2(n))
}

/**
 * 生成检测方案：每个检测器需要覆盖哪些目标单元
 * @param {number} total 目标单元总数
 * @returns {Array} [{probeIndex, probeName, bottles: [1,3,5,...]}]
 */
export function generatePlan(total) {
  const probeCount = calcProbeCount(total)
  const plan = []

  for (let p = 0; p < probeCount; p++) {
    const bottles = []
    for (let bottle = 1; bottle <= total; bottle++) {
      if ((bottle >> p) & 1) {
        bottles.push(bottle)
      }
    }
    plan.push({
      probeIndex: p,
      probeName: '检测器' + PROBE_NAMES[p],
      bottles,
    })
  }

  return plan
}

/**
 * 根据触发结果定位异常单元
 * @param {Array<boolean>} deathResults 每个检测器是否触发，索引对应检测器序号
 * @param {number} total 目标单元总数
 * @returns {{ bottleNumber: number, steps: Array }}
 */
export function findPoisonBottle(deathResults, total) {
  const steps = []
  let bottleNumber = 0

  deathResults.forEach((isDead, index) => {
    const bit = isDead ? 1 : 0
    steps.push({
      probeName: '检测器' + PROBE_NAMES[index],
      isDead,
      bit,
      position: index,
      desc: isDead
        ? `检测器${PROBE_NAMES[index]} 触发 → 第 ${index} 位 = 1`
        : `检测器${PROBE_NAMES[index]} 未触发 → 第 ${index} 位 = 0`,
    })
    if (isDead) {
      bottleNumber |= (1 << index)
    }
  })

  if (bottleNumber === 0) {
    bottleNumber = total
  }

  const binaryStr = bottleNumber === total && deathResults.every(d => !d)
    ? '0'.repeat(deathResults.length)
    : bottleNumber.toString(2).padStart(deathResults.length, '0')

  return {
    bottleNumber,
    binaryStr,
    steps,
  }
}

/**
 * 生成所有目标单元的编码对照表
 * @param {number} total 目标单元总数
 * @returns {Array} [{bottle, binary, bits:[]}]
 */
export function generateCodeTable(total) {
  const probeCount = calcProbeCount(total)
  const maxCode = Math.pow(2, probeCount)
  const table = []

  for (let bottle = 1; bottle <= total; bottle++) {
    const bits = []

    for (let p = 0; p < probeCount; p++) {
      bits.push({
        probeName: PROBE_NAMES[p],
        value: (bottle >> p) & 1,
      })
    }

    const binary = bottle === maxCode
      ? '0'.repeat(probeCount)
      : bottle.toString(2).padStart(probeCount, '0')

    table.push({ bottle, binary, bits })
  }

  return table
}
