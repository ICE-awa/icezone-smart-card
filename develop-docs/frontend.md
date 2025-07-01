# 项目开发计划书 V4.2 - Part 2: 【超详细】前端开发实施方案 (React)
## 项目名称：冰域学习卡片

---

### **第三部分：前端开发 (React)**

前端的核心目标是构建一个用户体验流畅、功能强大且易于维护的单页应用(SPA)。我们将全面拥抱 **TypeScript** 来保证代码的健壮性，并借助 **Ant Design** 作为我们的核心UI组件库，以实现专业、统一的视觉风格。

#### **阶段 3.1: 项目初始化与基础框架搭建 (地基工程)**

1.  **创建类型安全的React项目:**
    * 我们使用TypeScript模板，它能为我们的代码带来类型安全，在编译阶段就发现潜在的bug，这对于维护一个复杂的项目至关重要。
    * 打开命令行，执行：
      `npx create-react-app frontend --template typescript`

2.  **安装核心依赖:**
    * `cd frontend` 进入项目目录，然后执行：
      `npm install antd react-router-dom axios zustand dayjs`
    * `antd`: 核心UI组件库。
    * `react-router-dom`: 页面路由管理。
    * `axios`: 与后端API交互的HTTP客户端。
    * `zustand`: 轻量、现代的全局状态管理库。
    * `dayjs`: Ant Design v5 推荐的日期时间处理库。

3.  **目录结构化与清理:**
    * 删除 `src` 目录下自动生成的模板文件。
    * 在 `src` 下手动创建 `api`, `assets`, `components`, `hooks`, `pages`, `routes`, `services` (存放Zustand store), `types` (存放TypeScript类型定义) 等文件夹。

4.  **全局配置:**
    * 在 `src/App.tsx` 中，使用 Ant Design 的 `<ConfigProvider>` 包裹整个应用，用于配置全局主题（如主题色）。
    * 在 `src/index.tsx` 中，引入Ant Design的全局样式：`import 'antd/dist/reset.css';`

#### **阶段 3.2: 用户认证流程闭环 (门禁系统)**

1.  **全局状态 (`Zustand`):**
    * 在 `src/services/authStore.ts` 中创建 `useAuthStore`。
    * 定义store的类型接口，包含 `user: User | null`, `token: string | null`。
    * 实现 `login` 和 `logout` 动作，并与 `localStorage` 同步，确保页面刷新后登录状态不丢失。

2.  **API请求层封装:**
    * 在 `src/api/axiosInstance.ts` 中创建全局Axios实例。
    * **配置请求拦截器:** 在每个请求的 `Authorization` 头中自动附加上 `Bearer ${token}`。
    * **配置响应拦截器:** 统一处理API错误，特别是当后端返回401未授权时，自动调用 `logout` 并强制跳转到登录页。

3.  **页面实现 (`LoginPage.tsx`, `RegisterPage.tsx`):**
    * 使用 Ant Design 的 `<Form>` 组件，并利用其强大的表单校验功能。
    * 表单提交时调用封装好的API函数，并根据返回结果使用 Ant Design 的 `message.success()` 或 `message.error()` 给予用户即时反馈。

#### **阶段 3.3: 核心功能与高级管理界面开发 (主体建筑)**

1.  **受保护的路由 (`ProtectedRoute.tsx`):**
    * 创建此组件检查 `useAuthStore` 中的 `token`。这是实现页面访问权限控制的基石。

2.  **卡片创建与管理 (`CardCreator.tsx`, `DeckPage.tsx`):**
    * **卡片创建:** 使用 `<Modal>` 和 `<Tabs>` 组件实现“手动添加”与“JSON导入”的切换。手动模式下的表单需根据题型下拉框的选择，动态渲染不同的输入控件。
    * **卡片批量管理:** 在 `DeckPage.tsx` 中，使用 `<Table>` 组件的 `rowSelection` 属性实现卡片的多选。表格上方放置“批量操作”按钮组，当用户有选择时才激活。

#### **阶段 3.4: 管理员后台开发 (指挥中心)**

这是本次更新的重点，我们将为管理员打造一个高效的控制面板。

1.  **管理员路由 (`AdminRoute.tsx`):**
    * 在 `ProtectedRoute` 的基础上，进一步检查 `user.role` 是否为 `'ADMIN'`。

