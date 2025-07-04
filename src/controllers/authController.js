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
  const { email, code } = req.body;

  try {
    const result = await cognito.respondChallenge({ email, code });
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
  const { email } = req.user; // Asumiendo que el middleware de autenticación añade el usuario al request

  try {
    const result = await cognito.getProfile({ email });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};