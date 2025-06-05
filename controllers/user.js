import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { inngest } from "../inngest/client.js";

export const signup = async (req, res) => {
  const { email, password, skills = [] } = req.body;
  try {
    const hasshedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hasshedPassword,
      skills,
    });

    // Fire inngest event
    await inngest.send({
      name: "user.signup",
      data: { email },
    });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        skills: user.skills,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        skills: user.skills,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });
      res.json({ message: "Logged out successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { skills = [], role, email } = req.body;

  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: " User not found" });

    await User.updateOne(
      { email },
      { skills: skills.length ? skills : user.skills, role }
    );

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error.message);
    return res
      .status(500)
      .json({ error: "Update failed", details: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.error("Get user error:", error.message);
    return res
      .status(500)
      .json({ error: "Update failed", details: error.message });
  }
};
