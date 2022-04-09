import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ msg: 'Invalid Credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(404).json({ msg: 'Invalid Credentials' });
      }
      const token = jwt.sign({
        email: user.email,
        id: user._id,
      }, process.env.SECRET_JWT_SEED, {
        expiresIn: '1h',
      })

      res.status(200).json({
        result: user,
        token,
      });

    } catch (error) {
      res.status(500).json('Something went wrong talk to the devs');
    }
}


export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ msg: 'Email already in use use'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`
    });

    const token = jwt.sign({
      email: result.email,
      id: result._id,
    }, process.env.SECRET_JWT_SEED, {
      expiresIn: '1h',
    })

    res.status(200).json({
      result,
      token,
    });

  } catch (error) {
    res.status(500).json('Something went wrong talk to the devs');
  }
}