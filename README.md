# Playwright BDD TypeScript Framework (`playwright-bdd-ts`)

* This repository contains a **Behavior-Driven Development (BDD)** automation framework built using **Playwright**, **Cucumber**, and **TypeScript**.  
* It supports **UI** test automation within a single unified project structure, enabling maintainable, scalable, and reusable test design.

---

## Key Features

- Unified framework for **UI** test automation  
- Built on **Playwright + TypeScript** with **Cucumber BDD** syntax  
- Supports test tagging (`@UI`) for selective execution  
- Reusable **page object model (POM)** for UI automation  
- Modular utilities for payload reading, helper functions, and context handling  
- Clean TypeScript build with strong typing and model classes  
- Reporting integration ready (HTML/Allure can be added later)

---

## Setup Instructions
1. Prerequisites: 
    Node.js (v20.19.5 or higher)
    npm (comes with Node)
    Visual Studio Code (recommended)

2. Install Dependencies: 
    From the project root, run:
    # npm install

This installs all dependencies listed in package.json.

3. Install Playwright Browsers: 
    # npx playwright install

## Execution Instructions
1. Run All Tests
    # npm test

2. Run Only UI Scenarios
    # npm run test:ui

---

## Execution Report 

Latest HTML report location: /reports/html/latest/index.html

## Framework & Tools Used

| Tool / Library | Version | Purpose |
|----------------|----------|----------|
| **Node.js** | `v20.19.5` | JavaScript runtime environment |
| **@cucumber/cucumber** | `12.2.0` | BDD framework supporting Gherkin syntax |
| **@playwright/test** | `1.56.1` | Browser automation & API testing |
| **typescript** | `5.9.3` | Type safety and modern language features |
| **ts-node** | `10.9.2` | TypeScript execution without compilation |
| **@types/node** | `24.9.2` | Node.js type definitions |
| **ajv** | `8.17.1` | JSON schema validation for API responses |
| **prettier** | `3.6.2` | Code formatter for consistent style |

---

## Project Structure

playwright-bdd-ts/
├── Data/                     # Static test data & API payloads
├── features/                 # Cucumber feature files
│   └── webShop.feature
├── Fixtures/                 # Shared test fixtures
│   └── fixture.ts
├── Hooks/                    # Global Cucumber hooks (Before/After)
│   └── hooks.ts
├── Model/                    # TypeScript models for API requests/responses
│   ├── Request/
│   └── Response/
├── pages/                    # Page Object Model classes for UI tests
│   ├── LoginPage.ts
│   ├── HomePage.ts
│   └── ...
├── reports/                    # To store reports after each execution
│   ├── html
│      ├── latest
           ├── index.html       # latest execution report 
├── scripts/                    # To generate reports automatically after each execution
│   ├── run-and-report.js
├── step-definitions/         # Step definition files mapping to feature steps
│   └── Loginstep.ts
├── utils/                    # Helper & utility classes
│   ├── generateReport.ts
│   ├── globalVariables.ts
│   ├── helper.ts
├── .gitignore.json             
├── cucumber.json              
├── package.json              # NPM configuration
├── tsconfig.json             # TypeScript compiler configuration
└── README.md                 # Project documentation


## To do for UI improvement
1. Parallel execution
2. Rerun failed test
3. Take screenshot on failure
4. Video recording on failure
5. Cross browser execution
6. Include execution in pipeline

## To do for API improvement
1. Make the step definitions more generic
2. Used dispose method in multiple step definition
3. Have a mechanism to validate respective fields from response body
4. Keep the credentials in a seperate file