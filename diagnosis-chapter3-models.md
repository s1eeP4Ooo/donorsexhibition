# Chapter3 3D模型问题诊断

## 问题描述
第三单元两个建模文件在预览网页中出现bug：
1. 不能拖动旋转
2. 显示比例被修改
3. 重复出现

## 涉及文件
- [Chapter3.jsx](src/sections/Chapter3.jsx) - 第三单元主组件
- [ModelViewer.jsx](src/components/ModelViewer.jsx) - 3D模型查看器组件
- [Chapter3.module.css](src/sections/Chapter3.module.css) - 样式文件

## 问题分析

### 1. 显示比例问题

**原因**：
- 在 `ModelViewer.jsx` 第62-67行，模型缩放比例固定为 `3 / maxDim`
- CSS 中 canvas 被强制设置 `width: 100% !important; height: 100% !important;`
- 这可能导致 WebGL 渲染器的尺寸与 CSS 尺寸不一致

```javascript
// ModelViewer.jsx 第62-67行
const box = new THREE.Box3().setFromObject(model)
const size = box.getSize(new THREE.Vector3())
const maxDim = Math.max(size.x, size.y, size.z)
const scale = 3 / maxDim  // 固定比例可能不合适
model.scale.set(scale, scale, scale)
```

```css
/* Chapter3.module.css 第333-336行 */
.exhibit3Model canvas {
  width: 100% !important;
  height: 100% !important;
}
```

### 2. 不能拖动旋转

**可能原因**：
- 事件绑定正确，但可能存在 z-index 层级问题
- 可能有其他元素覆盖了 canvas，阻挡了鼠标事件
- `isDraggingRef` 状态可能在某些情况下没有正确重置

### 3. 重复出现

**可能原因**：
- React 组件可能被重复渲染
- 清理函数可能没有完全清理旧的 WebGL 上下文
- 同一模型路径可能被多次加载

## 修复建议

### 1. 修复显示比例
- 移除 CSS 中的 `!important` 强制设置
- 在 ModelViewer 中添加更智能的缩放逻辑
- 确保渲染器尺寸与容器尺寸同步

### 2. 修复拖动旋转
- 添加 z-index 确保 canvas 在最上层
- 检查是否有其他元素阻挡鼠标事件
- 添加拖拽状态调试日志

### 3. 防止重复出现
- 为每个 ModelViewer 实例添加唯一的 key
- 确保清理函数完全释放 WebGL 资源
- 添加组件挂载状态检查