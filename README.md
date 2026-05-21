# StanzSnap 📷

> 让每一个不会摆姿势不会构图的人，都能拍出有感染力的照片

StanzSnap 是一款专为摄影新手设计的智能相机应用，结合 AI 场景识别、实时构图指导、姿势检测与反馈，帮助用户在拍摄过程中获得即时的创意灵感。

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

StanzSnap is a smart camera app designed for photography beginners. It combines AI-powered heuristic scene recognition, multi-rule composition guidance (golden spiral, symmetry, negative space, and more), pose detection and feedback to help users get instant creative inspiration while shooting.

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