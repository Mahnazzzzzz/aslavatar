#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 GenASL Avatar Generator Frontend Setup');
console.log('==========================================\n');

const questions = [
  {
    name: 'region',
    message: 'Enter your AWS region (e.g., us-west-2): ',
    default: 'us-west-2'
  },
  {
    name: 'identityPoolId',
    message: 'Enter your Cognito Identity Pool ID: ',
    required: true
  },
  {
    name: 'userPoolId',
    message: 'Enter your Cognito User Pool ID: ',
    required: true
  },
  {
    name: 'userPoolClientId',
    message: 'Enter your Cognito User Pool Client ID: ',
    required: true
  },
  {
    name: 'appsyncEndpoint',
    message: 'Enter your AppSync GraphQL endpoint (optional): ',
    default: ''
  },
  {
    name: 's3Bucket',
    message: 'Enter your S3 bucket name for file storage: ',
    default: 'genaslavatardemoea26af8c'
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    generateConfig();
    return;
  }

  const question = questions[index];
  const message = question.required ? 
    `${question.message}* ` : 
    `${question.message}${question.default ? ` (${question.default})` : ''}: `;

  rl.question(message, (answer) => {
    if (question.required && !answer.trim()) {
      console.log('❌ This field is required. Please try again.\n');
      askQuestion(index);
      return;
    }

    answers[question.name] = answer.trim() || question.default || '';
    askQuestion(index + 1);
  });
}

function generateConfig() {
  const config = `const awsmobile = {
  "aws_project_region": "${answers.region}",
  "aws_cognito_identity_pool_id": "${answers.identityPoolId}",
  "aws_cognito_region": "${answers.region}",
  "aws_user_pools_id": "${answers.userPoolId}",
  "aws_user_pools_web_client_id": "${answers.userPoolClientId}",
  "oauth": {},
  "aws_cognito_username_attributes": [
    "EMAIL"
  ],
  "aws_cognito_social_providers": [],
  "aws_cognito_signup_attributes": [],
  "aws_cognito_mfa_configuration": "OFF",
  "aws_cognito_mfa_types": [
    "SMS"
  ],
  "aws_cognito_password_protection_settings": {
    "passwordPolicyMinLength": 8,
    "passwordPolicyCharacters": []
  },
  "aws_cognito_verification_mechanisms": [
    "EMAIL"
  ]${answers.appsyncEndpoint ? `,
  "aws_appsync_graphqlEndpoint": "${answers.appsyncEndpoint}",
  "aws_appsync_region": "${answers.region}",
  "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS"` : ''},
  "aws_user_files_s3_bucket": "${answers.s3Bucket}",
  "aws_user_files_s3_region": "${answers.region}"
};

export default awsmobile;
`;

  const configPath = path.join(__dirname, 'src', 'aws-exports.js');
  
  try {
    fs.writeFileSync(configPath, config);
    console.log('\n✅ Configuration file created successfully!');
    console.log(`📁 Location: ${configPath}`);
    
    console.log('\n📋 Next Steps:');
    console.log('1. Update the state machine ARN in amplify/backend/function/Audio2Sign/src/index.py');
    console.log('2. Run "npm install" to install dependencies');
    console.log('3. Run "npm start" to start the development server');
    
    console.log('\n⚠️  Important Notes:');
    console.log('- Make sure your AWS services are properly configured');
    console.log('- Ensure CORS is enabled on your S3 bucket');
    console.log('- Verify API Gateway permissions');
    
  } catch (error) {
    console.error('\n❌ Error creating configuration file:', error.message);
  }

  rl.close();
}

// Start the setup process
askQuestion(0);

rl.on('close', () => {
  console.log('\n👋 Setup complete! Happy coding!');
  process.exit(0);
});
