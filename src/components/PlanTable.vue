<template>
  <div class="plan-table">
    <el-table :data="plan" border stripe class="probe-table">
      <el-table-column label="检测器" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="deathResults[row.probeIndex] ? 'danger' : 'success'" size="large" effect="dark">
            {{ row.probeName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="需覆盖的目标单元编号" min-width="300">
        <template #default="{ row }">
          <div class="bottle-tags">
            <el-tag
              v-for="b in row.bottles"
              :key="b"
              class="bottle-tag"
              size="small"
              type="info"
              effect="plain"
            >
              {{ b }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="覆盖单元数" width="100" align="center">
        <template #default="{ row }">
          <span class="count-badge">{{ row.bottles.length }}</span>
        </template>
      </el-table-column>

      <el-table-column label="检测结果" width="160" align="center">
        <template #default="{ row }">
          <div class="result-switch">
            <el-switch
              v-model="deathResults[row.probeIndex]"
              active-text="触发"
              inactive-text="未触发"
              active-color="#f56c6c"
              inactive-color="#67c23a"
              @change="onResultChange"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="action-bar">
      <el-button
        type="primary"
        size="large"
        :icon="Search"
        @click="$emit('detect')"
        class="detect-btn"
      >
        定位异常
      </el-button>
      <el-button size="large" @click="resetResults" :icon="Refresh" class="reset-btn">
        重置结果
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'

const props = defineProps({
  plan: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['detect', 'update:modelValue'])

const deathResults = ref([])

watch(
  () => props.plan,
  (newPlan) => {
    deathResults.value = new Array(newPlan.length).fill(false)
  },
  { immediate: true }
)

function onResultChange() {
  emit('update:modelValue', [...deathResults.value])
}

function resetResults() {
  deathResults.value = new Array(props.plan.length).fill(false)
  emit('update:modelValue', [...deathResults.value])
}

defineExpose({ deathResults })
</script>

<style scoped>
.plan-table {
  width: 100%;
}

.probe-table {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 表格行悬停效果 */
:deep(.el-table tr) {
  background: transparent !important;
  transition: all 0.3s ease;
}

:deep(.el-table tr:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-table th) {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
}

:deep(.el-table td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
  color: rgba(255, 255, 255, 0.85);
}

:deep(.el-table--border .el-table__cell) {
  border-right: 1px solid rgba(255, 255, 255, 0.06) !important;
}

.bottle-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px 0;
}

.bottle-tag {
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.85);
}

.count-badge {
  display: inline-block;
  background: rgba(102, 126, 234, 0.2);
  color: #a5b4fc;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13px;
}

.result-switch {
  display: flex;
  justify-content: center;
}

.action-bar {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.detect-btn {
  min-width: 140px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
  transition: all 0.3s ease;
}

.detect-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
}

.reset-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}
</style>
