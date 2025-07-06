const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.signup = async ({ email, password, name }) => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "name", Value: name },
    ],
  };

  const result = await cognito.signUp(params).promise();
  return { success: true, userSub: result.UserSub };
};

exports.confirmSignup = async ({ email, code }) => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
  };

  await cognito.confirmSignUp(params).promise();
  return { confirmed: true };
};

exports.login = async ({ email, password }) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  const response = await cognito.initiateAuth(params).promise();
  const { ChallengeName, Session } = response;

  if (ChallengeName === "SOFTWARE_TOKEN_MFA") {
    return { challenge: "MFA_REQUIRED", session: Session };
  }

  if (ChallengeName === "MFA_SETUP") {
    return {
      challenge: "MFA_SETUP",
      session: Session,
      message:
        "MFA aún no configurado. Debes registrar un TOTP antes de continuar.",
    };
  }

  if (response.AuthenticationResult) {
    return {
      accessToken: response.AuthenticationResult.AccessToken,
      idToken: response.AuthenticationResult.IdToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
    };
  }

  throw new Error(`Unexpected auth flow: ${ChallengeName}`);
};

// Step 2: Associate a software token for MFA setup (session-based)
exports.setupMfa = async ({ session }) => {
  const params = { Session: session };

  console.log(session);

  const response = await cognito.associateSoftwareToken(params).promise();
  return { secretCode: response.SecretCode, session: response.Session };
};

// Step 3: Verify the TOTP code provided by the user
exports.verifyMfa = async ({ session, code }) => {
  const params = {
    Session: session,
    UserCode: code,
    FriendlyDeviceName: "MyAuthenticatorApp",
  };
  const response = await cognito.verifySoftwareToken(params).promise();
  return { status: response.Status, session: response.Session };
};

// Step 4: Complete the MFA setup challenge and get tokens
exports.respondToMfaSetup = async ({ email, session }) => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    ChallengeName: "MFA_SETUP",
    Session: session,
    ChallengeResponses: { USERNAME: email },
  };
  const response = await cognito.respondToAuthChallenge(params).promise();
  return {
    accessToken: response.AuthenticationResult.AccessToken,
    idToken: response.AuthenticationResult.IdToken,
    refreshToken: response.AuthenticationResult.RefreshToken,
  };
};

// Step 5: Respond to SOFTWARE_TOKEN_MFA on subsequent logins
exports.respondChallenge = async ({ email, session, code }) => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    ChallengeName: "SOFTWARE_TOKEN_MFA",
    Session: session,
    ChallengeResponses: {
      USERNAME: email,
      SOFTWARE_TOKEN_MFA_CODE: code,
    },
  };
  const response = await cognito.respondToAuthChallenge(params).promise();
  return {
    accessToken: response.AuthenticationResult.AccessToken,
    idToken: response.AuthenticationResult.IdToken,
    refreshToken: response.AuthenticationResult.RefreshToken,
  };
};

// Other utilities
exports.resendConfirmationCode = async ({ email }) => {
  const params = { ClientId: process.env.COGNITO_CLIENT_ID, Username: email };
  const result = await cognito.resendConfirmationCode(params).promise();
  return {
    deliveryMedium: result.CodeDeliveryDetails.DeliveryMedium,
    destination: result.CodeDeliveryDetails.Destination,
  };
};
exports.forgotPassword = async ({ email }) => {
  await cognito
    .forgotPassword({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
    })
    .promise();
  return { success: true };
};
exports.confirmForgotPassword = async ({ email, code, newPassword }) => {
  await cognito
    .confirmForgotPassword({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    })
    .promise();
  return { success: true };
};
exports.getProfile = async (accessToken) => {
  const response = await cognito
    .getUser({ AccessToken: accessToken })
    .promise();
  return response.UserAttributes.reduce(
    (acc, attr) => ({ ...acc, [attr.Name]: attr.Value }),
    {}
  );
};
