import User from '../models/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import GasStation from "../models/gasStation.js";


export const registerUser = async (req, res) => {
  try {
    const {name,email,password,phone}=req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashPassword = await bcrypt.hash(password,12)

    const newUser = await User.create({
        name,
        email,
        password:hashPassword,
        phone,
    
    })

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};


export const login = async (req, res) => {
    if (!req.body || !req.body.email) return res.status(400).json({ message: "Missing email in request body" });

    const { email, password } = req.body;


    let user;
    try {
        user = await User.findOne({ email });
        if (!user) {
            return res.status(301).json({ message: "User with that email is not exists" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(300).json({ message: "email and password are incorrect" });
        }
        const token = jwt.sign(
          { userId: user._id, role: "user" },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
             
        res.status(200).json({ token ,userId:user._id});
    } catch (error) {
        res.status(400).json({ message: 'Login failed', error: error.message });
    }
}


export const changePassword = async (req, res) => {
    const { password, newPassword, userId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "User doesn't exist" });
      }
  
      if (!user.password) {
        return res.status(400).json({ message: "User has no password set" });
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const result = await User.updateOne(
        { _id: userId },
        { $set: { password: hashedPassword } }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(400).json({ message: "Password update failed" });
      }
  
      res.status(200).json({ message: "Password updated successfully" });
  
    } catch (error) {
      console.error("Change password error:", error);
      res.status(400).json({ message: "Password change failed", error: error.message });
    }
  };

  export const getUserInfo = async (req,res) =>{
    try{
        const user = await User.findOne({_id:req.params.id})
        if(!user){
            return res.status(301).json({ message: "User does not exists" });
        }
        return res.status(201).json(user)
    }catch(error){
        res.status(400).json(error);
    }
}


export const registerSeller = async (req, res) => {
  try {
    const { name, owner, email, password, location, phone } = req.body;

    if (!email || !password || !phone || !name || !owner || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingSeller = await GasStation.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingSeller) {
      if (existingSeller.email === email) {
        return res.status(409).json({ message: "Email already registered" });
      }
      if (existingSeller.phone === phone) {
        return res.status(409).json({ message: "Phone number already registered" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newGasStation = new GasStation({
      name,
      owner,
      email,
      password: hashedPassword,
      phone,
      location,
      price: 0,
      quantity: 0,
      rating: 0
    });

    await newGasStation.save();

    return res.status(201).json({ message: "Seller registered successfully" });

  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` });
    }

    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const sellerLogin = async (req, res) => {
  const { email, password } = req.body;
  let sellerUser;
  try {
      sellerUser = await GasStation.findOne({ email });
      if (!sellerUser) {
          return res.status(301).json({ message: "User with that email is not exists" });
      }
      const isValidPassword = await bcrypt.compare(password, sellerUser.password);
      if (!isValidPassword) {
          return res.status(300).json({ message: "email and password are incorrect" });
      }
      const token = jwt.sign(
        { stationId: sellerUser._id, role: "station" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
         
      res.status(200).json({ token ,sellerId:sellerUser._id});
  } catch (error) {
      res.status(400).json({ message: 'Login failed', error: error.message });
  }
}