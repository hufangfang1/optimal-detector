<template>
  <div class="app">
    <header class="app-header">
      <div class="header-content">
        <div class="logo">🔍</div>
        <div class="header-text">
          <h1>二进制编码异常定位工具</h1>
          <p>基于二进制编码，用最少的检测器一次定位异常目标单元</p>
        </div>
      </div>
    </header>

    <main class="main-content">

      <!-- 区域 1：输入 -->
      <section class="card input-section">
        <h2 class="card-title">
          <span class="step-num">1</span> 配置检测参数
        </h2>

        <div class="input-row">
          <div class="input-group">
            <label>目标单元总数</label>
            <el-input-number
              v-model="totalBottles"
              :min="2"
              :max="1024"
              :step="1"
              size="large"
              controls-position="right"
              @change="onTotalChange"
            />
          </div>

          <div class="info-group">
            <div class="info-item">
              <span class="info-label">所需检测器数</span>
              <span class="info-value highlight">{{ probeCount }} 个</span>
            </div>
            <div class="info-item">
              <span class="info-label">覆盖能力</span>
              <span class="info-value">最多 {{ Math.pow(2, probeCount) }} 个目标单元</span>
            </div>
            <div class="info-item">
              <span class="info-label">检测器编号</span>
              <span class="info-value">
                <el-tag
                  v-for="(_, i) in probeCount"
                  :key="i"
                  size="small"
                  type="primary"
                  effect="plain"
                  style="margin-right: 4px"
                >
                  检测器{{ 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i] }}
                </el-tag>
              </span>
            </div>
          </div>

          <el-button
            type="primary"
            size="large"
            :icon="Setting"
            @click="generatePlanData"
            class="generate-btn"
          >
            生成检测方案
          </el-button>
        </div>
      </section>

      <!-- 区域 2：检测方案 -->
      <section v-if="plan.length > 0" class="card plan-section">
        <h2 class="card-title">
          <span class="step-num">2</span> 检测方案
          <span class="card-subtitle">设置每个检测器的响应结果（触发 / 未触发）</span>
        </h2>

        <el-alert
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 16px"
        >
          <template #default>
            将每个检测器分配给对应目标单元，执行检测后切换开关状态，然后点击「定位异常」。
          </template>
        </el-alert>

        <PlanTable
          :plan="plan"
          v-model="deathResults"
          @detect="detect"
        />
      </section>

      <!-- 区域 3：结果 -->
      <section v-if="result" class="card result-section">
        <h2 class="card-title">
          <span class="step-num">3</span> 定位结果
          <el-tag type="danger" effect="dark" size="large" style="margin-left: 12px">
            异常单元：第 {{ result.bottleNumber }} 号
          </el-tag>
        </h2>

        <ResultPanel
          :result="result"
          :total="totalBottles"
          :codeTable="codeTable"
        />
      </section>

    </main>

    <footer class="app-footer">
      核心原理：N 个检测器代表二进制的 N 位，触发=1 未触发=0，触发结果拼成的二进制数即为异常单元编号
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PlanTable from './components/PlanTable.vue'
import ResultPanel from './components/ResultPanel.vue'
import { calcProbeCount, generatePlan, findPoisonBottle, generateCodeTable } from './utils/detector.js'

const totalBottles = ref(8)
const plan = ref([])
const deathResults = ref([])
const result = ref(null)
const codeTable = ref([])

const probeCount = computed(() => calcProbeCount(totalBottles.value))

function onTotalChange() {
  plan.value = []
  result.value = null
  deathResults.value = []
}

function generatePlanData() {
  plan.value = generatePlan(totalBottles.value)
  deathResults.value = new Array(probeCount.value).fill(false)
  codeTable.value = generateCodeTable(totalBottles.value)
  result.value = null
  ElMessage.success(`已生成方案：${totalBottles.value} 个目标单元，需 ${probeCount.value} 个检测器`)
}

function detect() {
  if (plan.value.length === 0) return
  result.value = findPoisonBottle(deathResults.value, totalBottles.value)
  ElMessage({
    message: `定位完成！第 ${result.value.bottleNumber} 号目标单元异常`,
    type: 'error',
    duration: 3000,
  })

  setTimeout(() => {
    document.querySelector('.result-section')?.scrollIntoView({ behavior: 'smooth' })
  }, 100)
}
</script>

