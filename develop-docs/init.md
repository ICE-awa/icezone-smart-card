# 项目开发计划书 V4.2 - Part 1: 【超详细】准备工作与项目结构
## 项目名称：冰域学习卡片 (Ice-Field Learning Cards)

---

### **第一部分：开发前的准备工作 (Pre-development Preparation)**

这一阶段是整个项目的地基，其质量决定了上层建筑的稳固程度。我们将细化到每一个操作和每一个决策。

#### **1.1 项目核心目标与新增功能**
* **项目名称:** 冰域学习卡片
* **核心目标:** 保持不变，即打造一个基于SM-2算法的个性化AI学习平台。
* **新增核心功能:**
    * **管理员能力增强:** 管理员不仅可以逐一增删用户，还必须能通过上传或粘贴**JSON数据**的方式，**批量新增**或**批量删除**用户。

#### **1.2 AI算法的深入理解 (SM-2)**
* **核心认知:** SM-2是**算法**，不是**模型**。它不消耗计算资源，我们要做的是在Java代码中**实现**其计算逻辑。
* **算法工作流:**
    1.  **输入:** 用户对卡片的评价`q` (0-5分)。
    2.  **映射:** 将前端用户的操作（如点击“忘记了”、“答对了”）映射为具体的`q`值。
    3.  **计算:** 在后端严格按照SM-2的公式，更新卡片的`简单系数(EF)`、`复习次数(n)`和`复习间隔(I)`。
    4.  **输出:** 将新的进度状态持久化到数据库中。
* **开发任务:** 在后端`service`层编写一个纯粹的计算方法，严格实现上述流程。

#### **1.3 【新增】关键数据结构预定义**
在开发前，我们必须先定义好批量操作的数据格式。

* **JSON批量新增用户模板:**
    * 管理员需要按照此格式准备JSON文件或文本。
    * **格式:** 一个包含多个用户对象的数组。
    * **字段:**
        * `username` (string, 必填): 新用户的用户名。
        * `password` (string, 必填): 新用户的初始密码。
        * `role` (string, 可选, 默认为'USER'): 'USER' 或 'ADMIN'。
    * **示例 (`bulk-add-users.json`):**
      ```json
      [
        {
          "username": "student_a",
          "password": "password123",
          "role": "USER"
        },
        {
          "username": "teacher_b",
          "password": "password456",
          "role": "USER"
        },
        {
          "username": "assistant_c",
          "password": "password789",
          "role": "ADMIN"
        }
      ]
      ```

* **JSON批量删除用户模板:**
    * **格式:** 一个包含用户唯一标识符的数组。使用`username`作为标识符比`id`更方便管理员操作。
    * **示例 (`bulk-delete-users.json`):**
      ```json
      {
        "usernames": [
          "student_a",
          "teacher_b"
        ]
      }
      ```

#### **1.4 环境安装与配置指南（SOP版）**
为保证环境一致性，请严格按照以下步骤操作。

* **1. Git (版本控制):**
    * **作用:** 代码的“时光机”和“保险柜”。
    * **安装:** 从 [Git官网](https://git-scm.com/downloads/) 下载安装。
    * **配置:** 打开命令行/终端，执行以下命令设置你的身份：
      ```bash
      git config --global user.name "Your Name"
      git config --global user.email "your.email@example.com"
      ```

* **2. GitHub 仓库创建:**
    
    * **作用:** 远程代码托管，便于备份和未来可能的协作。
    * **操作:** 在 [GitHub](https://github.com) 官网创建一个新的仓库，命名为 `icezone-smart-card-demo`。将其设置为私有(Private)。创建后，复制仓库的URL。
    
* **3. Node.js & npm (前端环境):**
    * **作用:** 运行和构建React应用。
    * **安装:** 从 [Node.js官网](https://nodejs.org/) 下载 **LTS (长期支持)** 版本。
    * **验证:** 安装后，在命令行执行 `node -v` 和 `npm -v`，看到版本号即表示成功。

* **4. JDK & Maven (后端环境):**
    * **作用:** 编译、运行和管理Java项目。
    * **安装:**
        * **JDK:** 推荐安装 **Java 17 (LTS)**。配置好 `JAVA_HOME` 环境变量。
        * **Maven:** 从 [Maven官网](https://maven.apache.org/) 下载解压，并配置好 `MAVEN_HOME` 和 `Path` 环境变量。
    * **验证:** 分别执行 `java --version` 和 `mvn -v` 检查安装情况。

* **5. MySQL & Workbench (数据库):**
    * **作用:** 我们平台的“户口本”和“记忆库”。
    * **安装:** 从 [MySQL官网](https://dev.mysql.com/downloads/installer/) 下载社区版安装器。**务必牢记安装过程中设置的 `root` 用户密码。** 强烈建议一同安装 **MySQL Workbench**，这是我们管理数据库的“可视化驾驶舱”。

* **6. Docker Desktop (容器化):**
    * **作用:** 项目的“星际运输舰”，将所有服务打包，实现一键部署。
    * **安装:** 从 [Docker官网](https://www.docker.com/products/docker-desktop/) 下载安装，并确保其在后台运行。

---

### **第二部分：【超详细】项目目录结构深度解析**

一个清晰的目录结构就像一个设计精密的蓝图，让开发者能快速定位到需要修改的代码。

````

icezone-smart-card-demo/      \# 项目根目录，将作为我们的Git仓库
│
├── .github/                     \# (可选) 用于存放GitHub Actions等CI/CD配置
│
├── backend/                     \# SpringBoot 后端项目
│   ├── pom.xml                  \# 核心依赖管理文件。将在这里添加Spring, JPA, Security, MySQL, JWT等依赖
│   └── src/
│       ├── main/
│       │   ├── java/com/bingyu/learningcards/ \# 使用新项目名作为包名
│       │   │   ├── config/      \# 全局配置，如SecurityConfig.java
│       │   │   ├── controller/  \# API接口层
│       │   │   │   └── AdminController.java \# 将新增/api/admin/users/batch-add等批量处理接口
│       │   │   ├── dto/         \# 数据传输对象。将新增如UserBulkCreateDto.java来接收批量创建的JSON数据
│       │   │   ├── entity/      \# 数据库实体类
│       │   │   ├── exception/   \# 全局异常处理器
│       │   │   ├── repository/  \# 数据访问层接口
│       │   │   └── service/     \# 核心业务逻辑层。将新增处理批量用户操作的业务方法
│       │   └── resources/
│       │       └── application.yml \# 核心配置文件
│
├── frontend/                    \# React 前端项目
│   ├── package.json             \# 前端依赖清单
│   ├── .env                     \# 存放API服务器地址等环境变量
│   └── src/
│       ├── api/                 \# API请求层
│       ├── assets/              \# 静态资源
│       ├── components/          \# 可复用UI组件
│       │   └── admin/           \# (新增) 管理员专用组件
│       │       └── UserBulkManager.jsx \# (新增) 用于批量增删用户的模态框或独立组件
│       ├── hooks/               \# 自定义React Hooks
│       ├── pages/               \# 页面级组件
│       │   └── admin/
│       │       └── UserManagementPage.jsx \# 将在此页面集成单用户和批量JSON管理功能
│       ├── routes/              \# 路由配置
│       └── services/            \# 全局状态管理 (Zustand store)
│
├── database/                    \# 数据库脚本
│   └── init.sql                 \# 包含所有表结构创建和初始管理员账户注入的脚本
│
├── 🐳 docker-compose.yml        \# Docker编排文件
│
└── 📝 README.md                  \# 项目的“说明书”，必须包含新名称“冰域学习卡片”

```

`````