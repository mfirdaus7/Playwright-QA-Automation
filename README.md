# Playwright QA Automation

A hands-on QA Automation portfolio project built with **Playwright Test and JavaScript**. This project demonstrates API testing, authentication testing, database testing, UI automation, reusable test architecture, and cross-browser execution.

**Latest Test Results: 118 Passed**

## Tech Stack

- JavaScript (Node.js)
- Playwright Test
- SQLite
- better-sqlite3
- AJV – JSON Schema Validation
- dotenv – Environment Configuration
- GitHub Actions – CI
- Page Object Model (POM)

## Project Structure

```text
Playwright-QA-Automation/
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── api-clients/
│   ├── authApi.js
│   ├── postsApi.js
│   └── usersApi.js
│
├── fixtures/
│   ├── db-worker.fixture.js
│   ├── db.fixture.js
│   └── login.fixture.js
│
├── helpers/
│   ├── apiHelper.js
│   └── testHelper.js
│
├── pages/
│   ├── BasePage.js
│   └── LoginPage.js
│
├── schemas/
│   └── userSchema.js
│
├── test-data/
│   └── invalidUsers.js
│
├── tests/
│   ├── api/
│   │   ├── api-chaining.spec.js
│   │   ├── authentication.spec.js
│   │   ├── authorization.spec.js
│   │   ├── posts-api.spec.js
│   │   └── users-api.spec.js
│   │
│   ├── database/
│   │   ├── db-fixture.spec.js
│   │   ├── db-worker-fixture.spec.js
│   │   ├── db.js
│   │   ├── seed.js
│   │   └── users-db.spec.js
│   │
│   └── ui/
│       └── login.spec.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.js
└── README.md
```

## Test Coverage

### 1. API Testing

- GET, POST, PUT, PATCH and DELETE requests
- API response status validation
- Response body validation
- Request and response headers
- Negative API testing
- API chaining

### 2. Authentication Testing

- Login and access token retrieval
- Bearer token authentication
- Access token validation
- Invalid and missing access token scenarios
- Refresh token flow
- Refresh token rotation
- Invalid refresh token scenarios

### 3. Authorization and API Mocking

- Mocked HTTP 200, 401 and 403 responses
- Authorization header scenarios
- Negative authorization testing

**Note:** Authorization scenarios using mocked responses demonstrate client-side test handling. They do not prove real backend token authorization.

### 4. JSON Schema Validation

- AJV integration
- JSON response schema validation
- Data structure validation

### 5. SQLite Database Testing

- CRUD operations
- SQL queries
- INNER JOIN and LEFT JOIN
- GROUP BY and HAVING
- Aggregate functions
- Database transactions
- Commit and rollback
- Constraints and NULL validation
- Parameterized queries
- SQL injection prevention
- Negative database testing

### 6. UI Automation

Using [Practice Test Automation](https://practicetestautomation.com/practice-test-login/):

- Successful login
- Successful logout
- Invalid login scenarios
- Login page title validation

### 7. Test Architecture

- Page Object Model (POM)
- Reusable API client classes
- Custom Playwright fixtures
- Test-scoped and worker-scoped database fixtures
- Reusable helper functions
- Data-driven testing

### 8. Cross-Browser Testing

Configured Playwright projects:

- Chromium
- Firefox
- WebKit
- Dedicated database project

Database tests run separately to avoid unnecessary repetition across browser projects.

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Playwright-QA-Automation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Configure environment variables

Create a `.env` file in the project root and configure the environment variables required by the API clients.

Do not commit `.env` or expose API credentials.

### 5. Run tests

Run the complete test suite:

```bash
npx playwright test
```

Run API tests:

```bash
npx playwright test tests/api
```

Run database tests:

```bash
npx playwright test tests/database
```

Run UI tests:

```bash
npx playwright test tests/ui
```

Run UI tests on Chromium only:

```bash
npx playwright test tests/ui/login.spec.js --project=chromium
```

View HTML report:

```bash
npx playwright show-report
```

## Test Execution Results

**Latest local full-suite regression: 118 tests passed.**

The project is configured to execute UI and API tests across supported browser projects, with database tests running in a dedicated project.

## CI/CD

GitHub Actions workflow is configured to support automated Playwright test execution.

Workflow file:

```text
.github/workflows/playwright.yml
```

## Important Notes

- JSONPlaceholder simulates write operations; POST, PUT, PATCH and DELETE responses do not represent persistent database changes.
- Authorization mocking is used to test expected client-side responses.
- SQLite tests use isolated in-memory databases through custom fixtures.

## Author

**Software Testing & QA Automation Portfolio**

Built to demonstrate practical skills in JavaScript, Playwright, API testing, database testing, UI automation and test automation architecture.

**Firdaus**

Software Testing | QA Automation | Playwright

GitHub: https://github.com/mfirdaus7
