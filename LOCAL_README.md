# Local Environment Setup

## Prerequisites
- **Node.js and npm**: Install the latest version from [nodejs.org](https://nodejs.org/).
- **Expo CLI**: Install globally using `npm install -g expo-cli`.
- **iOS Simulator**: Requires Xcode on macOS. Download from the Mac App Store.

## Steps to Set Up
1. **Clone the repository**:
   Open your terminal and run:
   ```bash
   git clone https://github.com/EnigmaKeyCEO/actimate-takehome.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd actimate-takehome
   ```
3. **Install dependencies**:
   Run the following command to install all necessary packages:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run start
   ```
5. **Run on iOS**:
   Open your terminal and execute:
   ```bash
   npm run dev:ios
   ```

## Environment Variables
- Create a `.env` file in the root directory.
- Add the following variables:
  ```bash
  VITE_API_BASE_URL=https://actimate-takehome.netlify.app/api
  VITE_AWS_ACCESS_KEY_ID=your_access_key_id
  VITE_AWS_SECRET_ACCESS_KEY=your_secret_access_key
  VITE_AWS_REGION=your_aws_region
  VITE_S3_BUCKET=your_s3_bucket
  ```

## Troubleshooting
- **Common Issues**: Ensure all dependencies are installed and environment variables are set.
- **Support**: Refer to the official documentation for Expo and Node.js for additional help.
