# 📦 Release v0.1.0

> 智能工程项目管理平台 —— 架构重构首次提交版本

---

## 🚀 概述

这是 `smart-odoo-platform` 项目的首次结构发布版本（v0.1.0），标志着从传统 Odoo 自定义模块开发方式正式迈入“结构驱动 + 意图解释 + 前后端解耦”的平台化架构阶段。本次提交完成了核心能力框架、接口规范、目录规划与 Git 版本管理初始化。

---

## ✨ 主要内容

### ✅ 后端模块 `smart_core` 完成结构初始化：
- 核心目录：`core/`, `commands/`, `controllers/`, `security/`, `utils/`
- 控制器接口 `/api/intent/dispatch` 建立
- 示例命令模块 `load_view.py`、`load_records.py` 完成
- 命令注册中心、意图路由器、上下文封装器、统一响应结构编写

### ✅ 前端项目 `frontend_vue/vue_app` 初始化：
- 使用 Vite + Vue3 创建通用渲染系统
- 支持动态表单、结构化视图渲染准备
- `.gitignore` 优化避免两万文件提交

### ✅ DevOps 与版本控制：
- 全局 Git 仓库重建（包含前后端）
- `.gitignore` 管理大规模 node_modules、pycache 等缓存
- 建立版本发布目录 `release_notes/`

---

## 🧱 项目结构

见 [README.md](../README.md) 中“项目结构说明”章节。

---

## 📌 版本标记

```bash
git tag v0.1.0
git push origin v0.1.0
```

---

## 🛠 后续计划

请参考 [项目首页](../README.md) 中的“即将开发”部分。

---

## 🙌 致谢

感谢项目核心作者 @Leedefend 的架构构思与持续投入！
