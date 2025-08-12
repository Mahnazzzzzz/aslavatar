# GenASL Avatar Generator Frontend

A modern React application that provides a user-friendly interface for the GenASL Avatar Generator backend. This frontend allows users to convert English text and audio into American Sign Language (ASL) using AI-powered translation and avatar generation.

## Features

- **Text-to-ASL Translation**: Convert English text to ASL gloss and generate avatar videos
- **Audio-to-ASL Translation**: Upload audio files for transcription and ASL generation
- **Voice Recording**: Real-time speech-to-text with automatic ASL generation
- **3D Avatar Display**: View generated ASL translations with 3D avatar animations
- **Modern UI/UX**: Clean, responsive design with loading states and error handling
- **AWS Amplify Integration**: Secure authentication and API management

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- AWS Account with configured services:
  - AWS Cognito (Authentication)
  - API Gateway
  - Lambda Functions
  - Step Functions
  - S3 Storage
  - Amazon Transcribe

## Installation

1. **Clone the repository and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure AWS Amplify:**
   
   You need to update the `src/aws-exports.js` file with your actual AWS configuration values:
   
   ```javascript
   const awsmobile = {
     "aws_project_region": "us-west-2",
     "aws_cognito_identity_pool_id": "YOUR_IDENTITY_POOL_ID",
     "aws_cognito_region": "us-west-2",
     "aws_user_pools_id": "YOUR_USER_POOL_ID",
     "aws_user_pools_web_client_id": "YOUR_CLIENT_ID",
     // ... other configuration
   };
   ```

4. **Update API Configuration:**
   
   In `amplify/backend/function/Audio2Sign/src/index.py`, update the state machine ARN:
   ```python
   stateMachineArn='YOUR_STATE_MACHINE_ARN'
   ```

## Running the Application

### Development Mode
```bash
npm start
```

The application will open at `http://localhost:3000`

### Production Build
```bash
npm run build
```

### Testing
```bash
npm test
```

## Project Structure

```
frontend/
├── public/                 # Static files
├── src/
│   ├── assets/            # Images and static assets
│   ├── components/        # React components
│   │   ├── ASLForm.js     # Main ASL translation component
│   │   └── ASLForm.css    # Component styles
│   ├── App.js             # Main application component
│   ├── App.css            # Application styles
│   └── aws-exports.js     # AWS Amplify configuration
├── amplify/               # AWS Amplify configuration
│   └── backend/           # Backend resources
└── package.json           # Dependencies and scripts
```

## Key Components

### ASLForm Component
The main component that handles:
- Text input and validation
- Audio file upload
- Voice recording
- API communication with backend
- Video display for avatar and ASL

### Features Breakdown

1. **Text Input**
   - Character limit validation (500 characters)
   - Real-time character counting
   - Placeholder text for user guidance

2. **Audio Upload**
   - File type validation (audio files only)
   - File size validation (10MB limit)
   - Progress indicators and error handling

3. **Voice Recording**
   - Browser-based speech recognition
   - Real-time transcription
   - Visual feedback during recording

4. **Video Display**
   - 3D Avatar video (pose-based)
   - ASL video (sign-based)
   - Video controls and fallback messages

## API Integration

The frontend communicates with the backend through AWS API Gateway:

- **Endpoint**: `/sign`
- **Method**: GET
- **Authentication**: Bearer token from Cognito
- **Parameters**:
  - `Text`: English text for translation
  - `BucketName` & `KeyName`: Audio file location (for audio uploads)

## Styling and Design

The application uses:
- **CSS Grid** for responsive layout
- **Material-UI** components for consistent design
- **CSS Custom Properties** for theming
- **Responsive design** for mobile and desktop
- **Modern animations** and transitions

## Error Handling

The application includes comprehensive error handling:
- Network request failures
- File upload errors
- Speech recognition errors
- Input validation errors
- User-friendly error messages with Snackbar notifications

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

**Note**: Speech recognition requires HTTPS in production and may not work in all browsers.

## Deployment

### AWS Amplify Hosting
1. Connect your repository to AWS Amplify
2. Configure build settings
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Upload the `build` folder to your hosting service

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify AWS Cognito configuration
   - Check user pool settings
   - Ensure correct region configuration

2. **API Errors**
   - Verify API Gateway configuration
   - Check Lambda function permissions
   - Ensure state machine ARN is correct

3. **Speech Recognition Not Working**
   - Ensure HTTPS is enabled
   - Check browser permissions
   - Verify microphone access

4. **Video Not Loading**
   - Check S3 bucket permissions
   - Verify presigned URL generation
   - Ensure CORS is configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the troubleshooting section
- Review AWS documentation
- Open an issue in the repository
# aslavatar
