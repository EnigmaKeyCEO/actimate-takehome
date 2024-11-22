# Deployment Instructions

## Prerequisites
- **Netlify Account**: Create an account at [Netlify](https://www.netlify.com/).
- **AWS Account**: Set up AWS services for S3 and DynamoDB integrations.

## Steps to Deploy

### Netlify Deployment
1. **Link your repository**:
   - Log in to your Netlify account.
   - Click on "New site from Git".
   - Choose GitHub as your provider and authorize Netlify to access your repository.
   - Select the `actimate-takehome` repository.
   - Configure the build settings:
     - **Build Command**: `npm run build:web`
     - **Publish Directory**: `dist`
   - Click "Deploy site".

2. **Set environment variables**:
   - In Netlify dashboard, navigate to your site settings.
   - Go to **Build & Deploy** > **Environment** > **Environment Variables**.
   - Add the following variables:
     - `VITE_API_BASE_URL`
     - `VITE_AWS_ACCESS_KEY_ID`
     - `VITE_AWS_SECRET_ACCESS_KEY`
     - `VITE_AWS_REGION`
     - `VITE_S3_BUCKET_NAME`
     - `VITE_AWS_ACCESS_URL_KEY`
   - Ensure that sensitive information like AWS credentials are kept secure and not exposed.

3. **Deploy the project**:
   - Use the Netlify CLI or web interface to trigger a deployment.
   - To deploy using CLI:
     ```bash
     netlify deploy
     ```
   - Follow the prompts to deploy your site.

### AWS Setup
1. **Create S3 Buckets**:
   - Log in to your AWS Management Console.
   - Navigate to S3 service.
   - Create a new bucket for storing images (e.g., `actimate-takehome-images`).
   - Configure bucket settings, ensuring it's not publicly accessible.

2. **Configure IAM Roles**:
   - Go to IAM service in AWS.
   - Create a new role for Netlify Functions with permissions to access S3 and DynamoDB.
   - Attach the following policies:
     - `AmazonS3FullAccess` (or more restrictive as needed)
     - `AmazonDynamoDBFullAccess` (or more restrictive as needed)

3. **Set up API Gateway and Lambda**:
   - If using serverless functions beyond Netlify Functions, configure AWS API Gateway and Lambda.
   - Ensure that Lambda functions have the necessary permissions to interact with S3 and DynamoDB.

## Post-Deployment
- **Verify all endpoints**:
  - Test each API endpoint to ensure they are functioning as expected.
  - Use tools like Postman or curl for testing.

- **Test the application**:
  - Navigate through all features of the application.
  - Ensure that CRUD operations for folders and images work seamlessly.

- **Monitor logs**:
  - Use AWS CloudWatch to monitor Lambda function logs.
  - Utilize Netlify logs for frontend-related issues.
  - Set up alerts for any critical errors or performance issues.

## Troubleshooting
- **Common Issues**:
  - **Deployment Failures**:
    - Check build logs for errors.
    - Ensure environment variables are correctly set.
  - **API Errors**:
    - Verify IAM roles and permissions.
    - Ensure that AWS services (S3, DynamoDB) are correctly configured.
  - **Frontend Issues**:
    - Ensure all dependencies are installed.
    - Check for console errors in the browser.

- **Support**:
  - **Netlify Support**: Refer to [Netlify Documentation](https://docs.netlify.com/) for deployment issues.
  - **AWS Support**: Consult [AWS Documentation](https://docs.aws.amazon.com/) for AWS service configurations.
  - **Community Forums**: Engage with communities like Stack Overflow or GitHub Discussions for troubleshooting assistance.

## Best Practices
- **Security**:
  - Regularly rotate AWS credentials.
  - Implement least privilege access for IAM roles.
- **Monitoring**:
  - Set up automated monitoring and alerts for both frontend and backend services.
- **Automation**:
  - Use CI/CD pipelines to automate testing and deployment processes.
- **Documentation**:
  - Keep all documentation up-to-date with any changes in deployment processes or configurations.

---