<style>
/* 全局样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  background-attachment: fixed;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #e0e0e0;
}

/* 动态背景纹理 */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(120, 100, 255, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(255, 100, 150, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(100, 150, 255, 0.08) 0%, transparent 60%);
  pointer-events: none;
  z-index: -1;
}

/* Element Plus 深色模式覆盖 */
.el-input__wrapper {
  background-color: rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) inset !important;
}

.el-input__inner {
  color: #fff !important;
}

.el-input-number .el-input__wrapper {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.el-input-number .el-input__inner {
  color: #fff !important;
}

.el-switch.is-checked .el-switch__core {
  background-color: #f5576c !important;
  border-color: #f5576c !important;
}

.el-switch .el-switch__core {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.el-switch__label {
  color: rgba(255, 255, 255, 0.7) !important;
}

.el-switch__label--active {
  color: #fff !important;
}

.el-button {
  color: #fff !important;
}

.el-button--default {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
}

.el-button--default:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: #fff !important;
}

.el-alert {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.el-alert__title {
  color: rgba(255, 255, 255, 0.9) !important;
}

.el-collapse {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.el-collapse-item__header {
  background: rgba(255, 255, 255, 0.05) !important;
  color: rgba(255, 255, 255, 0.8) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.el-collapse-item__wrap {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.el-collapse-item__content {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Element Plus el-table 深色模式覆盖 */
.el-table {
  background-color: transparent !important;
  --el-table-bg-color: transparent !important;
  --el-table-tr-bg-color: transparent !important;
  --el-table-header-bg-color: rgba(255, 255, 255, 0.08) !important;
  --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.1) !important;
  --el-table-border-color: rgba(255, 255, 255, 0.1) !important;
  --el-table-text-color: rgba(255, 255, 255, 0.85) !important;
  --el-table-header-text-color: rgba(255, 255, 255, 0.9) !important;
}

.el-table__body-wrapper {
  background-color: transparent !important;
}

.el-table__body {
  background-color: transparent !important;
}

.el-table__row {
  background-color: transparent !important;
}

.el-table__row:hover > td {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.el-table td {
  background-color: transparent !important;
  border-bottom-color: rgba(255, 255, 255, 0.08) !important;
}

.el-table th {
  background-color: rgba(255, 255, 255, 0.08) !important;
  border-bottom-color: rgba(255, 255, 255, 0.1) !important;
}

.el-table--border .el-table__cell {
  border-right-color: rgba(255, 255, 255, 0.08) !important;
  border-bottom-color: rgba(255, 255, 255, 0.08) !important;
}

.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: rgba(255, 255, 255, 0.02) !important;
}

.el-table__empty-block {
  background-color: transparent !important;
}

.el-table {
  background: transparent !important;
  color: rgba(255, 255, 255, 0.85) !important;
}

.el-table--border .el-table__cell {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.el-tag {
  color: #fff !important;
}

.el-tag--success {
  background: rgba(103, 194, 58, 0.3) !important;
  border-color: rgba(103, 194, 58, 0.5) !important;
}

.el-tag--danger {
  background: rgba(245, 87, 108, 0.3) !important;
  border-color: rgba(245, 87, 108, 0.5) !important;
}

.el-tag--info {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 0.85) !important;
}

.el-tag--primary {
  background: rgba(102, 126, 234, 0.3) !important;
  border-color: rgba(102, 126, 234, 0.5) !important;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 50%, rgba(15, 52, 96, 0.95) 100%);
  padding: 28px 0;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.header-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  font-size: 52px;
}

.header-text h1 {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1px;
}

.header-text p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 4px;
}

.main-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 24px 28px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-subtitle {
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  margin-left: 4px;
}

.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 800;
  flex-shrink: 0;
}

.input-row {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 200px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  min-width: 86px;
}

.info-value {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.info-value.highlight {
  font-size: 22px;
  font-weight: 800;
  color: #409eff;
}

.generate-btn {
  align-self: flex-end;
  min-width: 140px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.app-footer {
  text-align: center;
  padding: 20px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
</style>
