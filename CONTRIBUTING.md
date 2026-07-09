# Contributing to Ulgen AI

First off, thank you for considering contributing to Ulgen AI! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

We welcome contributions from everyone. By participating in this project, you agree to abide by our guidelines below.

## 🚀 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the [issue tracker](https://github.com/furkanahmetk/ulgen-ai/issues) as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:
* Use a clear and descriptive title for the issue to identify the problem.
* Describe the exact steps which reproduce the problem in as many details as possible.
* Provide specific examples to demonstrate the steps.
* Describe the behavior you observed after following the steps and point out what exactly is the problem with that behavior.
* Explain which behavior you expected to see instead and why.

### Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://github.com/furkanahmetk/ulgen-ai/issues). When creating an enhancement suggestion, please include:
* Use a clear and descriptive title for the issue to identify the suggestion.
* Provide a step-by-step description of the suggested enhancement in as many details as possible.
* Describe the current behavior and explain which behavior you expected to see instead and why.
* Explain why this enhancement would be useful to most users.

### Pull Requests

Please follow these steps to have your contribution considered by the maintainers:

1. **Fork the repository** and create your branch from `main`.
2. **Create a feature branch:** `git checkout -b feat/your-feature` or `fix/your-fix`
3. **Set up the development environment:**
   - Run `make install` to install frontend and backend dependencies.
   - For smart contracts, ensure you have Rust (`wasm32-unknown-unknown` target) installed.
4. **Make your changes:**
   - Write tests for your changes if applicable.
   - Ensure your code passes the existing test suite (`make test`).
5. **Commit your changes:**
   - We follow [Conventional Commits](https://www.conventionalcommits.org/).
   - Format: `<type>[optional scope]: <description>`
   - Examples:
     - `feat(frontend): add new investigation chart`
     - `fix(backend): resolve x402 payment fallback error`
     - `docs(contracts): update Odra deployment instructions`
6. **Push to your fork and submit a Pull Request.**

## 🛠️ Development Setup

Refer to the [README.md](README.md) for detailed instructions on setting up the backend, frontend, and smart contracts locally.

Key commands from the root directory:
- `make install` - Install all dependencies
- `make build` - Build backend and frontend
- `make dev` - Start development servers
- `make test` - Run test suites

### Smart Contracts
Contracts are written in Rust using the [Odra Framework](https://odra.dev/). Ensure you run `cargo test` inside the `/contracts` directory when modifying them.

### Backend
The backend is an Express + TypeScript application utilizing the Gemini AI agent loop. Run `npm test` inside `/backend` for backend tests.

### Frontend
The frontend is a Next.js application using the CSPR.click SDK. Run `npm test` inside `/frontend` for frontend tests.

## 📝 Code Style
- Please maintain consistency with the existing code formatting.
- For TypeScript/JavaScript, we use standard Prettier/ESLint configurations if present.
- For Rust, run `cargo fmt` and `cargo clippy` before committing.

## ❓ Need Help?
If you have any questions or need help with setting up your environment, please open an issue on the GitHub repository.

Thank you for contributing! 🛡️
