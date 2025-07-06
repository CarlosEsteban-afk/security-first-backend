const cognito = require('../services/cognitoService');

exports.signup = async (req, res) => { 
  const { email, password, name } = req.body;

  try {
    const result = await cognito.signup({ email, password, name });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.confirmSignup = async (req, res) => {
  const { email, code } = req.body;

  try {
    const result = await cognito.confirmSignup({ email, code });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.resendConfirmation = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await cognito.resendConfirmationCode({ email });
    res.status(200).json({
      message: "Código reenviado correctamente",
      ...result,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await cognito.login({ email, password });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.respondChallenge = async (req, res) => {
  const { email, session, code } = req.body;

  try {
    const result = await cognito.respondChallenge({ email, session, code });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await cognito.forgotPassword({ email });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.confirmForgotPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const result = await cognito.confirmForgotPassword({ email, code, newPassword });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no proporcionado o mal formado" });
    }

    const accessToken = authHeader.split(" ")[1];
    const profile = await cognito.getProfile(accessToken);

    
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.setupMfa = async (req, res) => {
  const { session } = req.body;
  try {
    const result = await cognito.setupMfa({ session });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyMfa = async (req, res) => {
  const { session, code } = req.body;
  try {
    const result = await cognito.verifyMfa({ session, code });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.enableMfa = async (req, res) => {
  const { session } = req.body;
  try {
    const result = await cognito.enableMfa({ session });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
