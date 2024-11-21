# Development Process

## Prerequisites
- **Node.js and npm**: Ensure you have the latest version installed.
- **Expo CLI**: Install globally using `npm install -g expo-cli`.
- **EAS CLI**: Install using `npm install -g eas-cli`.

## Development Workflow
1. **Start the development server**:
   Open your terminal and run:
   ```bash
   npm run start
   ```
2. **Run the web version**:
   ```bash
   npm run web
   ```
3. **Test functions locally**:
   ```bash
   npm run dev
   ```
4. **Test iOS locally**:
   ```bash
   npm run dev:ios
   ```

## Building for Production
- Use EAS CLI for building:
  ```bash
  npx eas build --platform ios
  ```

## Code Quality
- **Linting**: Run `npm run lint` to check for code style issues.
- **Testing**: Use `npm test` to run unit tests.

## Troubleshooting
- **Common Issues**: Ensure all dependencies are installed and environment variables are set.
- **Support**: Refer to the official documentation for Expo and EAS CLI for additional help.
