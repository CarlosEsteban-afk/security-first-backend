const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.signup = async ({ email, password, name }) => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'name', Value: name },
    ],
  };

     const result = await cognito.signUp(params).promise();
    // 👇 Asegúrate de acceder a result.UserSub
    return { success: true, userSub: result.UserSub };
};
exports.confirmSignup = async ({ email, code }) => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
  };

  await cognito.confirmSignUp(params).promise();
  return { success: true };
};
exports.login = async ({ email, password }) => {
  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };
  const result = await cognito.adminInitiateAuth(params).promise();
  return result;
};