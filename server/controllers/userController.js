import userModel from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import transactionModel from "../models/transactionsModel.js";
import Stripe from 'stripe'
import { error } from "console";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

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
    const { origin } = req.headers;

    if (!userId || !planId) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let credits, plan, amount;
    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 1000; // Amount in cents (Stripe uses smallest currency unit)
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 5000;
        break;
      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 25000;
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    // Create a transaction entry in the database
    const transactionData = {
      userId,
      plan,
      amount,
      credits,
      date: Date.now(),
    };

    const newTransaction = await transactionModel.create(transactionData);

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Add more types if needed (e.g., 'ideal', 'sepa_debit')
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan} Plan - ${credits} Credits`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment", // Use "subscription" for recurring payments
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&transaction_id=${newTransaction._id}`,
      cancel_url: `${origin}/cancel`,
    });

    // Send the session URL for Stripe checkout
    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error in Stripe Payment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const verifyStripe = async (req, res) => {
  const { sessionId, transactionId } = req.body;

  try {
    if (!sessionId || !transactionId) {
      return res.json({ success: false, message: 'Missing sessionId or transactionId' });
    }

    
    // Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid') {
      // Retrieve the transaction and user data
      const transactionData = await transactionModel.findById(transactionId);
      if (!transactionData) {
        return res.json({ success: false, message: 'Transaction not found' });
      }

      const userData = await userModel.findById(transactionData.userId);
      if (!userData) {
        return res.json({ success: false, message: 'User not found' });
      }

      // Add credits to the user
      const newCreditBalance = userData.creditBalance + transactionData.credits;
      await userModel.findByIdAndUpdate(userData._id, { creditBalance: newCreditBalance });

      // Update the transaction status to 'paid'
      await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

      res.json({ success: true, message: 'Payment successful, credits added' });
    } else {
      res.json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error during Stripe payment verification:', error);
    res.json({ success: false, message: 'Error during payment verification' });
  }
};


  
export  {registerUser,loginUser,userCredits,placeOrderStripe,verifyStripe}