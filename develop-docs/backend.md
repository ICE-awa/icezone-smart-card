# 项目开发计划书 V4.2 - Part 3: 【超详细】后端开发实施方案 (SpringBoot)
## 项目名称：冰域学习卡片 (icezone-smart-card)

---

### **第四部分：后端开发 (SpringBoot)**

后端是整个平台的引擎和大脑，负责数据处理、业务逻辑和安全。我们将采用分层架构（Controller-Service-Repository），确保代码的高内聚、低耦合。

#### **阶段 4.1: 项目初始化与数据库实体映射 (地基与钢筋)**

1.  **使用Spring Initializr创建项目:**
    * 访问 [start.spring.io](https://start.spring.io/)。
    * **Project:** Maven
    * **Language:** Java
    * **Spring Boot:** 推荐 3.x.x 版本
    * **Project Metadata:**
        * **Group:** `com.icezone`
        * **Artifact:** `smartcard`
        * **Name:** `icezone-smart-card`
        * **Package name:** `com.icezone.smartcard`
        * **Packaging:** Jar
        * **Java:** 17
    * **Dependencies (核心依赖):**
        * Spring Web: 构建RESTful API。
        * Spring Data JPA: 简化数据库访问。
        * Spring Security: 处理认证和授权。
        * MySQL Driver: 连接MySQL数据库。
        * Lombok: 减少Java样板代码。
        * Validation: 支持DTO数据校验。
        * Spring Boot DevTools: 提供热加载等开发便利。

2.  **配置 `application.yml`:**
    * 在 `src/main/resources/` 目录下，配置数据库连接和JPA行为。
    ```yaml
    server:
      port: 8080
    
    spring:
      datasource:
        url: jdbc:mysql://localhost:3306/smart_cards_db?useSSL=false&serverTimezone=JST
        username: root
        password: [你的MySQL root密码]
        driver-class-name: com.mysql.cj.jdbc.Driver
      jpa:
        hibernate:
          ddl-auto: validate # 开发初期可设为update，生产环境设为validate或none
        show-sql: true # 开发时开启，方便调试
        properties:
          hibernate:
            format_sql: true
    ```

3.  **创建JPA实体类 (Entity):**
    * 在 `com.icezone.smartcard.entity` 包下，为每个数据库表创建精确映射的Java类，并使用Lombok的 `@Data` 等注解简化代码。

#### **阶段 4.2: 安全框架与用户认证 (平台的门禁与安保系统)**

1.  **引入JWT依赖:**
    * 在 `pom.xml` 中，手动添加处理JWT的库：
    ```xml
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    ```

2.  **配置 `SecurityConfig.java`:**
    * 这是Spring Security的核心配置，定义了整个应用的安全规则。
    * **`SecurityFilterChain` Bean:**
        * **禁用CSRF和Session:** `http.csrf(csrf -> csrf.disable()).sessionManagement(...)`
        * **权限规则:** `http.authorizeHttpRequests(auth -> auth.requestMatchers("/api/auth/**").permitAll().requestMatchers("/api/admin/**").hasAuthority("ADMIN").anyRequest().authenticated())`
        * **添加JWT过滤器:** `http.addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class)`

3.  **实现JWT逻辑:**
    * **`JwtProvider.java`:** 创建一个服务，用于生成（`generateToken`）、解析和验证（`validateToken`, `getUsernameFromToken`）JWT。密钥（secret key）应配置在`application.yml`中。
    * **`JwtAuthenticationFilter.java`:** 自定义过滤器，在`doFilterInternal`方法中实现从请求头提取->验证->构建`Authentication`对象->放入`SecurityContextHolder`的完整流程。

4.  **实现认证接口 (`AuthController.java`):**
    * 提供`/register`和`/login`接口。`login`接口在验证成功后，调用`JwtProvider`生成token并返回给前端。

#### **阶段 4.3: 核心业务与高级功能API实现 (平台的大脑)**

1.  **SM-2算法服务 (`SpacedRepetitionService.java`):**
    * 创建一个独立的、无状态的服务类，实现SM-2算法的纯计算逻辑。

2.  **高级功能API实现 (管理员批量操作):**
    * **DTOs (数据传输对象):** 在`com.icezone.smartcard.dto.admin`包下创建：
        * `UserBulkCreateRequestDto.java`: 包含`@NotBlank`等校验注解的`username`, `password`, `role`字段。
        * `UserBulkDeleteRequestDto.java`: 包含一个`List<String> usernames`。
    * **`AdminController.java` (新增接口):**
        ```java
        // ... 其他管理员接口
        @PostMapping("/users/batch-add")
        public ResponseEntity<?> bulkAddUsers(@Valid @RequestBody List<UserBulkCreateRequestDto> usersToAdd) {
            // ... 调用service
        }
        
        @PostMapping("/users/batch-delete")
        public ResponseEntity<?> bulkDeleteUsers(@Valid @RequestBody UserBulkDeleteRequestDto usersToDelete) {
            // ... 调用service
        }
        ```
    * **`AdminService.java` (新增核心逻辑):**
        * **`bulkAddUsers(...)`:**
            * 必须使用 `@Transactional` 注解，保证操作的原子性。
            * 遍历DTO列表，对每个用户：
                1. 检查用户名是否已存在 (`userRepository.existsByUsername`)。
                2. 对密码进行BCrypt加密 (`passwordEncoder.encode`)。
                3. 创建并保存新的`User`实体。
            * 若中途有任何用户已存在，则应抛出异常，整个事务回滚。
        * **`bulkDeleteUsers(...)`:**
            * 使用 `@Transactional`。
            * 直接调用 `userRepository.deleteByUsernameIn(usersToDelete.getUsernames())`。Spring Data JPA支持这种高效的批量删除方法。

#### **阶段 4.4: 全局异常处理与日志记录 (平台的健康监控系统)**

1.  **`GlobalExceptionHandler.java`:**
    * 使用 `@RestControllerAdvice` 创建一个全局异常处理器。
    * **必须处理的异常:**
        * `MethodArgumentNotValidException`: 处理DTO校验失败，返回400。
        * `DataIntegrityViolationException`: 处理数据库约束冲突（如用户名重复），返回409。
        * `AccessDeniedException`: 处理权限不足，返回403。
        * 自定义的`ResourceNotFoundException`: 返回404。

2.  **日志记录 (Logging):**
    * 在所有`Service`层和`Controller`层的关键方法入口、出口以及`catch`块中，使用SLF4J添加日志记录。
    * **示例:** `private static final Logger logger = LoggerFactory.getLogger(AdminService.class);`
    * **日志级别:**
        * `logger.info(...)`: 记录关键业务流程。
        * `logger.warn(...)`: 记录可预见的、非致命的异常情况。
        * `logger.error(...)`: 在`catch`块中记录所有未预料到的异常和错误信息。