2.  **后台布局 (`AdminLayout.tsx`):**
    * 使用 Ant Design 的 `<Layout>`、`<Sider>`、`<Menu>` 组件，快速搭建出经典的后台管理界面布局。

3.  **用户管理页面 (`UserManagementPage.tsx`):**
    * **UI布局:** 页面顶部放置【新增用户】和【批量管理用户】两个核心操作按钮。下方是用户数据表格。
    * **单用户管理:** 表格的操作列提供“编辑”和“删除”功能，删除时必须使用 `<Popconfirm>` 进行二次确认。
    * **批量用户管理 (核心新增功能):**
        * 点击【批量管理用户】按钮，弹出一个新的模态框组件 `UserBulkManager.tsx`。
        * **模态框内部:** 使用 `<Tabs>` 分为 **【批量新增】** 和 **【批量删除】** 两个标签页。
        * **【批量新增】标签页:**
            * 提供一个大尺寸的 `<Input.TextArea>`，允许管理员粘贴符合预定义格式的JSON。
            * 文本域旁边，使用 `<Typography>` 和 `<pre>` 标签清晰地展示JSON格式要求和示例。
            * 提供“校验格式”按钮，点击后前端使用 `try-catch` 包裹 `JSON.parse()` 来检查格式是否正确，并给出提示。
            * 提供“执行新增”按钮，点击后调用后端的批量新增API。
        * **【批量删除】标签页:**
            * 同样提供一个文本输入区和格式示例。
            * “执行删除”按钮为红色警示色。点击后，必须弹出一个**醒目的二次确认对话框 (`Modal.confirm`)**，明确告知管理员将要删除的用户数量，并强调此操作的不可逆性。

#### **阶段 3.5: 优化与收尾 (精装修)**
* **全局加载状态:** 使用一个全局状态（或在每个页面内）来控制加载状态。当API请求发出时显示 `<Spin size="large" />`，请求完成时隐藏。
* **空状态与错误状态:** 当列表数据为空时，使用 Ant Design 的 `<Empty />` 组件进行友好展示。当发生严重错误时，使用 `<Result status="500" />` 等组件进行页面级的反馈。
* **响应式设计:** 使用 Ant Design 的栅格系统 (`<Row>`, `<Col>`) 来调整布局，确保在桌面和移动设备上都有良好的浏览体验。

#### **阶段 3.6: 用户主页/仪表盘 (`HomePage.tsx`)**

用户登录后看到的第一个页面，是他们的学习启动台。

* **页面目标:** 清晰地展示用户的所有卡片组、每个卡片组的学习进度，并提供清晰的“开始学习”入口。
* **后端API依赖:** 需要一个新的API端点，如 `GET /api/me/decks/stats`，它返回当前用户有权访问的所有卡片组列表，并且**为每个卡片组附带个性化的学习统计数据**（如总卡片数、该用户已学习数）。
* **UI组件设计 (Ant Design):**
    1.  **欢迎语:** 页面顶部是一个醒目的欢迎语，如 `<Typography.Title level={2}>欢迎回来, {user.username}!</Typography.Title>`。
    2.  **卡片组网格:** 使用 `<Row gutter={[16, 24]}>` 和 `<Col>` 组件创建一个响应式的网格布局。
    3.  **卡片组单元 (`DeckCard.tsx`):** 每个卡片组都是一个独立的 `<Card>` 组件，包含以下元素：
        * **标题:** `title` 属性显示卡片组名称，旁边用一个小号的灰色字体显示 `ID: {deck.id}`。
        * **统计数据:** 卡片内容区展示统计信息，如：
            * `总卡片数: {deck.totalCards}`
            * `我的进度: {deck.myLearnedCount} / {deck.totalCards}`
        * **进度条:** 使用 `<Progress percent={ (deck.myLearnedCount / deck.totalCards) * 100 } />` 组件，直观地展示学习进度。
        * **操作按钮:** 卡片的 `actions` 属性中放置两个核心按钮：
            * `<Button type="primary" icon={<PlayCircleOutlined />}>开始学习/复习</Button>`
            * `<Button icon={<SettingOutlined />}>管理卡片</Button>`
