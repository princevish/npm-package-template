# NPM Package Template

This NPM Package Template provides a comprehensive starting point for developing and publishing your own NPM packages. It includes a basic setup with essential configurations to help streamline the development process, ensuring your package is ready for the NPM registry with ease and efficiency.

## Features

- **Easy Setup**: Quick start with minimal configuration.
- **ESLint & Prettier**: Pre-configured for code quality and formatting.
- **Continuous Integration**: Template includes GitHub Actions for CI/CD.
- **Documentation**: Basic README setup to kickstart your documentation.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v12.x or later)
- npm (v6.x or later)

## Getting Started

To use this template for your project, follow these steps:

1. ** kickstart your project **

   ```bash
   npx @princevish/npm-package-template your-package-name
   cd your-package-name
   ```

2. ** Building the Package **
   - After you have completed developing your package, you can build it to NPM.
   ```bash
      npm run lint
      npm run build
      npm run version:add
      npm run version:commit
   ```

3. ** Publishing to NPM **
   - After you have completed building package, you can publish it to NPM. Make sure you have an NPM account and are logged in to your NPM CLI.
   ```bash
      npm login
      npm publish
   ```

# Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

# License

Distributed under the MIT License. See `LICENSE` for more information.

Happy Coding! 🚀