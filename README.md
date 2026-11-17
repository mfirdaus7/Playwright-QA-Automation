# Playwright QA Automation

A test automation project built with **Playwright Test and JavaScript**, focusing on REST API testing, response validation, authorization headers, and automated test execution through GitHub Actions.

## Tech Stack

- JavaScript (Node.js)
- Playwright Test
- AJV – JSON Schema Validation
- REST API Testing
- Git & GitHub
- GitHub Actions – CI/CD
- dotenv – Environment Configuration

## Project Structure

```text
Playwright-QA-Automation/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── helpers/
│   └── apiHelper.js
├── schemas/
│   └── userSchema.js
├── tests/
│   └── api/
│       ├── users-api.spec.js
│       └── authorization.spec.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── playwright.config.js
```

## Test Coverage

### 1. Users API Tests

- GET user details using REST API.
- Data-driven testing with multiple user IDs.
- Validate HTTP response status.
- Validate response data using JSON Schema.
- Verify returned user IDs.

### 2. Authorization Header Testing

- Send API requests with Authorization headers.
- Verify API response status and headers.

### 3. Mock API Response Testing

- HTTP 200 – Successful response.
- HTTP 401 – Unauthorized response.
- HTTP 403 – Forbidden response.
- Validate mocked JSON response bodies.

> Note: Authentication response scenarios (200, 401 and 403) are simulated using Playwright route interception. They do not represent authentication validation by a live backend.

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

Do not commit `.env` or any credentials to GitHub.

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

## Continuous Integration

This project uses **GitHub Actions** to automatically execute Playwright tests when code is pushed to the `main` branch or when a pull request is created.

The workflow:

1. Checks out the repository.
2. Sets up Node.js.
3. Installs dependencies.
4. Installs Playwright browsers.
5. Executes automated tests.
6. Uploads the Playwright HTML report as an artifact.

## Learning Objectives

This project demonstrates practical skills in:

- API test automation
- Data-driven testing
- JSON Schema validation
- Reusable helper functions
- HTTP status code validation
- Request header validation
- API response mocking
- Environment variable management
- CI/CD automation

## Author

**Firdaus**

Software Testing | QA Automation | Playwright

GitHub: https://github.com/mfirdaus7
