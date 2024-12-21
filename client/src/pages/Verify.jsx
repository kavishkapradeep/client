import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl, token,credit, setCredit,loadCreditsData} = useContext(AppContext);

  const verifyPayment = async () => {
    
    const sessionId = searchParams.get('session_id');
    const transactionId = searchParams.get('transaction_id');

    if (!sessionId || !transactionId) {
      toast.error('Missing payment details. Verification failed.');
      return;
    }

    try {
      const{data} = await axios.post(
        backendUrl+`/api/user/verifyStripe`,
        { sessionId, transactionId },
        { headers: { token } }
      );

      if (data.success) {
        loadCreditsData();
        toast.success('Payment verified successfully! Credits added.');
        
        navigate('/'); // Redirect to home or another page
      } else {
        toast.error('Payment verification failed.');
        navigate('/'); 
      }
      
    
    
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Error verifying payment. Please try again.');
    }
  };
 
  useEffect(() => {
    verifyPayment();
    
  }, [token]);
  
  return (
    <div className='  min-h-screen flex flex-row  place-self-center'>
        <div className=' relative place-self-center  flex '>
         <div className= 'bg-slate-500  mx-2 rounded-full w-4 h-4 place-self-center animate-bounce'>    
         <div className='bg-white  relative top-1  rounded-md w-2 h-2 place-self-center animate-ping'>
         </div>
         </div>
         
         <div className= 'bg-slate-500  mx-1  rounded-full w-4 h-4 place-self-center animate-bounce'>    
         <div className='bg-white  relative top-1   rounded-md w-2 h-2 place-self-center animate-ping'>
         </div>
         </div>
         
         <div className= 'bg-slate-500  mx-1  rounded-full w-4 h-4 place-self-center animate-bounce delay-75'>    
         <div className='bg-white  relative top-1   rounded-md w-2 h-2 place-self-center animate-ping '>
         </div>
         </div>


        </div>
    </div>
  );
};

export default PaymentSuccess;
