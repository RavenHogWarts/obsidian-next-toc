# [1.4.0](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.3.0...1.4.0) (2026-01-23)


### ♻️ Refactor

* **i18n:** 使用明确英文为回退语言并移除未用导出 (#141) ([0536162](https://github.com/RavenHogWarts/obsidian-next-toc/commit/05361622c3ef3e153fb42e249179f0a2a4fed942)), closes [#141](https://github.com/RavenHogWarts/obsidian-next-toc/issues/141)


### ✨ Features

* 根据 frontmatter 与黑名单决定是否显示标题编号 (#146) ([f0c0d87](https://github.com/RavenHogWarts/obsidian-next-toc/commit/f0c0d874e9476f6d7531f4a187c20440866ca8ce)), closes [#146](https://github.com/RavenHogWarts/obsidian-next-toc/issues/146)
* 添加指示器模式与居中显示 (#145) ([7e737da](https://github.com/RavenHogWarts/obsidian-next-toc/commit/7e737da776d4c5a2befc15430e5cc0291671b614)), closes [#145](https://github.com/RavenHogWarts/obsidian-next-toc/issues/145)
* 支持设置标题编号起始序号 (#147) ([52189ea](https://github.com/RavenHogWarts/obsidian-next-toc/commit/52189ea695a3140d8ddf48126c26aac09bd2b8b4)), closes [#147](https://github.com/RavenHogWarts/obsidian-next-toc/issues/147)
* **i18n:** 添加法语 (fr) 本地化支持 (#143) ([67515e9](https://github.com/RavenHogWarts/obsidian-next-toc/commit/67515e9fc4f96e5dd5c7b1c42983ee50cfdb461f)), closes [#143](https://github.com/RavenHogWarts/obsidian-next-toc/issues/143)
* **i18n:** 添加法语翻译文件 (#142) ([cff4e2b](https://github.com/RavenHogWarts/obsidian-next-toc/commit/cff4e2bbc3ee268a902ac9213a3e2157aa7311e9)), closes [#142](https://github.com/RavenHogWarts/obsidian-next-toc/issues/142)


### 🐛 Bug Fixes

* 修复安全问题 ([27a45a2](https://github.com/RavenHogWarts/obsidian-next-toc/commit/27a45a27a716ff3b780486bb6042b69eea9b6387))



# [1.3.0](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.2.6...1.3.0) (2026-01-16)


### ✨ Features

* **i18n:** 切换到 typesafe-i18n 的类型化调用 (#135) ([c255961](https://github.com/RavenHogWarts/obsidian-next-toc/commit/c25596102f4271401fda94d1adee2c88c2a8d330)), closes [#135](https://github.com/RavenHogWarts/obsidian-next-toc/issues/135)


### 🔨 Chore

* **deps:** 更新 package-lock 元数据并调整依赖位置 (#134) ([ff908c6](https://github.com/RavenHogWarts/obsidian-next-toc/commit/ff908c6fb1626b208adda97f9927856d215d76cb)), closes [#134](https://github.com/RavenHogWarts/obsidian-next-toc/issues/134)



## [1.2.6](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.2.5...1.2.6) (2026-01-06)

### ♻️ Refactor

-   use void for async calls and tidy strings (#129) ([64b09e0](https://github.com/RavenHogWarts/obsidian-next-toc/commit/64b09e0257aa9a358fe43b19c59847fd7c3be53e)), closes [#129](https://github.com/RavenHogWarts/obsidian-next-toc/issues/129)

### ✨ Features

-   为插件设置页添加图标字段 (#122) ([33e3463](https://github.com/RavenHogWarts/obsidian-next-toc/commit/33e3463412d9bca915a6ce4554c1db6dcdf488da)), closes [#122](https://github.com/RavenHogWarts/obsidian-next-toc/issues/122)

### 🐛 Bug Fixes

-   移除未使用的样式工具 (#128) ([c160ace](https://github.com/RavenHogWarts/obsidian-next-toc/commit/c160ace2c845d2b6f42af662cba010898306ea58)), closes [#128](https://github.com/RavenHogWarts/obsidian-next-toc/issues/128)
-   用 CSS 分离样式并简组件逻辑 (#132) ([e37303c](https://github.com/RavenHogWarts/obsidian-next-toc/commit/e37303c79bfc5695bcb07a4817d937935339c4aa)), closes [#132](https://github.com/RavenHogWarts/obsidian-next-toc/issues/132)
-   **icon-picker:** 优化图标建议渲染逻辑 (#126) ([c7d0f66](https://github.com/RavenHogWarts/obsidian-next-toc/commit/c7d0f66fdc0f5473769a9292472125c892cc410f)), closes [#126](https://github.com/RavenHogWarts/obsidian-next-toc/issues/126)
-   **icon-picker:** 优化图标建议渲染逻辑 (#127) ([87f1972](https://github.com/RavenHogWarts/obsidian-next-toc/commit/87f197257d039bb238acb82303c9058b435ddee2)), closes [#127](https://github.com/RavenHogWarts/obsidian-next-toc/issues/127)

### 🔨 Chore

-   更新 package-lock 以同步依赖元数据 (#131) ([18ebdab](https://github.com/RavenHogWarts/obsidian-next-toc/commit/18ebdab2806f68e3d96e651c985b030d8f4de443)), closes [#131](https://github.com/RavenHogWarts/obsidian-next-toc/issues/131)
-   升级开发与运行时依赖版本 (#125) ([e0d2e3f](https://github.com/RavenHogWarts/obsidian-next-toc/commit/e0d2e3f14a4f5e09ee4dc8a7a716ab6e2c78d8bb)), closes [#125](https://github.com/RavenHogWarts/obsidian-next-toc/issues/125)

## [1.2.5](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.2.4...1.2.5) (2025-12-10)

### ✨ Features

-   添加打开目录侧边视图命令,移除自启动 (#120) ([79cd0ab](https://github.com/RavenHogWarts/obsidian-next-toc/commit/79cd0ab7b3c5709e4cdd188fca1e09be41dc114d)), closes [#120](https://github.com/RavenHogWarts/obsidian-next-toc/issues/120)

## [1.2.4](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.2.3...1.2.4) (2025-12-09)

### ✨ Features

-   **toc:** 监听元数据变更以更新目录展开状态 (#118) ([acfadd4](https://github.com/RavenHogWarts/obsidian-next-toc/commit/acfadd4d6ed6301ce0bbfb2d17969c6ac8472805)), closes [#118](https://github.com/RavenHogWarts/obsidian-next-toc/issues/118)

### 🐛 Bug Fixes

-   **view:** 避免自动激活并注释 revealLeaf 调用 (#117) ([a0e0790](https://github.com/RavenHogWarts/obsidian-next-toc/commit/a0e079084342f1bb5bad450fb52877a3d3d7057a)), closes [#117](https://github.com/RavenHogWarts/obsidian-next-toc/issues/117)

## [1.2.3](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.2.2...1.2.3) (2025-12-08)

### 🐛 Bug Fixes

-   基于 frontmatter 支持按页控制 TOC 展开 (#115) ([1451287](https://github.com/RavenHogWarts/obsidian-next-toc/commit/14512876e727f3467d1be438402af91cebbe2eaa)), closes [#115](https://github.com/RavenHogWarts/obsidian-next-toc/issues/115)

## [1.2.2](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.2.1...1.2.2) (2025-12-07)

### ♻️ Refactor

-   移除悬浮目录的黑名单功能 (#109) ([203ad5f](https://github.com/RavenHogWarts/obsidian-next-toc/commit/203ad5fcf1033aece8d1f8786418a469f1c8c884)), closes [#109](https://github.com/RavenHogWarts/obsidian-next-toc/issues/109)
-   移除重复的黑名单判断并直接使用设置值 (#110) ([c4e3a60](https://github.com/RavenHogWarts/obsidian-next-toc/commit/c4e3a60c8b4c2dc76388491a1fcc7eb11389d0b8)), closes [#110](https://github.com/RavenHogWarts/obsidian-next-toc/issues/110)

### ✨ Features

-   引入多个 Hook 重构目录组件逻辑 (#111) ([547329c](https://github.com/RavenHogWarts/obsidian-next-toc/commit/547329c4eff44f38c828be395f09c1b8ba0bb5e6)), closes [#111](https://github.com/RavenHogWarts/obsidian-next-toc/issues/111)
-   优化 NToc 视图初始化与生命周期 (#106) ([d7260e4](https://github.com/RavenHogWarts/obsidian-next-toc/commit/d7260e4842cdc2c8bf5564c7165666a2b3daef4c)), closes [#106](https://github.com/RavenHogWarts/obsidian-next-toc/issues/106)
-   优化侧边视图，添加阅读进度条 (#112) ([e2230c9](https://github.com/RavenHogWarts/obsidian-next-toc/commit/e2230c9e4a8f6e665ead77110e071b02cc005856)), closes [#112](https://github.com/RavenHogWarts/obsidian-next-toc/issues/112)

### 🎨 Styles

-   **toc:** 添加固定/取消固定目录的显示控制样式 (#108) ([9a7a021](https://github.com/RavenHogWarts/obsidian-next-toc/commit/9a7a021c42e8ab74b4b609b07fc497c14905cd26)), closes [#108](https://github.com/RavenHogWarts/obsidian-next-toc/issues/108)

### 🐛 Bug Fixes

-   修正目录面板器以匹新结构 (#114) ([cbcdda4](https://github.com/RavenHogWarts/obsidian-next-toc/commit/cbcdda4dacc5eab1b63ae21477b9a7baa13201a1)), closes [#114](https://github.com/RavenHogWarts/obsidian-next-toc/issues/114)

### 🔨 Chore

-   **release:** bump version to 1.2.2 (#113) ([2394015](https://github.com/RavenHogWarts/obsidian-next-toc/commit/239401571c49c1d2c2f415acff31a61528b6aad6)), closes [#113](https://github.com/RavenHogWarts/obsidian-next-toc/issues/113)

## [1.2.1](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.2.0...1.2.1) (2025-12-06)

### ✨ Features

-   增加黑名单管理，移除原有 css 控制个别文档的方式 (#104) ([6a3d040](https://github.com/RavenHogWarts/obsidian-next-toc/commit/6a3d040d0b3d23f31320d5dc7ddb64d5c5184c22)), closes [#104](https://github.com/RavenHogWarts/obsidian-next-toc/issues/104)

# [1.2.0](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.6...1.2.0) (2025-12-05)

### ♻️ Refactor

-   移除废弃组件与样式代码 (#101) ([ff2f0ee](https://github.com/RavenHogWarts/obsidian-next-toc/commit/ff2f0ee6f0317c3abe6c66490149153d4f634111)), closes [#101](https://github.com/RavenHogWarts/obsidian-next-toc/issues/101)
-   remove unnecessary service description comments ([d5d2d9c](https://github.com/RavenHogWarts/obsidian-next-toc/commit/d5d2d9c9c1133b8a41b83f726db516a6e6271ce4))

### ✨ Features

-   添加 Next TOC 视图 (#102) ([1dbdb7f](https://github.com/RavenHogWarts/obsidian-next-toc/commit/1dbdb7f3ea1d4fd68f7f38c1765c9c8af8858132)), closes [#102](https://github.com/RavenHogWarts/obsidian-next-toc/issues/102)
-   添加“单一标题时显示目录”设置 (#100) ([9f36f63](https://github.com/RavenHogWarts/obsidian-next-toc/commit/9f36f639f5263d42ba18256eaae6d4dd9c610943)), closes [#100](https://github.com/RavenHogWarts/obsidian-next-toc/issues/100)

### 🐛 Bug Fixes

-   **ui:** 优化目录导航与按钮的响应式行为 (#99) ([eee9ce9](https://github.com/RavenHogWarts/obsidian-next-toc/commit/eee9ce91311b42b265bf60624b0bc2190285a0ef)), closes [#99](https://github.com/RavenHogWarts/obsidian-next-toc/issues/99)

### 🔨 Chore

-   **funding:** 添加自定义资助链接 (#97) ([985049e](https://github.com/RavenHogWarts/obsidian-next-toc/commit/985049e50dc4e69f90e108a12b5123481b03c13f)), closes [#97](https://github.com/RavenHogWarts/obsidian-next-toc/issues/97)

## [1.1.6](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.5...1.1.6) (2025-11-10)

### ✨ Features

-   启用 CM6 光标监听扩展 (#92) ([4333bc6](https://github.com/RavenHogWarts/obsidian-next-toc/commit/4333bc69e86a2aec21aaa98383e8d09b7f23d737)), closes [#92](https://github.com/RavenHogWarts/obsidian-next-toc/issues/92)

### 🐛 Bug Fixes

-   解决插件上架修改建议 (#91) ([d6b7401](https://github.com/RavenHogWarts/obsidian-next-toc/commit/d6b74017a46a2007b48f6f6cb60818570c8c1b1b)), closes [#91](https://github.com/RavenHogWarts/obsidian-next-toc/issues/91)

### 📝 Documentation

-   更新安装和许可 (#89) ([0ce9dcb](https://github.com/RavenHogWarts/obsidian-next-toc/commit/0ce9dcbfad567e99efe5ed941d4d742262b21b13)), closes [#89](https://github.com/RavenHogWarts/obsidian-next-toc/issues/89)

## [1.1.5](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.4...1.1.5) (2025-11-07)

### ♻️ Refactor

-   重命名并统一 ObsidianSetting 组件变量 (#83) ([95b3767](https://github.com/RavenHogWarts/obsidian-next-toc/commit/95b37678411c55d665a1cb797af62e3b2137cbba)), closes [#83](https://github.com/RavenHogWarts/obsidian-next-toc/issues/83)
-   **settings:** 拆分设置页独立选项卡组件 (#80) ([b53bfa7](https://github.com/RavenHogWarts/obsidian-next-toc/commit/b53bfa742d6453ad899490d367e99989ecf0e7db)), closes [#80](https://github.com/RavenHogWarts/obsidian-next-toc/issues/80)

### ✨ Features

-   为 TOC 工具添加国际化文案 (#84) ([f2eb1ac](https://github.com/RavenHogWarts/obsidian-next-toc/commit/f2eb1ac560bd74d9a86f7dbd9c8dfc06585aeb9e)), closes [#84](https://github.com/RavenHogWarts/obsidian-next-toc/issues/84)
-   引入 Markdown 渲染服务并在目录项中使用 (#82) ([6b9a358](https://github.com/RavenHogWarts/obsidian-next-toc/commit/6b9a358310fd5436395d6e676cc91e405d32baf0)), closes [#82](https://github.com/RavenHogWarts/obsidian-next-toc/issues/82)
-   **settings:** 添加“导航按钮组”设置分组 (#79) ([7887a4f](https://github.com/RavenHogWarts/obsidian-next-toc/commit/7887a4f3d0d16bb004504754a881f4146dd7dd83)), closes [#79](https://github.com/RavenHogWarts/obsidian-next-toc/issues/79)

### 🐛 Bug Fixes

-   样式相关修复和改进 (#75) ([9230cfc](https://github.com/RavenHogWarts/obsidian-next-toc/commit/9230cfcbd6dfcff1771d1527684776b4efb3feeb)), closes [#75](https://github.com/RavenHogWarts/obsidian-next-toc/issues/75)
-   优化目录容器样式与偏移变量设置 (#77) ([6c6bc72](https://github.com/RavenHogWarts/obsidian-next-toc/commit/6c6bc72408eafcf3b836530c0e3e4de5e89d1165)), closes [#77](https://github.com/RavenHogWarts/obsidian-next-toc/issues/77)
-   支持跳过一级标题并修正依赖 (#86) ([dd90897](https://github.com/RavenHogWarts/obsidian-next-toc/commit/dd90897b7a7066a66664b7595e2649e87bdb3b14)), closes [#86](https://github.com/RavenHogWarts/obsidian-next-toc/issues/86)

### 🔧 CI

-   **security:** 强化 PR 构建安全检查逻辑 (#76) ([d53626f](https://github.com/RavenHogWarts/obsidian-next-toc/commit/d53626f7476486a7a5f5811aecbb21b6fc4311b6)), closes [#76](https://github.com/RavenHogWarts/obsidian-next-toc/issues/76)

### 🔨 Chore

-   **deps:** 升级依赖并清理类型注释 (#81) ([1a291f4](https://github.com/RavenHogWarts/obsidian-next-toc/commit/1a291f4975a543092c943316a18a88b9f63ddba2)), closes [#81](https://github.com/RavenHogWarts/obsidian-next-toc/issues/81)

## [1.1.4](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.3...1.1.4) (2025-10-28)

### ✨ Features

-   拆分并支持两种进度显示方式 (#69) ([d880956](https://github.com/RavenHogWarts/obsidian-next-toc/commit/d880956f9fc996df393ab15e7c7d7d00af80af0f)), closes [#69](https://github.com/RavenHogWarts/obsidian-next-toc/issues/69)
-   **toc:** 优化目录定位与渲染以避免闪烁 (#71) ([f484e81](https://github.com/RavenHogWarts/obsidian-next-toc/commit/f484e81834f9d94f89f18590535679363ad627b3)), closes [#71](https://github.com/RavenHogWarts/obsidian-next-toc/issues/71)

### 🎨 Styles

-   **css:** 移除多余的 z-index 以简化层级 (#70) ([a54338a](https://github.com/RavenHogWarts/obsidian-next-toc/commit/a54338ada4beb03b5f193f74c6dd0a952d89f0a0)), closes [#70](https://github.com/RavenHogWarts/obsidian-next-toc/issues/70)

## [1.1.3](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.2-beta.9...1.1.3) (2025-10-28)

### ♻️ Refactor

-   注释掉卡片相关功能并移除部分导入 (#66) ([999e776](https://github.com/RavenHogWarts/obsidian-next-toc/commit/999e77657d803b1c695fef765da71a60cc93c862)), closes [#66](https://github.com/RavenHogWarts/obsidian-next-toc/issues/66)

### ✨ Features

-   统一命名为驼峰命令键 (#65) ([2a7f081](https://github.com/RavenHogWarts/obsidian-next-toc/commit/2a7f081e400b166025bd3dfb98211ee69fc993de)), closes [#65](https://github.com/RavenHogWarts/obsidian-next-toc/issues/65)

### 🎨 Styles

-   注释浮动进度圆的位置样式 (#63) ([453e59d](https://github.com/RavenHogWarts/obsidian-next-toc/commit/453e59dffe8e5b3538a40a248b73c43cfecf012d)), closes [#63](https://github.com/RavenHogWarts/obsidian-next-toc/issues/63)

### 🐛 Bug Fixes

-   在渲染 Markdown 时正确设置标题文本 (#64) ([0f49744](https://github.com/RavenHogWarts/obsidian-next-toc/commit/0f49744bdc8eec1753bd78c4a941a680b716d798)), closes [#64](https://github.com/RavenHogWarts/obsidian-next-toc/issues/64)

## [1.1.2-beta.9](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.2-beta.8...1.1.2-beta.9) (2025-10-16)

### ✨ Features

-   增加进度圆环，优化移动端部分显示 (#61) ([6db91c2](https://github.com/RavenHogWarts/obsidian-next-toc/commit/6db91c2f97aea48977229e5f432f854260abaeb3)), closes [#61](https://github.com/RavenHogWarts/obsidian-next-toc/issues/61)

## [1.1.2-beta.8](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.2-beta.7...1.1.2-beta.8) (2025-10-13)

### ✨ Features

-   添加换展开目录的命令 (#58) ([b88916a](https://github.com/RavenHogWarts/obsidian-next-toc/commit/b88916a172dfe24fc5a520e42583e55efd30409e)), closes [#58](https://github.com/RavenHogWarts/obsidian-next-toc/issues/58)
-   完成翻译支持 (#59) ([f856b6b](https://github.com/RavenHogWarts/obsidian-next-toc/commit/f856b6bce817eb60cbf413dba923be139a1c89fc)), closes [#59](https://github.com/RavenHogWarts/obsidian-next-toc/issues/59)

## [1.1.2-beta.7](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.2-beta.6...1.1.2-beta.7) (2025-10-09)

### ✨ Features

-   beta 版本允许在移动端使用 (#56) ([bf57664](https://github.com/RavenHogWarts/obsidian-next-toc/commit/bf5766441556c6d4170168211607cc8224a4fdb8)), closes [#56](https://github.com/RavenHogWarts/obsidian-next-toc/issues/56)
-   **toc:** 根据设置条件渲染目录工具栏 (#55) ([8e6734c](https://github.com/RavenHogWarts/obsidian-next-toc/commit/8e6734c160c8d7d3ec13739513a718266ceabcb0)), closes [#55](https://github.com/RavenHogWarts/obsidian-next-toc/issues/55)

## [1.1.2-beta.6](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.2-beta.5...1.1.2-beta.6) (2025-09-18)

### 🐛 Bug Fixes

-   **toc:** 扩展 TOC 工具栏 hover 区域防止闪烁 (#52) ([b21ba60](https://github.com/RavenHogWarts/obsidian-next-toc/commit/b21ba60fbaa3b1e256fe7f949a1a97602c1ae63b)), closes [#52](https://github.com/RavenHogWarts/obsidian-next-toc/issues/52)

## [1.1.2-beta.5](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.2-beta.4...1.1.2-beta.5) (2025-09-18)

### ✨ Features

-   优化目录指示器布局 (#49) ([45b6874](https://github.com/RavenHogWarts/obsidian-next-toc/commit/45b6874174d847ccb347396e1b642b39cfb5f329)), closes [#49](https://github.com/RavenHogWarts/obsidian-next-toc/issues/49)

### 🐛 Bug Fixes

-   修复折叠逻辑，调整设置框尺寸 (#50) ([24b7e07](https://github.com/RavenHogWarts/obsidian-next-toc/commit/24b7e07a1148b9380e156da8ab4896f31e5c8d9e)), closes [#50](https://github.com/RavenHogWarts/obsidian-next-toc/issues/50)

## [1.1.2-beta.4](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.2-beta.3...1.1.2-beta.4) (2025-09-17)

### ✨ Features

-   卡片样式设置增加 css 联想补全 (#47) ([874bcf7](https://github.com/RavenHogWarts/obsidian-next-toc/commit/874bcf7356e7f40107be40258f00a4c82329944d)), closes [#47](https://github.com/RavenHogWarts/obsidian-next-toc/issues/47)

## [1.1.2-beta.3](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.2-beta.2...1.1.2-beta.3) (2025-09-17)

### ✨ Features

-   完善卡片插入功能，优化目录部分功能 (#45) ([c7dcfed](https://github.com/RavenHogWarts/obsidian-next-toc/commit/c7dcfed7d335f157037ac1e451ef7e4ba55b2eb0)), closes [#45](https://github.com/RavenHogWarts/obsidian-next-toc/issues/45)

## [1.1.2-beta.2](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.2-beta.1...1.1.2-beta.2) (2025-09-17)

### ✨ Features

-   增加导航指示器 (#43) ([3701381](https://github.com/RavenHogWarts/obsidian-next-toc/commit/3701381a4aacbc1dd7c2e17f91e04bea978462dd)), closes [#43](https://github.com/RavenHogWarts/obsidian-next-toc/issues/43)

### 🔧 CI

-   **pr:** 在 PR 关闭时清理构建产物 (#41) ([9e845bd](https://github.com/RavenHogWarts/obsidian-next-toc/commit/9e845bd1b7f14e9eb92ef66f919ca00346accc17)), closes [#41](https://github.com/RavenHogWarts/obsidian-next-toc/issues/41)

## [1.1.2-beta.1](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.2...1.1.2-beta.1) (2025-09-16)

### ✨ Features

-   **cards:** 添加阅读时长与目录卡片类型及组件 (#36) ([ea2783d](https://github.com/RavenHogWarts/obsidian-next-toc/commit/ea2783dd62221efc07f68db8a23553f5ed39f3f9)), closes [#36](https://github.com/RavenHogWarts/obsidian-next-toc/issues/36)

## [1.1.2](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.1...1.1.2) (2025-09-05)

### ✨ Features

-   ui 样式优化 (#30) ([6c7523e](https://github.com/RavenHogWarts/obsidian-next-toc/commit/6c7523e5c922904ebcf715f0ba57bcd446d8fb08)), closes [#30](https://github.com/RavenHogWarts/obsidian-next-toc/issues/30)

### 🐛 Bug Fixes

-   调整返回按钮图标尺寸与对齐 (#32) ([d836cb4](https://github.com/RavenHogWarts/obsidian-next-toc/commit/d836cb4c0a9dcfd0a61066e1b99e7900f106c438)), closes [#32](https://github.com/RavenHogWarts/obsidian-next-toc/issues/32)
-   **css:** 修正目录组件的选择器以匹配容器类名 (#31) ([cc4fa6d](https://github.com/RavenHogWarts/obsidian-next-toc/commit/cc4fa6d0353441315ed29096b9dd34c8686c101d)), closes [#31](https://github.com/RavenHogWarts/obsidian-next-toc/issues/31)
-   **toc:** 修复重复的 markdown 渲染 (#29) ([b828373](https://github.com/RavenHogWarts/obsidian-next-toc/commit/b8283739b341212d6b37a21b48b6e0ae65b4bc7c)), closes [#29](https://github.com/RavenHogWarts/obsidian-next-toc/issues/29)

### 🔧 CI

-   在 PR 合并后自动清理构建产物并更新权限 (#33) ([0a06f75](https://github.com/RavenHogWarts/obsidian-next-toc/commit/0a06f757410cfb3d10eb43c79d938d39a8438336)), closes [#33](https://github.com/RavenHogWarts/obsidian-next-toc/issues/33)

## [1.1.1](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.1.0...1.1.1) (2025-09-03)

### ✨ Features

-   添加导航与滚动命令并导入对应工具 (#24) ([01081b9](https://github.com/RavenHogWarts/obsidian-next-toc/commit/01081b942921bae919628f9e2bdfea5d4fcde2f1)), closes [#24](https://github.com/RavenHogWarts/obsidian-next-toc/issues/24)

# [1.1.0](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.0.1...1.1.0) (2025-09-03)

### ✨ Features

-   对特定页面中目录的单独控制 (#19) ([83870f4](https://github.com/RavenHogWarts/obsidian-next-toc/commit/83870f406955711f5ea1e735ad01205d6d77e58a)), closes [#19](https://github.com/RavenHogWarts/obsidian-next-toc/issues/19)
-   为目录项增加 Markdown 渲染 (#20) ([298cc6e](https://github.com/RavenHogWarts/obsidian-next-toc/commit/298cc6e5fb6b0b8906d4b5946857fffa0fcf0e49)), closes [#20](https://github.com/RavenHogWarts/obsidian-next-toc/issues/20)
-   新增悬停动画，移动端响应式布局 (#13) ([8004b20](https://github.com/RavenHogWarts/obsidian-next-toc/commit/8004b209e3817fdb29d048cf209032890a5e3a82)), closes [#13](https://github.com/RavenHogWarts/obsidian-next-toc/issues/13)
-   增加返回按钮组 (#21) ([7ba04e7](https://github.com/RavenHogWarts/obsidian-next-toc/commit/7ba04e793b610fd2c02f0f05940ff71eb93002e7)), closes [#21](https://github.com/RavenHogWarts/obsidian-next-toc/issues/21)

### 🐛 Bug Fixes

-   修复按钮工具的展开方向 (#22) ([8e7a5bd](https://github.com/RavenHogWarts/obsidian-next-toc/commit/8e7a5bda3353be56a3865f147f5e533acd1a1dc6)), closes [#22](https://github.com/RavenHogWarts/obsidian-next-toc/issues/22)
-   修复标题编号生成逻辑 (#15) ([83998ed](https://github.com/RavenHogWarts/obsidian-next-toc/commit/83998ed67d6b7709675a6433a0ec992f8eb8977e)), closes [#15](https://github.com/RavenHogWarts/obsidian-next-toc/issues/15)
-   修复部分已知样式问题 (#18) ([1b6ad77](https://github.com/RavenHogWarts/obsidian-next-toc/commit/1b6ad77f47255eb27bb74887f60391f602a33f8b)), closes [#18](https://github.com/RavenHogWarts/obsidian-next-toc/issues/18)

## [1.0.1](https://github.com/RavenHogWarts/obsidian-next-toc/compare/1.0.0...1.0.1) (2025-08-26)

### ✨ Features

-   为目录工具栏按钮添加无障碍 aria-label (#11) ([a720190](https://github.com/RavenHogWarts/obsidian-next-toc/commit/a7201902e98ad625059784579d32739acee0cda7)), closes [#11](https://github.com/RavenHogWarts/obsidian-next-toc/issues/11)
-   新增图标选择器组件 (#9) ([db1a9d3](https://github.com/RavenHogWarts/obsidian-next-toc/commit/db1a9d32d5bf2a1b19f74f7a9296b58896275aa9)), closes [#9](https://github.com/RavenHogWarts/obsidian-next-toc/issues/9)

### 🐛 Bug Fixes

-   修复 TOC 宽度异常 (#10) ([7c11fed](https://github.com/RavenHogWarts/obsidian-next-toc/commit/7c11fed7324f95edb999cdc63627ec374ace49a9)), closes [#10](https://github.com/RavenHogWarts/obsidian-next-toc/issues/10)

### 🔨 Chore

-   移除调试用 console.log 输出 (#8) ([089a24f](https://github.com/RavenHogWarts/obsidian-next-toc/commit/089a24f84d0a6ff05e0f9f4832947b4eb752b725)), closes [#8](https://github.com/RavenHogWarts/obsidian-next-toc/issues/8)

# 1.0.0 (2025-08-25)

### ✨ Features

-   从 https://github.com/RavenHogWarts/obsidian-ravenhogwarts-toolkit 中分离迁移 (#3) ([83c213e](https://github.com/RavenHogWarts/obsidian-next-toc/commit/83c213e2f240991945b92ea03579f508738001e4))

### 🔧 CI

-   优化 PR 构建名称和时间 (#4) ([8770264](https://github.com/RavenHogWarts/obsidian-next-toc/commit/8770264ec2b0a14804b19ca94b70cacead6938f6)), closes [#4](https://github.com/RavenHogWarts/obsidian-next-toc/issues/4)

### 🔨 Chore

-   初始化插件 id ([8b159d8](https://github.com/RavenHogWarts/obsidian-next-toc/commit/8b159d8184ff2a7acfec734ceaa1965f8668d0e9))
