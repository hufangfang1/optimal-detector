<template>
  <div class="result-panel">

    <!-- 推导过程 -->
    <div class="section derive-section">
      <h3 class="section-title">推导过程</h3>
      <div class="derive-steps">
        <div
          v-for="step in result.steps"
          :key="step.probeName"
          class="step-item"
          :class="{ dead: step.isDead, alive: !step.isDead }"
        >
          <div class="step-probe">
            <el-tag :type="step.isDead ? 'danger' : 'success'" effect="dark" size="small">
              {{ step.probeName }}
            </el-tag>
          </div>
          <div class="step-arrow">→</div>
          <div class="step-status">
            <span class="status-text" :class="{ dead: step.isDead }">
              {{ step.isDead ? '触发 ⚡' : '未触发 ✅' }}
            </span>
          </div>
          <div class="step-arrow">→</div>
          <div class="step-bit">
            <span class="bit-badge" :class="{ one: step.bit === 1, zero: step.bit === 0 }">
              第 {{ step.position }} 位 = {{ step.bit }}
            </span>
          </div>
        </div>
      </div>

      <!-- 二进制拼接过程 -->
      <div class="binary-compose">
        <div class="compose-label">拼接二进制（高位在左）：</div>
        <div class="binary-bits">
          <span
            v-for="(step, i) in [...result.steps].reverse()"
            :key="i"
            class="binary-bit"
            :class="{ one: step.bit === 1, zero: step.bit === 0 }"
          >
            {{ step.bit }}
          </span>
        </div>
        <div class="compose-eq">
          = <strong class="binary-str">{{ result.binaryStr }}</strong>（二进制）
          = <strong class="decimal-str">{{ result.bottleNumber }}</strong>（十进制）
        </div>
      </div>
    </div>

    <!-- 定位结果 -->
    <div class="section poison-result">
      <h3 class="section-title">定位结果</h3>
      <div class="result-card">
        <div class="result-icon">❗</div>
        <div class="result-text">
          <div class="result-label">异常单元编号</div>
          <div class="result-number">{{ result.bottleNumber }}</div>
        </div>
      </div>
    </div>

    <!-- 目标单元网格 -->
    <div class="section bottle-grid-section">
      <h3 class="section-title">目标单元总览</h3>
      <div class="bottle-grid">
        <div
          v-for="b in total"
          :key="b"
          class="bottle-item"
          :class="{ poison: b === result.bottleNumber }"
        >
          <div class="bottle-icon">{{ b === result.bottleNumber ? '❗' : '⬜' }}</div>
          <div class="bottle-num">{{ b }}</div>
        </div>
      </div>
    </div>

    <!-- 验证对照表 -->
    <div class="section verify-section">
      <el-collapse>
        <el-collapse-item title="展开查看：所有目标单元二进制编码对照表" name="verify">
          <el-table :data="codeTable" border size="small" class="code-table">
            <el-table-column label="单元编号" prop="bottle" width="90" align="center" />
            <el-table-column label="二进制编码" align="center" width="120">
              <template #default="{ row }">
                <code class="binary-code">{{ row.binary }}</code>
              </template>
            </el-table-column>
            <el-table-column
              v-for="bit in codeTable[0]?.bits"
              :key="bit.probeName"
              :label="`检测器${bit.probeName}`"
              align="center"
              width="80"
            >
              <template #default="{ row }">
                <span
                  class="bit-cell"
                  :class="{
                    'bit-one': row.bits.find(b => b.probeName === bit.probeName)?.value === 1,
                    'bit-zero': row.bits.find(b => b.probeName === bit.probeName)?.value === 0
                  }"
                >
                  {{ row.bits.find(b => b.probeName === bit.probeName)?.value }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="是否异常" align="center" width="90">
              <template #default="{ row }">
                <el-tag
                  :type="row.bottle === result.bottleNumber ? 'danger' : 'success'"
                  size="small"
                  effect="plain"
                >
                  {{ row.bottle === result.bottleNumber ? '异常 ❗' : '正常' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>

  </div>
</template>

<script setup>
defineProps({
  result: {
    type: Object,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  codeTable: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
.result-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 20px 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 16px;
  padding-left: 10px;
  border-left: 4px solid;
  border-image: linear-gradient(180deg, #667eea, #764ba2) 1;
}

/* 推导步骤 */
.derive-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.step-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.step-item.dead {
  background: rgba(245, 87, 108, 0.15);
  border-color: rgba(245, 87, 108, 0.3);
}

.step-item.alive {
  background: rgba(103, 194, 58, 0.12);
  border-color: rgba(103, 194, 58, 0.3);
}

.step-arrow {
  color: rgba(255, 255, 255, 0.4);
  font-size: 16px;
}

.status-text {
  font-size: 14px;
  color: #67c23a;
  font-weight: 600;
}

.status-text.dead {
  color: #f56c6c;
}

.bit-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.bit-badge.one {
  background: rgba(245, 87, 108, 0.15);
  color: #f56c6c;
  border: 1px solid rgba(245, 87, 108, 0.3);
}

.bit-badge.zero {
  background: rgba(103, 194, 58, 0.12);
  color: #67c23a;
  border: 1px solid rgba(103, 194, 58, 0.3);
}

/* 二进制拼接 */
.binary-compose {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.compose-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.binary-bits {
  display: flex;
  gap: 4px;
}

.binary-bit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 700;
  font-family: monospace;
}

.binary-bit.one {
  background: rgba(245, 87, 108, 0.15);
  color: #f56c6c;
  border: 2px solid rgba(245, 87, 108, 0.5);
}

.binary-bit.zero {
  background: rgba(103, 194, 58, 0.12);
  color: #67c23a;
  border: 2px solid rgba(103, 194, 58, 0.4);
}

.compose-eq {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.binary-str {
  color: #f093fb;
  font-family: monospace;
  font-size: 16px;
}

.decimal-str {
  color: #f56c6c;
  font-size: 18px;
}

/* 结果卡片 */
.result-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 28px;
  background: linear-gradient(135deg, rgba(245, 87, 108, 0.2) 0%, rgba(255, 150, 170, 0.1) 100%);
  border-radius: 16px;
  border: 2px solid rgba(245, 87, 108, 0.4);
  box-shadow:
    0 0 30px rgba(245, 87, 108, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow:
      0 0 20px rgba(245, 87, 108, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  to {
    box-shadow:
      0 0 40px rgba(245, 87, 108, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
}

.result-icon {
  font-size: 48px;
}

.result-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
}

.result-number {
  font-size: 48px;
  font-weight: 800;
  color: #f56c6c;
  line-height: 1;
}

/* 样品网格 */
.bottle-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.bottle-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid transparent;
  min-width: 56px;
  cursor: default;
  transition: all 0.3s ease;
}

.bottle-item:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.1);
}

.bottle-item.poison {
  background: rgba(245, 87, 108, 0.2);
  border-color: rgba(245, 87, 108, 0.5);
  box-shadow: 0 0 20px rgba(245, 87, 108, 0.4);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(245, 87, 108, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(245, 87, 108, 0.6);
  }
}

.bottle-icon {
  font-size: 22px;
  margin-bottom: 4px;
}

.bottle-num {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.bottle-item.poison .bottle-num {
  color: #f56c6c;
}

/* 对照表 */
.code-table {
  width: 100%;
}

.binary-code {
  font-family: monospace;
  font-size: 14px;
  font-weight: 700;
  color: #f093fb;
  background: rgba(240, 147, 251, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.bit-cell {
  font-weight: 700;
  font-size: 14px;
}

.bit-one {
  color: #f56c6c;
}

.bit-zero {
  color: rgba(255, 255, 255, 0.4);
}
</style>
