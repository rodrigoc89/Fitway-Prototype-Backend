const validatePassword = (password) => {
  const regex =
    /^(?=.[A-Za-z])(?=.\d)(?=.[.!@#$%^&?+,-])[A-Za-z\d.!@#$%^&*?+,-]{8,20}$/;
  return regex.test(password);
};

const passwordValidator = (req, res, next) => {
  const password = req.body.password;

  if (!validatePassword(password)) {
    return res.status(400).json({
      error:
        "Password must contain at least one lowercase letter, one uppercase letter, one number, one symbol, and a minimum of 8 characters and a maximum of 20.",
    });
  }

  next();
};

module.exports = { passwordValidator };
