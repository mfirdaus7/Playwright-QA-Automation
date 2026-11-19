# Playwright QA Automation

A QA Automation portfolio project built with **Playwright Test and JavaScript**, covering REST API testing, authentication scenarios, API response validation, database testing, and cross-browser test execution.

**Latest Test Results: 100 Passed**

## Tech Stack

- JavaScript (Node.js)
- Playwright Test
- SQLite – Database Testing
- better-sqlite3 – SQLite Database Driver
- AJV – JSON Schema Validation
- REST API Testing
- API Client Pattern
- Git & GitHub
- GitHub Actions – CI/CD
- dotenv – Environment Configuration

## Project Structure

```text
Playwright-QA-Automation/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── api-clients/
│   ├── usersApi.js
│   ├── postsApi.js
│   └── authApi.js
├── fixtures/
│   ├── db.fixture.js
│   └── db-worker.fixture.js
├── helpers/
│   └── apiHelper.js
├── schemas/
│   └── userSchema.js
├── test-data/
│   └── invalidUsers.js
├── tests/
│   ├── api/
│   │   ├── users-api.spec.js
│   │   ├── posts-api.spec.js
│   │   ├── api-chaining.spec.js
│   │   ├── authorization.spec.js
│   │   └── authentication.spec.js
│   └── database/
│       ├── db-fixture.spec.js
│       ├── db-worker-fixture.spec.js
│       ├── users-db.spec.js
│       ├── db.js
│       └── seed.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── playwright.config.js
```

## Test Coverage

### 1. REST API Testing

- Retrieve user details using GET requests.
- Create resources using POST requests.
- Update resources using PUT and PATCH requests.
- Delete resources using DELETE requests.
- Validate HTTP response status codes and response bodies.
- Perform data-driven API testing.

### 2. API Response Validation

- Validate API responses using AJV and JSON Schema.
- Verify required properties and data types.
- Test invalid response data.
- Validate missing required properties.

### 3. API Chaining

- Create resources using POST requests.
- Extract resource IDs from API responses.
- Reuse returned IDs in subsequent requests.
- Perform PATCH and DELETE operations.
- Validate each response throughout the workflow.

### 4. Authentication & Authorization

- Perform API login and retrieve access tokens.
- Send authenticated requests using Bearer tokens.
- Test access to protected endpoints.
- Test missing and invalid access tokens.
- Perform refresh token requests and token rotation.
- Validate invalid refresh token responses.

### 5. API Mocking

Simulate different HTTP response scenarios using Playwright route interception:

- HTTP 200 – Successful response.
- HTTP 401 – Unauthorized.
- HTTP 403 – Forbidden.

Validate mocked JSON response bodies and error handling.

**Note:** Mocked authorization scenarios simulate backend responses and do not prove actual authentication enforcement by a live backend.

### 6. Database Testing with SQLite

- Create and manage SQLite databases using better-sqlite3.
- Perform CRUD operations (Create, Read, Update, Delete).
- Validate database records and record counts.
- Test SQL JOIN operations (INNER JOIN and LEFT JOIN).
- Perform aggregate queries using SUM, AVG, MIN and MAX.
- Test GROUP BY and HAVING queries.
- Validate database constraints, including NOT NULL and UNIQUE.
- Test parameterized queries and SQL injection prevention.
- Test database transactions, COMMIT and ROLLBACK.
- Validate database changes after successful and failed operations.

### 7. Playwright Fixtures

- Implement test-scoped database fixtures.
- Implement worker-scoped database fixtures.
- Manage database setup and teardown.
- Share database resources between tests within a worker.
- Reset test data to maintain test isolation.

### 8. Cross-Browser & Test Configuration

Configure Playwright projects to execute tests across:

- Chromium
- Firefox
- WebKit
- Database

Database tests run in a dedicated project instead of being repeated across all browser projects.

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/mfirdaus7/Playwright-QA-Automation.git
cd Playwright-QA-Automation
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

### Environment Configuration

Create a `.env` file in the project root:

```env
API_BASE_URL=https://jsonplaceholder.typicode.com
```

Configure the appropriate API base URL for the authentication tests if required.

Do not commit `.env` files or credentials to GitHub.

### Run Tests

Run all tests:

```bash
npx playwright test
```

Run API tests:

```bash
npx playwright test tests/api/
```

Run database tests:

```bash
npx playwright test --project=database
```

Run a specific test file:

```bash
npx playwright test tests/database/db-worker-fixture.spec.js
```

View HTML report:

```bash
npx playwright show-report
```

**Windows PowerShell users:** If `npx` is blocked by execution policy, use `npx.cmd` instead.

## Continuous Integration

This project uses **GitHub Actions** to automatically execute Playwright tests when code is pushed to the `main` branch or when a pull request is created.

The workflow includes:

1. Check out the repository.
2. Set up Node.js.
3. Install project dependencies.
4. Install Playwright browsers.
5. Execute automated tests.
6. Upload the Playwright HTML report as an artifact.

## Test Execution Results

**Latest local regression run: 100 tests passed.**

The test suite covers API automation, database testing, and dedicated Playwright project execution.

## Learning Objectives

This project demonstrates practical skills in:

- REST API test automation
- JavaScript for test automation
- Data-driven testing
- API Client Pattern
- JSON Schema validation using AJV
- Authentication and authorization testing
- API mocking and response validation
- SQLite database testing
- SQL queries and database transactions
- Playwright fixtures and test isolation
- Cross-browser test configuration
- Environment variable management
- CI/CD automation with GitHub Actions

## Author

**Firdaus**

Software Testing | QA Automation | Playwright

GitHub: https://github.com/mfirdaus7
