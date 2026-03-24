# Poison Detector UI 优化实现计划

> **Goal:** 将现有页面优化为蓝紫渐变毛玻璃风格

**Architecture:** 保持现有 Vue 3 + Element Plus 架构，通过 CSS 样式改造实现毛玻璃效果

**Tech Stack:** Vue 3, Element Plus, CSS3 (backdrop-filter, gradient)

---

## 文件结构

- Modify: `src/style.css` - 全局背景样式
- Modify: `src/App.vue` - 主布局卡片样式
- Modify: `src/components/PlanTable.vue` - 检测表格样式
- Modify: `src/components/ResultPanel.vue` - 结果面板样式

---

### Task 1: 全局背景与基础样式

**Files:**
- Modify: `src/style.css`
- Modify: `src/App.vue:167-179`

- [ ] **Step 1: 更新全局背景样式**

```css
/* src/style.css */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  background-attachment: fixed;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #e0e0e0;
}

/* 添加动态背景纹理 */
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
```

- [ ] **Step 2: 提交更改**

```bash
git add src/style.css
git commit -m "style: add glassmorphism background"
```

---

### Task 2: App.vue 主布局卡片毛玻璃化

**Files:**
- Modify: `src/App.vue:181-333`

- [ ] **Step 1: 更新卡片基础样式**

```css
/* .card 基础样式 */
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
```

- [ ] **Step 2: 更新 Header 样式**

```css
.app-header {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 50%, rgba(15, 52, 96, 0.95) 100%);
  padding: 28px 0;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}
```

- [ ] **Step 3: 更新按钮样式**

```css
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
```

- [ ] **Step 4: 更新 Footer 样式**

```css
.app-footer {
  text-align: center;
  padding: 20px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
```

- [ ] **Step 5: 提交更改**

```bash
git add src/App.vue
git commit -m "style: apply glassmorphism to App.vue"
```

---

### Task 3: PlanTable.vue 检测表格毛玻璃化

**Files:**
- Modify: `src/components/PlanTable.vue:103-151`

- [ ] **Step 1: 更新表格容器样式**

```css
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
}

:deep(.el-table--border .el-table__cell) {
  border-right: 1px solid rgba(255, 255, 255, 0.06) !important;
}
```

- [ ] **Step 2: 更新按钮样式**

```css
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
```

- [ ] **Step 3: 提交更改**

```bash
git add src/components/PlanTable.vue
git commit -m "style: apply glassmorphism to PlanTable"
```

---

### Task 4: ResultPanel.vue 结果面板毛玻璃化

**Files:**
- Modify: `src/components/ResultPanel.vue:148-392`

- [ ] **Step 1: 更新 Section 样式**

```css
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
```

- [ ] **Step 2: 更新标题样式**

```css
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 16px;
  padding-left: 10px;
  border-left: 4px solid;
  border-image: linear-gradient(180deg, #667eea, #764ba2) 1;
}
```

- [ ] **Step 3: 更新结果卡片样式**

```css
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
```

- [ ] **Step 4: 更新步骤项样式**

```css
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
```

- [ ] **Step 5: 更新目标单元网格样式**

```css
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
```

- [ ] **Step 6: 提交更改**

```bash
git add src/components/ResultPanel.vue
git commit -m "style: apply glassmorphism to ResultPanel"
```

---

### Task 5: 验证与测试

**Files:**
- N/A

- [ ] **Step 1: 运行开发服务器**

```bash
npm run dev
```

- [ ] **Step 2: 验证页面效果**

检查项:
- [ ] 背景是否呈现蓝紫渐变
- [ ] 卡片是否具有毛玻璃效果
- [ ] 按钮是否有渐变和发光效果
- [ ] 悬停是否有动效
- [ ] 原有功能是否正常

- [ ] **Step 3: 最终提交**

```bash
git add .
git commit -m "style: complete glassmorphism UI optimization"
```

---

## 执行完成

计划包含 5 个任务，共 17 个步骤。完成后页面将呈现蓝紫渐变毛玻璃风格。