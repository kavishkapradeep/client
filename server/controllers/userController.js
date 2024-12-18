import userModel from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import transactionModel from "../models/transactionsModel.js";
import Stripe from 'stripe'



const registerUser = async (req,res)=>{
    try {
        const {name,email,password} =req.body;
        if (!name || !email ||!password) {
            return res.json({success:false,message:"Missing Details"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt)

        const userData = {
            name,
            email,
            password:hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success:true,token,user:{name:user.name}})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}

const loginUser = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({success:false,message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if (isMatch) {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success:true,token,user:{name:user.name}})
        } else {
            return res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message}) 
    }
}

const userCredits = async (req,res)=>{
    try {
        const {userId} = req.body

        const user = await userModel.findById(userId)
        res.json({success:true,credits:user.creditBalance,user:{name:user.name}})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

const placeOrderStripe = async (req, res) => {
    try {
      const { userId, planId } = req.body;
  
      console.log("Request received:", { userId, planId });
  
      if (!userId || !planId) {
        return res.status(400).json({ success: false, message: "Invalid input" });
      }
  
      const userData = await userModel.findById(userId);
      if (!userData) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      let credits, plan, amount;
      switch (planId) {
        case 'Basic':
          plan = 'Basic';
          credits = 100;
          amount = 10;
          break;
        case 'Advanced':
          plan = 'Advanced';
          credits = 500;
          amount = 50;
          break;
        case 'Business':
          plan = 'Business';
          credits = 5000;
          amount = 250;
          break;
        default:
          return res.status(400).json({ success: false, message: "Invalid plan" });
      }
  
      console.log("Plan details:", { plan, credits, amount });
  
      const transactionData = {
        userId,
        plan,
        amount,
        credits,
        date: Date.now(),
      };
  
      const newTransaction = await transactionModel.create(transactionData);
  
      console.log("Transaction created:", newTransaction);
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: process.env.CURRENCY || "usd",
              product_data: { name: plan },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.ORIGIN}/verify?success=true&orderId=${newTransaction._id}`,
        cancel_url: `${process.env.ORIGIN}/verify?success=false&orderId=${newTransaction._id}`,
      });
  
      console.log("Stripe session created:", session);
  
      res.json({ success: true, session_url: session.url });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  
export  {registerUser,loginUser,userCredits,placeOrderStripe}