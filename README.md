# StanzSnap 📷

> 让每一个不会摆姿势不会构图的人，都能拍出有感染力的照片

StanzSnap 是一款专为摄影新手设计的智能相机应用，结合 AI 场景识别、实时构图指导、姿势参考、姿势检测与反馈，帮助用户在拍摄过程中获得即时的创意灵感。

![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-000)
![License](https://img.shields.io/badge/License-MIT-000)

## 核心功能

### 🧭 AI 构图指导
- **人脸定位**：实时检测人脸位置，对齐三分构图交叉点
- **身体角度**：识别正面/侧身/四分之三视角，引导调整体态
- **构图规则评分**：黄金螺旋、对称构图、留白构图、背景杂乱检测、三角布局
- **实时反馈**：浮动提示引导用户调整位置，直到达标

### 🤸 姿势检测与反馈
基于 MediaPipe Pose 检测，实时分析7个维度的姿势质量：

| 维度 | 检测内容 | 男女差异 |
|------|---------|---------|
| 头部倾斜 | 侧头、歪头（灵敏度 15°） | — |
| 头颈关系 | 颈部倾斜、下巴内缩、头部前探 | 下巴阈值不同 |
| 肩膀倾斜 | 角度、过斜提示 | — |
| 身体角度 | 正面/侧身/四分之三 | — |
| 手臂位置 | 手臂贴体、间距 | — |
| 手部位置 | 插口袋、托腮、插腰 | 插腰：男 positive，女提醒放下 |
| 重心分布 | 单脚承重、平衡感 | — |

**姿势评分 0–1**：综合加权得分，优先展示最需要改进的地方。

### 📸 相机功能
- **闪光灯**：常亮手电筒模式，暗光场景补光
- **变焦**：点击缩放倍数（1× / 2× / 3×）快速切换
- **HDR**：高动态范围，增强高光和阴影细节
- **曝光补偿 (EV)**：滑动滑块调整画面亮度
- **人像虚化**：点击光圈图标 → 点击主体 → 实时背景虚化
- **连拍**：快速连拍 3 或 5 张，适合运动场景
- **场景预设**：夜景 / 美食 / 人像 / 日落等 12 种预设，自动优化相机参数
- **AI 场景检测**：自动识别拍摄场景并推荐最佳设置
- **构图辅助**：三分法 / 黄金螺旋 / 对称 / 三角 / 对角线叠加参考线

### 🖼️ 相册编辑
拍摄后可在相册中对照片进行精细调整：
- **高光 / 阴影**：滑动滑块恢复过曝或欠曝区域的细节
- **虚化**：为人像添加景深效果，模拟大光圈拍摄
- **原片对比**：一键切换原片和编辑结果，直观对比效果
- **裁剪 / 旋转 / 翻转**：调整构图和方向后保存

### 🧍 姿势参考 (Poser)
在取景框上叠加金色轮廓参考图，帮助被拍者得到姿势灵感：

- **打开方式**：点击底部 👤 按钮打开 PoserSheet
- **筛选方式**：
  - **人数**：单人 / 双人 / 多人
  - **视角**：远景(D) / 全身(F) / 半身(H) / 特写(C) — 可多选
  - **标签**：兄弟 / 闺蜜 / 情侣 / 长辈 / 坐姿 / 栏杆 — 可多选
- **使用方式**：点击姿势图 → 叠加到取景框 → 相机自动调整变焦
- **清除方式**：再次点击 👤 按钮移除叠加
- **文件命名约定**：`{人数}-{视角}-{标签}(-{序号}).png`
  - 例：`1-full-sit-1.png` = 1人全身坐姿、`2-half-lover.png` = 2人半身情侣

### 🤖 AI 场景识别
- **启发式检测**：基于时段分析 + 画面特征智能推断当前场景（夜景/美食/户外等）
- **无 AI 后备**：弱置信度检测不再降级为时间猜测，确保推荐可靠
- 显示 AI 推荐场景，一键切换其他模式

## 设计风格

- **极简 Chic** — 象牙白 + 炭灰 + 香槟金
- 底部场景选择器
- 浮动 AI 状态提示
- 极简相机界面

## 技术栈
- **Framework**: React Native (Expo SDK 55)


## 开始使用

### 环境要求
- Node.js ≥ 18
- npm ≥ 9


```

## Roadmap

- [ ] Phase 2: 用户自定义场景「选中场景，拍照时目前其实没有什么特别不同，也许可以有更多的preset」
- [ ] Phase 2: AI 构图指导 (更高级，比如多帧平滑处理，动态基线让构图指导更精准)

## License

MIT © StanzSnap Team

## Support
本 App 技术支持请联系此邮箱
开发者：CathyZeng | 邮箱：piaopiaohou@hotmail.com 

---

# StanzSnap 📷

> Empowering everyone who doesn't know how to pose to capture compelling photos

StanzSnap is a smart camera app designed for photography beginners. It combines AI-powered heuristic scene recognition, multi-rule composition guidance (golden spiral, symmetry, negative space, and more), pose reference, detection and feedback to help users get instant creative inspiration while shooting.

![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-000)
![License](https://img.shields.io/badge/License-MIT-000)

## Core Features

### 🧭 AI Composition Guidance
- **Face Positioning**: Real-time face detection, aligning with rule-of-thirds intersection points
- **Body Angle**: Identifies front/side/three-quarter views, guides posture adjustments
- **Composition Rule Scoring**: Golden spiral, symmetry, negative space, clutter detection, triangle arrangement
- **Real-time Feedback**: Floating hints guide the user to adjust position until it's right

### 🤸 Pose Detection & Feedback
Based on MediaPipe Pose detection, real-time analysis of 7 dimensions of pose quality:

| Dimension | Detection | Gender Differences |
|-----------|-----------|-------------------|
| Head Tilt | Side tilt, head tilt (sensitivity 15°) | — |
| Neck Posture | Neck tilt, chin tuck, head forward | Different chin thresholds |
| Shoulder Tilt | Angle, excessive tilt warning | — |
| Body Angle | Front/side/three-quarter | — |
| Arm Position | Arms close to body, spacing | — |
| Hand Position | In pocket, chin resting, on hip | Hands on hip: male positive, female advised to lower |
| Weight Distribution | Single-leg loading, balance | — |

**Pose Score 0–1**: Weighted composite score, prioritizing the most improvable areas.

### 📸 Camera Controls
- **Flash**: Toggle torch mode for continuous light in dark scenes
- **Zoom**: Tap zoom levels (1× / 2× / 3×) for quick focal length changes
- **HDR**: High Dynamic Range — recovers highlight and shadow detail
- **Exposure Value (EV)**: Slide to adjust brightness
- **Portrait Blur**: Tap the aperture icon → tap a subject → real-time background blur
- **Burst**: Capture 3 or 5 photos in quick succession for action shots
- **Scene Presets**: 12 presets (Night / Food / Portrait / Sunset etc.) with optimized camera settings
- **AI Scene Detection**: Automatically detects the scene and recommends optimal settings
- **Composition Guides**: Rule of thirds / Golden spiral / Symmetry / Triangle / Diagonal overlays

### 🖼️ Gallery Editor
Fine-tune your photos after capture:
- **Highlights / Shadows**: Slide to recover detail in overexposed or underexposed areas
- **Blur**: Add a portrait depth-of-field effect for a professional look
- **Compare**: Toggle between original and edited to see the difference side-by-side
- **Crop / Rotate / Flip**: Adjust composition and orientation before saving

### 🧍 Pose Reference (Poser)
Overlay gold-outline pose silhouettes on the viewfinder to help subjects get pose inspiration:

- **Open**: Tap the 👤 button in the bottom controls
- **Filters**:
  - **People**: Single / Pair / Group
  - **View**: Distant(D) / Full-body(F) / Half-body(H) / Close-up(C) — multi-select
  - **Tags**: Bro / Sis / Lover / Elder / Sit / Railing — multi-select
- **Use**: Tap a pose thumbnail → it overlays on the viewfinder → zoom adjusts automatically
- **Clear**: Tap 👤 again to remove the overlay
- **File naming**: `{people}-{view}-{tag}(-{seq}).png` (e.g. `1-full-sit-1.png`, `2-half-lover.png`)

### 🤖 AI Scene Recognition
- **Heuristic detection**: Infers scene from time-of-day analysis + visual cues (night / food / outdoor, etc.)
- **No fallback guessing**: Low-confidence detections no longer degrade to time-based guesses — reliable recommendations only
- Displays AI-recommended scene, one-tap switch to other modes

### 📚 Photography Education
Every scene includes **"Why these settings"** explanations:
- Why is ISO set to this value?
- What does shutter speed mean?
- How does aperture affect the shot?

## Design Philosophy

- **Minimal Chic** — Ivory + Charcoal + Champagne Gold
- Bottom scenario picker
- Floating AI status indicator
- Minimalist camera UI

## Tech Stack

- **Framework**: React Native (Expo SDK 55)

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

## Roadmap
- [ ] Phase 2: Advanced preset packs
- [ ] Phase 2: AI composition guidance

## License

MIT © StanzSnap Team


## Support
Please contact this mail for support
Developer: CathyZeng | mail: piaopiaohou@hotmail.com 