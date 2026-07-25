# `@starting-style` 动效增强方案

> 目标：用原生 CSS `@starting-style` 为 Next TOC 的**进场 / 出场动画**提供一套统一、可降级、零依赖的方案，替换/补齐当前"要么瞬间出现、要么只能进不能出"的动效现状。
>
> 状态：设计提案（未实现）· 面向 `2.3.0` 代码基线

---

## 一、结论先行（TL;DR）

- `@starting-style` 是 CSS 原生的**"进场起始态"** 能力，配合 `transition-behavior: allow-discrete` 可以让元素在 **加入 DOM / 从 `display:none` 显示 / Popover 打开** 时拥有丝滑的淡入、缩放、滑入动画，且**不支持的环境自动退化为"瞬间出现"**（即当前行为），是天然的渐进增强。
- 本插件 `minAppVersion: 1.11.0`，桌面端 Electron 内核远高于该特性所需的 Chromium 117，**桌面端可直接使用**；移动端需按渐进增强处理（见 [§3](#三适配前提关键约束核查)）。
- 构建链（`postcss-nesting` + esbuild）**已验证可正确处理**嵌套的 `@starting-style`（见 [§3.3](#33-构建链已验证)），无需引入任何新依赖。
- 下表按**价值**排序；**落地顺序**因实现依赖与风险另行安排（先 A 试点、再 B），详见 [§7](#七落地路线图)：

| 优先级 | 方案 | 对应参考场景 | 价值 | 工作量 | 主要风险 |
|:---:|---|:---:|:---:|:---:|---|
| **P0** | [B. 大纲节点展开/折叠](#方案-b-大纲节点的平滑展开折叠p0) | ②节点展开折叠 | ★★★ | 中 | 需改 `visibilityMap` 渲染策略；大文档 DOM 成本 |
| **P0** | [横切：`prefers-reduced-motion` + 动效开关](#六横切关注点必做) | — | ★★★ | 低 | 当前全仓库缺失，属必做前置项 |
| **P1** | [A. 悬浮面板呼出/收起](#方案-a-悬浮面板的呼出与收起p1) | ①面板呼出 | ★★ | 低-中 | 现状已有 opacity 动画，收益偏"锦上添花" |
| **P1** | [D. 工具按钮 & Tooltip 进出](#方案-d-工具按钮与-tooltip-的进出p1) | ④Tooltip | ★★ | 低 | Tooltip 属新功能，需先确认需求 |
| **P2** | [C. 动态标题注入高亮](#方案-c-动态标题注入的无缝提示p2) | ③无缝注入 | ★★ | 中-高 | **有 React key 重挂载的坑**，见正文 |

---

## 二、`@starting-style` 是什么（技术底座）

`@starting-style` 定义元素**第一次被渲染出来时的"起始样式"**。浏览器用它作为过渡的起点，从而实现"从无到有"的进场动画。它解决了一个长期痛点：`display: none → display: block`、以及**元素刚被插入 DOM** 时无法用 `transition` 起效（因为没有"前一帧"可插值）。

三个关键配套点：

1. **只管进场（enter），不管出场（exit）。** 出场动画有两条路：
   - 元素**保留在 DOM** 中，用 `display` 之类的离散属性配合 `transition-behavior: allow-discrete`，CSS 会在"消失前"保持元素可见并跑完出场过渡；
   - 使用 **Popover API / `<dialog>`**，浏览器在顶层（top layer）原生托管进出场，配合 `@starting-style` 即可。
2. **离散属性过渡**：`display`、`content-visibility`、`overlay` 等属性默认不可过渡，需 `transition-behavior: allow-discrete`（或简写 `transition: display .2s allow-discrete`）。
3. **兼容性**：Chrome/Edge 117+、Safari 17.5+（`allow-discrete` 需 18）、Firefox 129+。**不支持时，`@starting-style` 块被整体忽略，元素直接以终态出现**——即今天的效果，无破坏性。

> 与 View Transitions API 的分工：`@starting-style` 负责**单个元素的进出场**；跨状态的**布局位移/重排动画**（例如"新条目把其它条目平滑挤开"）不属于它的能力范围，那是 View Transitions / FLIP 的领域。详见 [§5](#五能力边界诚实说明不能做什么)。

---

## 三、适配前提（关键约束核查）

### 3.1 运行环境

| 环境 | 内核 | `@starting-style` | `allow-discrete` | 结论 |
|---|---|:---:|:---:|---|
| Obsidian 桌面（`minAppVersion 1.11.0`） | Electron / Chromium ≫ 117 | ✅ | ✅ | 直接可用 |
| Obsidian Android | 系统 WebView（较新 Chromium） | ✅（多数） | ✅（多数） | 基本可用 |
| Obsidian iOS | 系统 WebKit | ⚠️ 需 ≥17.5 | ⚠️ 需 ≥18 | **必须渐进增强** |

`manifest.json` 中 `isDesktopOnly: false`，意味着方案**不能假设 iOS 一定支持**。好在 `@starting-style` 的失败模式是"无动画、直出终态"，因此只要**不把关键的可见性/可交互性依赖于过渡本身**，就天然安全（见 [§3.4](#34-一条硬性约束不要让-display-切换依赖动画完成)）。

### 3.2 现状盘点（全仓库检索结论）

- **无** 任何 `@starting-style` / `transition-behavior` / `popover` / View Transitions 使用。
- **无** `prefers-reduced-motion` 适配——这是当前的无障碍缺口，也是本方案的**前置必做项**。
- 现有两处进场动画均为 `@keyframes` + `animation`：
  - `src/components/toc-return-tools/TocReturnTools.css:81` 的 `slideIn`
  - `src/components/tab/Tab.css:155` 的 `fadeIn`
  - 二者的共同局限：**只能进、不能出**（React 卸载即瞬间消失），正是 `@starting-style + allow-discrete` 要补齐的场景。

### 3.3 构建链（已验证）

CSS 经 `postcss-nesting` 处理后由 esbuild 打包（`scripts/esbuild.config.mjs`）。已用真实依赖验证：嵌套写法

```css
.a{ transition: opacity .2s ease, display .2s allow-discrete;
    &:not(.open){ display:none; }
    @starting-style{ &.open{ opacity:0; } } }
```

会被正确展开为

```css
.a{ transition: opacity .2s ease, display .2s allow-discrete; }
.a:not(.open){ display:none; }
@starting-style{ .a.open{ opacity:0; } }
```

即 `@starting-style` 内的 `&` 嵌套也能正确解引用。**无需新增构建依赖**。（若未来某次升级出现异常，退化写法是：把 `@starting-style` 写成顶层块、内部用完整选择器。）

### 3.4 一条硬性约束：不要让 `display` 切换"依赖"动画完成

所有出场方案都基于 `transition-behavior: allow-discrete`。务必保证：**即使过渡被跳过（不支持 / 用户开启减弱动效），元素也应立即到达正确的最终 `display` 状态**。CSS 天然满足这一点（`allow-discrete` 不支持时 `display` 立即翻转），这也是本方案在低端环境安全的根本原因——**动画是纯装饰层，不承载状态**。

---

## 四、增强方案（逐条映射真实代码）

### 方案 A：悬浮面板的"呼出与收起"（P1）

**现状** — `src/components/toc-navigator/TocNavigator.css:137`：悬浮 TOC 正文 `.NToc__group-content` 常驻 DOM，靠 `visibility/opacity` 切换：

```css
.NToc__group-content {
  visibility: hidden; opacity: 0;
  transition: all 0.2s ease;
  pointer-events: none;
}
.NToc__group-content-expanded { opacity: 1; visibility: visible; pointer-events: auto; }
```

展开由 `TocNavigator.tsx` 的 `isHovered` / `shouldExpandToc` 驱动（`src/components/toc-navigator/TocNavigator.tsx:211,251`）。由于元素**从不离开布局**，还需要 `:before` 造一块"幽灵热区"防闪烁（`TocNavigator.css:154`）。

**`@starting-style` 做法** — 改为 `display` 真正切换，进出场都带**从屏幕边缘方向滑入 + 轻微缩放淡入**，并去掉 `visibility` + `pointer-events` 的组合 hack：

```css
.NToc__group-content {
  /* 隐藏态 = 起始态 */
  opacity: 0;
  transform: translateX(var(--NToc__enter-x, 8px)) scale(0.98);
  transition:
    opacity 0.2s ease,
    transform 0.2s cubic-bezier(0.2, 0, 0, 1),
    display 0.2s allow-discrete;
}
.NToc__group-content:not(.NToc__group-content-expanded) { display: none; }

.NToc__group-content-expanded { opacity: 1; transform: none; }

@starting-style {
  .NToc__group-content-expanded { opacity: 0; transform: translateX(var(--NToc__enter-x, 8px)) scale(0.98); }
}

/* 方向感：左停靠从左侧滑入，右停靠从右侧滑入 */
.NToc__container-left  .NToc__group-content { --NToc__enter-x: -8px; }
.NToc__container-right .NToc__group-content { --NToc__enter-x:  8px; }
```

**收益**：呼出/收起都有动画（当前收起是硬切）；`display:none` 让隐藏时不占布局、不吃事件，可移除幽灵热区逻辑；方向感更贴合"从边缘滑出"。
**代价/坑**：`.NToc__group-content` 内部滚动位置在 `display:none` 期间会保留，无副作用；需回归测试 `left/right` 停靠与 resize 手柄（`.NToc__group-resize`）在隐藏态下确实不可交互。
**进阶（可选，工作量更高）**：把面板重构为 **Popover API**（`popover` 属性 + `:popover-open`），进入顶层，彻底摆脱 `z-index: var(--layer-popover)` 与编辑器 `overflow` 裁剪问题，并获得原生 light-dismiss。但当前定位依赖编辑器内绝对定位，改动面较大，建议作为独立议题评估。

---

### 方案 B：大纲节点的"平滑展开/折叠"（P0）

> 本方案价值最高，且**同时惠及悬浮面板与侧边栏**——两者共用 `TocItem` 组件与 `useTocVisibility`。

**现状** — 折叠是**从渲染列表里过滤掉子节点**：`useTocVisibility.tsx` 计算 `visibilityMap`，`NTocViewContent.tsx:61` / `TocNavigator.tsx:76` 用它得到 `visibleItems`，折叠父节点时其后代**直接不进入 `.map()`**。因此：折叠 = React 卸载、展开 = React 挂载，**全程零动画**。

**`@starting-style` 做法** — 把"过滤掉"改为"渲染但标记隐藏"，让 CSS 接管进出场：

1. 渲染层：不再从 `visibleItems` 移除被折叠的后代，而是照常渲染，并透传一个 `data-collapsed-hidden` 标记（由 `visibilityMap[index] === false` 得出）。
2. 样式层：

```css
.NToc__toc-item-container {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease,
    display 0.18s allow-discrete;
}
/* 被折叠祖先隐藏的后代 */
.NToc__toc-item-container[data-collapsed-hidden="true"] { display: none; }

/* 展开进场：向下"落"入并淡入，按层级/序号错落 */
@starting-style {
  .NToc__toc-item-container:not([data-collapsed-hidden="true"]) {
    opacity: 0;
    transform: translateY(-4px);
  }
}
```

3. "错落有致"的级联：给每个子项内联 `--stagger-index`（在同一次展开中的相对序号），并

```css
.NToc__toc-item-container { transition-delay: calc(var(--stagger-index, 0) * 18ms); }
```

**收益**：树状大纲展开/折叠拥有现代化的级联淡入/滑出；纯 CSS，无 JS 高度测量（对比传统 `height` 动画零重排成本）；一处改动覆盖悬浮面板 + 侧边栏两种形态。

**代价 / 坑（务必评估）**：
- **DOM 成本**：改为"渲染但隐藏"后，折叠子树的 `TocItem` 仍会挂载并**执行 Markdown 异步渲染**（`TocItem.tsx:74` 的 `renderContent`）。超大文档 + 大量折叠时，DOM 结点与渲染开销上升。**缓解**：可对 `display:none` 的节点加 `content-visibility: hidden` 跳过渲染；或仅对"最近一次被切换的父节点"临时保留挂载，其余仍走过滤。建议先做基准测试再定策略。
- **首屏整表动画**：`@starting-style` 对元素"首次渲染"一律生效，会导致**打开文档时整棵目录一起淡入**。若不想要，需把进场动画**限定在"用户主动展开"的语境**（例如：仅当父节点带 `data-just-expanded` 时才对其子项应用 `@starting-style`，切换后用一次性定时器清除该标记），或接受一次轻微的初始淡入。
- **折叠图标**：可顺带把 `ChevronRight/ChevronDown` 组件切换（`TocItem.tsx:149`）改为单个 chevron + `transform: rotate(90deg)` 过渡，与列表动画统一。

---

### 方案 C：动态标题注入的"无缝提示"（P2）

**现状** — 编辑器输入时，`main.ts:344` 的 `editor-change` 直接从实时文本解析 `headings` 并重渲染 `TocNavigator`。新敲的 `## 标题` 会让一个新的 `TocItem` 挂载。

**目标（参考场景③）** — 新标题出现时**闪一下高亮**（淡入 + 轻微强调背景），给用户"插件已捕捉到修改"的心理暗示。

**`@starting-style` 做法** — 对"新加入"的条目做一次性高亮衰减：

```css
.NToc__toc-item-container[data-just-added="true"] {
  background-color: transparent;
  transition: background-color 0.6s ease;
  @starting-style {
    background-color: color-mix(in srgb, var(--interactive-accent) 32%, transparent);
  }
}
```

**⚠️ 关键坑（必须先解决，否则效果相反）** — 当前列表项的 React key 是
`toc-item-${index}-${heading.position.start.line}`（`TocNavigator.tsx:295` / `NTocViewContent.tsx:153`）。**在中间插入一行标题会让其后所有标题的 `index` 与 `start.line` 改变 → key 变化 → 全部重挂载 → `@starting-style` 对它们统统生效 → 每敲一行整表闪烁。**

因此方案 C 的前置是**建立稳定身份**，二选一：

- **改 key 为内容签名**：复用 `useTocCollapse.tsx:10` 已有的 `getCollapseKey`（`${level}::${heading}`）思路做 React key（重复标题追加出现序号消歧）。位移的老条目身份不变、不重挂载，只有真正的新条目挂载并触发进场。
- **显式 diff + 瞬时属性**：在数据层比对上一帧与当前 `headings` 集合，仅给新增项打 `data-just-added`，约 600ms 后由一次性定时器清除。与挂载解耦，控制最精确，也不依赖 key 策略。

> 参考场景③里"把其它条目平滑挤开"属于**布局位移动画**，`@starting-style` 不负责——见 [§5](#五能力边界诚实说明不能做什么)。若确有需求，用 View Transitions 单独做。建议 C 先只做"新条目高亮淡入"，挤开效果作为后续可选项。

**建议**：C 依赖 key 改造，牵一发动全身，排在 P2；若团队本就想把 key 改成内容签名（对拖拽排序、热刷新稳定性也有益），可与之合并推进。

---

### 方案 D：工具按钮 & Tooltip 的进出（P1）

**D-1 返回工具按钮的出场动画** — `TocReturnTools.tsx:107` 的展开按钮组是条件渲染（`{isExpanded && ...}`），进场用 `animation: slideIn`（`TocReturnTools.css:48,81`），**收起时无动画**（直接卸载）。改为常挂载 + `display` 切换，即可让收起也有对称的缩小淡出：

```css
.NToc__tool-buttons {
  transition: opacity .22s ease, transform .22s ease, display .22s allow-discrete;
}
.NToc__tool-buttons[data-collapsed="true"] { display: none; }
@starting-style {
  .NToc__tool-buttons:not([data-collapsed="true"]) { opacity: 0; transform: scale(0.8); }
}
```

（`Tab.css` 的 `fadeIn` 同理可平滑升级，视需要。）

**D-2 Tooltip / 瞬时提示（新功能，需先确认需求）** — 当前长标题是换行显示，无悬浮提示。若要为**截断的长标题**或**阅读进度**提供 hover/focus 气泡，`@starting-style` 很适合做"啵"一下的弹性出现：

```css
.NToc__tooltip {
  transition: opacity .15s ease, transform .15s cubic-bezier(0.2, 0.8, 0.2, 1.2), display .15s allow-discrete;
}
.NToc__tooltip:not(.is-open) { display: none; }
.NToc__tooltip.is-open { opacity: 1; transform: scale(1); }
@starting-style {
  .NToc__tooltip.is-open { opacity: 0; transform: scale(0.9); }
}
```

推荐结合 **Popover API + CSS Anchor Positioning**（或复用 Obsidian 内置 tooltip）落地，避免自行管理定位与层级。**此项属新增能力，建议先确认产品是否需要 Tooltip，再排期。**

---

## 五、能力边界（诚实说明"不能做什么"）

1. **不做布局位移/重排动画。** "新条目把邻居平滑挤开""拖拽排序后的重排补间"这类**位置补间**不是 `@starting-style` 的能力。需要它们时用 **View Transitions API**（`document.startViewTransition`）或 FLIP。二者可与 `@starting-style` 并存、各司其职。
2. **只保证进场；出场必须靠 `allow-discrete` 或 Popover/`<dialog>`。** 纯 React 条件渲染 + `@starting-style` 只能进不能出。
3. **"首次渲染"一视同仁。** 无法在纯 CSS 里区分"首屏加载"与"用户主动展开"，需用作用域标记（如 `data-just-expanded`）或 JS 协助限定进场语境（见方案 B 坑位）。
4. **移动端 iOS 老版本无动画。** 这是可接受的退化，但不能把交互正确性寄托在动画上（见 [§3.4](#34-一条硬性约束不要让-display-切换依赖动画完成)）。

---

## 六、横切关注点（必做）

### 6.1 `prefers-reduced-motion`（无障碍，前置必做）

当前全仓库无减弱动效适配。**所有新增动效必须包裹**，否则对动效敏感用户不友好、也不符合无障碍规范：

```css
@media (prefers-reduced-motion: reduce) {
  .NToc__group-content,
  .NToc__toc-item-container,
  .NToc__tool-buttons {
    transition: none;
  }
  /* @starting-style 块在无过渡时自然不产生动画，元素直出终态 */
}
```

### 6.2 用户可控开关

插件设置面板体量大、可配置度高（`src/settings/`）。建议新增一档 `render.animationLevel`（`off` / `subtle` / `full`）或至少 `render.enableMotion` 布尔项，映射到根节点 class（如 `NToc--motion-off`），让用户/主题作者可关。默认建议 `subtle`。

### 6.3 特性检测式渐进增强（可选加固）

除了"不支持自动忽略"的天然降级，涉及 `display` 切换的方案（A/B/D）可用 `@supports` 显式加固，让老环境稳妥保留"常挂载 + opacity"旧路径：

```css
@supports (transition-behavior: allow-discrete) {
  /* 新的 display 切换路径 */
}
```

### 6.4 构建与回归验证

- 已验证 `postcss-nesting` 透传（[§3.3](#33-构建链已验证)）；每次相关改动后仍应 `pnpm build` 冒烟一次，确认 `dist/styles.css` 中 `@starting-style` 完整保留。
- 回归重点：左/右停靠、resize 手柄、`renderInAllVisibleViews` 多视图、侧边栏 `NTocView` 与悬浮 `TocNavigator` 两条渲染路径一致性。

---

## 七、落地路线图

> **落地顺序 ≠ 价值优先级。** B 价值最高（P0），但实现分析（通读 `useDragSort` / 渲染管线后）发现它带前置依赖与边界情况，不宜作为第一步。故按"先用**最低风险的载体**验证 `@starting-style` 在真实 Obsidian 运行时可用、并沉淀 `prefers-reduced-motion` / `allow-discrete` 通用范式"排序：**先 A，再 B**。

**Phase 1 · 悬浮面板呼出/收起（方案 A）· 动效地基与试点** ✅ 已实现（待验证）
- 为什么先做：`.NToc__group-content` 是**常挂载、靠 class 切换**的元素，进出场纯由 CSS 驱动，**无挂载 / key / 拖拽 / 性能风险**，是验证 `@starting-style` + `allow-discrete` 并确立 `prefers-reduced-motion` 范式的最干净载体；且它是用户每次呼出 TOC 都会看到的高频改善。
- 内容：`visibility` 切换改为 `display` 切换 + 方向滑入 / 缩放淡入（进出场对称）；随附 `prefers-reduced-motion` 守卫。
- 涉及：`src/components/toc-navigator/TocNavigator.css`（纯 CSS，无需改 `.tsx`）。

**Phase 2 · 大纲节点展开/折叠（方案 B）· 价值最高** — B-1 / B-2 ✅ 已实现（待验证）
- **前置依赖（本次代码分析新增，均已就绪）**：
  1. **稳定 React key** ✅：新增 `src/utils/getStableHeadingKeys.ts`（内容签名 `${level}::${heading}::${occurrence}`），两条渲染路径的列表 key 由 `toc-item-${index}-${start.line}` 改为该稳定 key。**此项对方案 C 亦为前置，现已就绪**。
  2. **拖拽 / 滚动命中改造** ✅：`useDragSort.resolveDropTarget`、`useActiveHeadingScroll`、`handleLocateActiveHeading` 的 DOM 扫描均加 `:not([data-collapsed-hidden="true"])`，排除 `display:none` 的隐藏项（其零高度矩形会污染落点判定 / 误滚动）。
- 两步交付：
  - **B-1 展开进场** ✅：`@starting-style` 淡入落位（`translateY(-4px)` → 静止）。
  - **B-2 折叠出场** ✅：**render-but-hide** —— `useTocVisibility` 新增 `renderMap`（未跳过即渲染，含被折叠祖先隐藏的项）与 `collapsedHiddenMap`（`display:none` 标记）；两组件改渲染 `renderMap`（`visibilityMap` 仍供指示条 / 拖拽 id），`TocItem` 透出 `data-collapsed-hidden`；`TocItem.css` 以 `transition: … , display 0.2s allow-discrete` + `[data-collapsed-hidden="true"]` 目标态实现出场，展开 / 挂载走同一 `@starting-style` 进场。
- **已知取舍**：
  - **DOM 成本**：render-but-hide 让被折叠的后代**保留在 DOM**（`display:none`，且已渲染过 Markdown），折叠不再卸载节点——超大文档 + 大范围「全部折叠」时常驻节点数偏高。缓解（未做）：仅对最近切换的子树 render-but-hide、其余仍过滤；或 `content-visibility`。**建议在大文档上验证**。
  - **编辑反馈**：编辑标题文本会让该项 key 变、单独重播一次进场（局部克制，与方案 C 同源）。
  - 减弱动效：`prefers-reduced-motion: reduce` 下进出场均瞬时。
- 涉及：`src/utils/getStableHeadingKeys.ts`、`src/hooks/useTocVisibility.tsx`、`src/hooks/useDragSort.tsx`、`src/hooks/useActiveHeadingScroll.tsx`、`src/components/toc-item/TocItem.tsx` + `TocItem.css`、`src/components/toc-navigator/TocNavigator.tsx`、`src/view/NTocViewContent.tsx`。

**Phase 3 · 工具按钮出场（方案 D-1）+ 动效用户开关**
- 方案 D-1（返回工具按钮的对称出场）；补齐 `animationLevel` / `enableMotion` 用户开关（[§6.2](#62-用户可控开关)），映射到根节点 class。（`prefers-reduced-motion` 无障碍基线已随 Phase 1 落地，此处补的是用户显式开关。）
- 涉及：`src/components/toc-return-tools/*`、`src/settings/*` + i18n。

**Phase 4 · 动态高亮与 Tooltip（方案 C / D-2，依赖决策）**
- 方案 C 新条目高亮（依赖 Phase 2 的稳定 key）；方案 D-2 Tooltip 需产品确认后再排。
- 涉及：`TocNavigator.tsx` / `NTocViewContent.tsx` 的数据层 diff、（可选）新增 Tooltip 组件。

---

## 八、风险与验证清单

- [ ] iOS（WebKit < 17.5/18）实机确认：无动画但功能与布局完全正常。
- [ ] 方案 B：千级标题大文档下，"渲染但隐藏"的 DOM/Markdown 渲染开销可接受（否则切 `content-visibility` 或"仅挂载最近切换子树"策略）。
- [ ] 方案 B：确认首屏不会整表闪动（作用域标记生效）。
- [ ] 方案 C：插入/删除中间标题时，只有真正的新条目高亮，无整表闪烁（key 稳定身份到位）。
- [ ] 减弱动效开启时，所有进出场立即到位、无残留过渡。
- [ ] `pnpm build` 后 `dist/styles.css` 中 `@starting-style` 未被工具链破坏。
- [ ] 左/右停靠、resize、多视图、侧边栏/悬浮双路径全回归。

---

### 附：涉及文件速查

| 文件 | 角色 | 相关方案 |
|---|---|---|
| `src/components/toc-navigator/TocNavigator.css` | 悬浮面板样式（`.NToc__group-content` 等） | A、B |
| `src/components/toc-navigator/TocNavigator.tsx` | 悬浮面板渲染、`isHovered`、列表 key | A、C |
| `src/components/toc-item/TocItem.tsx` / `.css` | 单个大纲条目（进出场载体） | B、C |
| `src/hooks/useTocVisibility.tsx` | `visibilityMap` 折叠可见性 | B |
| `src/hooks/useTocCollapse.tsx` | `getCollapseKey` 内容签名 | C（稳定身份） |
| `src/view/NTocViewContent.tsx` | 侧边栏渲染路径（同样用 `visibleItems`/key） | B、C |
| `src/components/toc-return-tools/*` | 返回工具按钮（现 `slideIn` 只进不出） | D-1 |
| `src/main.ts` | `editor-change` 实时重渲染入口 | C |
| `src/settings/*` | 设置面板（新增动效开关） | §6.2 |
| `scripts/esbuild.config.mjs` | 构建链（postcss-nesting 透传） | §3.3 |
