# Configuration Guide

This guide will help you configure the GenASL Avatar Generator frontend with your AWS services.

## Prerequisites

Before configuring the frontend, ensure you have:

1. **AWS Account** with appropriate permissions
2. **Backend deployed** using the SAM template
3. **Node.js** (v16 or higher) installed
4. **npm** or **yarn** package manager

## Step 1: AWS Services Setup

### 1.1 AWS Cognito Configuration

1. **Create User Pool:**
   - Go to AWS Cognito Console
   - Create a new User Pool
   - Configure sign-in experience (Email)
   - Set password requirements
   - Note down the User Pool ID

2. **Create User Pool Client:**
   - In your User Pool, create an app client
   - Enable authentication flows
   - Note down the Client ID

3. **Create Identity Pool:**
   - Create a new Identity Pool
   - Link it to your User Pool
   - Note down the Identity Pool ID

### 1.2 API Gateway Configuration

1. **Deploy Backend:**
   ```bash
   cd backend
   sam build
   sam deploy --guided
   ```

2. **Note the API Endpoint:**
   - After deployment, note the API Gateway endpoint
   - Update the state machine ARN in the Lambda function

### 1.3 S3 Bucket Configuration

1. **Create S3 Bucket:**
   - Create a bucket for file storage
   - Enable CORS for web access
   - Configure bucket policies

2. **CORS Configuration:**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

## Step 2: Frontend Configuration

### 2.1 Quick Setup (Recommended)

Run the interactive setup script:

```bash
cd frontend
npm run setup
```

This will prompt you for all required AWS configuration values.

### 2.2 Manual Configuration

If you prefer to configure manually:

1. **Update `src/aws-exports.js`:**
   ```javascript
   const awsmobile = {
     "aws_project_region": "YOUR_REGION",
     "aws_cognito_identity_pool_id": "YOUR_IDENTITY_POOL_ID",
     "aws_cognito_region": "YOUR_REGION",
     "aws_user_pools_id": "YOUR_USER_POOL_ID",
     "aws_user_pools_web_client_id": "YOUR_CLIENT_ID",
     // ... other configuration
   };
   ```

2. **Update Lambda Function:**
   In `amplify/backend/function/Audio2Sign/src/index.py`:
   ```python
   stateMachineArn='YOUR_STATE_MACHINE_ARN'
   ```

## Step 3: Environment Variables (Optional)

Create a `.env` file in the frontend directory:

```env
# AWS Configuration
REACT_APP_AWS_REGION=us-west-2
REACT_APP_COGNITO_IDENTITY_POOL_ID=us-west-2:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
REACT_APP_COGNITO_USER_POOL_ID=us-west-2_xxxxxxxxx
REACT_APP_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# API Configuration
REACT_APP_API_ENDPOINT=https://xxxxxxxxxx.execute-api.us-west-2.amazonaws.com/prod

# S3 Configuration
REACT_APP_S3_BUCKET=your-s3-bucket-name

# Development Configuration
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
```

## Step 4: Installation and Testing

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm start
   ```

3. **Test the Application:**
   - Open http://localhost:3000
   - Sign up/sign in with Cognito
   - Test text-to-ASL translation
   - Test audio upload functionality

## Troubleshooting

### Common Issues

1. **Authentication Errors:**
   - Verify Cognito configuration
   - Check user pool settings
   - Ensure correct region

2. **API Errors:**
   - Verify API Gateway configuration
   - Check Lambda function permissions
   - Ensure state machine ARN is correct

3. **CORS Errors:**
   - Configure S3 bucket CORS
   - Check API Gateway CORS settings
   - Verify domain configuration

4. **File Upload Issues:**
   - Check S3 bucket permissions
   - Verify IAM roles
   - Ensure bucket exists

### Debug Mode

Enable debug mode by setting:
```env
REACT_APP_DEBUG=true
```

This will show detailed console logs for troubleshooting.

## Security Considerations

1. **Never commit sensitive credentials**
2. **Use IAM roles with minimal permissions**
3. **Enable HTTPS in production**
4. **Configure proper CORS policies**
5. **Regularly rotate access keys**

## Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting service:**
   - AWS S3 + CloudFront
   - AWS Amplify Hosting
   - Netlify
   - Vercel

3. **Update CORS settings** for your production domain

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Review AWS service documentation
3. Check browser console for errors
4. Verify network requests in browser dev tools
5. Open an issue in the repository
