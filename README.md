# Playwright QA Automation

A test automation project built with **Playwright Test and JavaScript**, focusing on REST API testing, API response validation, authorization headers, API mocking, and automated test execution through GitHub Actions.

**Latest Test Results: 54 Passed**

## Tech Stack

- JavaScript (Node.js)
- Playwright Test
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
│   └── postsApi.js
├── helpers/
│   └── apiHelper.js
├── schemas/
│   └── userSchema.js
├── test-data/
│   └── invalidUsers.js
├── tests/
│   └── api/
│       ├── users-api.spec.js
│       ├── posts-api.spec.js
│       ├── api-chaining.spec.js
│       └── authorization.spec.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── playwright.config.js
```

## Test Coverage

### 1. Users API Tests

- Retrieve user details using GET requests.
- Data-driven testing with multiple user IDs.
- Validate HTTP response status codes.
- Validate API response data using AJV and JSON Schema.
- Test invalid response data and missing required properties.

### 2. Posts API Tests

- Create posts using POST requests.
- Update posts using PUT requests.
- Partially update posts using PATCH requests.
- Delete posts using DELETE requests.
- Validate HTTP status codes and response bodies.

### 3. API Chaining

- Create a post using POST.
- Extract the generated post ID from the response.
- Use the returned ID for subsequent PATCH requests.
- Delete the post using the same ID.
- Validate each API response throughout the workflow.

### 4. Authorization Header Testing

- Send API requests with Authorization headers.
- Verify request headers and API response status.

### 5. Mock API Response Testing

- HTTP 200 – Successful response.
- HTTP 401 – Unauthorized response.
- HTTP 403 – Forbidden response.
- Validate mocked JSON response bodies using Playwright route interception.

> **Note:** Authentication response scenarios (200, 401 and 403) are simulated using Playwright route interception. They do not represent authentication validation by a live backend.

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

Run a specific test file:

```bash
npx playwright test tests/api/users-api.spec.js
```

View HTML report:

```bash
npx playwright show-report
```

**Windows PowerShell users:** If `npx` is blocked by execution policy, use `npx.cmd` instead.

## Continuous Integration

This project uses **GitHub Actions** to automatically execute Playwright tests when code is pushed to the `main` branch or when a pull request is created.

The workflow:

1. Checks out the repository.
2. Sets up Node.js.
3. Installs project dependencies.
4. Installs Playwright browsers.
5. Executes automated tests.
6. Uploads the Playwright HTML report as an artifact.

## Learning Objectives

This project demonstrates practical skills in:

- REST API test automation
- Data-driven testing
- API Client Pattern and reusable methods
- JSON Schema validation using AJV
- HTTP status code validation
- Request header validation
- API response mocking
- API chaining
- Environment variable management
- CI/CD automation with GitHub Actions

## Test Execution Results

**54 tests passed** in the latest local regression run.

## Author

**Firdaus**

Software Testing | QA Automation | Playwright

GitHub: https://github.com/mfirdaus7