* **交互逻辑:**
    * 页面加载时 (`useEffect`)，调用API获取带统计数据的卡片组列表，并显示加载动画 (`<Spin>`)。
    * 点击“开始学习/复习”按钮，将 `deck.id` 作为参数，导航到核心学习页面 (`/study/{deck.id}`)。

#### **阶段 3.7: 核心学习页面 (`StudyPage.tsx`)**

这是用户进行沉浸式学习和复习的地方。

* **页面目标:** 提供一个无干扰、交互明确的学习环境，让用户能专注于卡片内容。
* **页面状态管理 (`useState`):**
    * `mode: 'LEARN' | 'REVIEW' | 'WRONG_BOOK'`：当前模式。
    * `currentCard: Card | null`：当前显示的卡片对象。
    * `isLoading: boolean`：是否正在从后端加载下一张卡片。
    * `sessionStats: { correct: number, incorrect: number }`：本次学习会话的统计。
* **UI组件设计:**
    1.  **页面头部:**
        * 使用 `<Breadcrumb>` 实现导航路径，如 `主页 > {deck.name} > 学习中`。
        * 右侧放置一个“结束学习”按钮和一个显示会话统计的小组件（例如 `已完成: {sessionStats.correct + sessionStats.incorrect} 张`）。
    2.  **模式切换器:** 页面核心区域的上方，放置一个 `<Radio.Group>` 组件，让用户可以在“学习模式”、“复习模式”、“错题本模式”之间切换。切换模式会立即触发API调用，获取新模式下的第一张卡片。
    3.  **卡片展示区:** 页面的视觉中心，完全由 `CardViewer.tsx` 组件占据。

#### **阶段 3.8: 卡片展示器组件 (`CardViewer.tsx`) - 应用的心脏**

这个组件是整个应用交互最复杂、最核心的部分。

* **组件职责:** 接收一个卡片对象 (`card`) 作为 `prop`，并根据其类型和状态，渲染出正确的UI，处理用户的作答交互，并将结果通过回调函数 `onAnswer` 传递给父组件 `StudyPage`。
* **内部状态管理 (`useState`):**
    * `isFlipped: boolean`: 控制卡片是否已“翻面”显示答案。
    * `userSelection: any`: 存储用户在选择题中的选项。
* **交互逻辑详解:**
    1.  **初始渲染:**
        * `isFlipped` 为 `false`。
        * 只显示问题区域 (`card.question`) 和卡片ID。
        * 显示一个主操作按钮 `<Button type="primary" size="large">显示答案</Button>`。
    2.  **“翻面”操作:**
        * 点击“显示答案”按钮后，设置 `isFlipped(true)`。
        * “显示答案”按钮消失。
        * 答案区域和作答反馈按钮组出现。
    3.  **根据 `card.card_type` 动态渲染作答区域 (当 `isFlipped` 为 `true` 时):**
        * **`case 'WORD':`**
            * 显示答案文本 `card.answer`。
            * 显示三个 `<Button>`：“忘记了”、“记住了”、“太简单”。`onClick` 事件分别调用 `onAnswer({ quality: 0 })`, `onAnswer({ quality: 4 })`, `onAnswer({ quality: 5 })`。
        * **`case 'CHOICE':`**
            * 显示 Ant Design 的 `<Radio.Group>` 或 `<Checkbox.Group>` 供用户选择，并将用户的选择绑定到 `userSelection` 状态。
            * 显示一个“提交答案”按钮。`onClick` 时，判断 `userSelection` 与 `card.answer` 是否一致，然后调用 `onAnswer({ isCorrect: true/false })`。同时，UI上可以高亮正确和错误选项作为即时反馈。
        * **`case 'TRUE_FALSE':`**
            * 显示两个大号的图标按钮：“✔ 正确” 和 “✖ 错误”。`onClick` 时，直接判断并调用 `onAnswer({ isCorrect: true/false })`。
* **流程闭环:**
    * `CardViewer` 通过 `onAnswer` 将作答结果传回给 `StudyPage`。
    * `StudyPage` 接收到结果后，立即调用后端的 `submitAnswer` API。
    * 同时，`StudyPage` 更新 `sessionStats`，并将 `isLoading` 设为 `true`。
    * `submitAnswer` API成功返回后，`StudyPage` 再次调用 `getNextCard` API获取下一张卡片，并将其传递给 `CardViewer`，开始新一轮的交互。