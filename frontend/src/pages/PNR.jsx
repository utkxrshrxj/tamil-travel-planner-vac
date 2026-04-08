import { useState } from 'react';
import { NavBar } from '../components/NavBar';
import { ticketAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export function PNR() {
  const [pnr, setPnr] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!pnr) return;
    setIsLoading(true);
    setErrorMsg('');
    setStatusResult(null);
    try {
      const res = await ticketAPI.getByPNR(pnr);
      setStatusResult(res.data);
    } catch (err) {
      console.error(err);
      // Mock response for demo
      setTimeout(() => {
         if(pnr === '1234567890') {
            setStatusResult({
               pnr: '1234567890',
               status: 'உறுதிப்படுத்தப்பட்டது',
               trainName: 'பாண்டியன் எக்ஸ்பிரஸ் (12637)',
               source: 'சென்னை',
               destination: 'மதுரை',
               date: '28 டிசம்பர் 2024',
               passengers: [
                 { name: 'பயணி 1', status: 'CNF', seat: 'B1-12' },
                 { name: 'பயணி 2', status: 'CNF', seat: 'B1-13' }
               ]
            });
         } else {
            setErrorMsg('PNR எண் கிடைக்கவில்லை. சரிபார்த்து மீண்டும் முயற்சிக்கவும்.');
         }
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brandLightBlue pb-20">
      <NavBar />
      
      <div className="max-w-2xl mx-auto px-4 mt-16">
        <div className="bg-white rounded-[24px] shadow-xl p-8 border border-blue-50 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
           <h1 className="text-3xl font-bold text-center text-primary mb-2">PNR நிலை சரிபார்க்க</h1>
           <p className="text-center text-brandMutedText mb-8">உங்கள் பயணத்தின் தற்போதைய நிலையை அறிய PNR எண்ணை உள்ளிடவும்</p>

           <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
              <input 
                type="text" 
                value={pnr} 
                onChange={(e) => setPnr(e.target.value)} 
                placeholder="10 இலக்க PNR எண்..." 
                className="input-field flex-1 text-xl tracking-widest font-mono text-center md:text-left"
                maxLength={10}
                required
              />
              <button type="submit" disabled={isLoading} className="btn-primary px-8">
                 {isLoading ? 'தேடுகிறது...' : 'சரிபார்க்க'}
              </button>
           </form>

           {errorMsg && <div className="bg-red-50 text-brandRed p-4 rounded-lg font-bold text-center mb-6">{errorMsg}</div>}

           {statusResult && (
             <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 slide-in">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <div>
                     <p className="text-sm text-brandMutedText font-semibold">PNR எண்</p>
                     <p className="text-2xl font-bold font-mono text-brandDarkText">{statusResult.pnr}</p>
                  </div>
                  <div className="bg-brandGreen text-white px-4 py-2 rounded-full font-bold shadow-sm">
                     {statusResult.status}
                  </div>
                </div>

                <div className="mb-6">
                   <h3 className="font-bold text-lg text-primary">{statusResult.trainName}</h3>
                   <p className="font-semibold text-brandDarkText mt-1">{statusResult.source} ➔ {statusResult.destination}</p>
                   <p className="text-brandMutedText text-sm font-semibold">{statusResult.date}</p>
                </div>

                <h4 className="font-bold border-b pb-2 mb-3">பயணிகள் நிலை</h4>
                <div className="space-y-3 mb-6">
                   {statusResult.passengers?.map((p, i) => (
                      <div key={i} className="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-gray-100">
                         <span className="font-semibold">{p.name}</span>
                         <div className="text-right">
                            <span className="text-sm font-bold text-brandGreen block">{p.status}</span>
                            <span className="text-xs font-bold text-brandMutedText">{p.seat}</span>
                         </div>
                      </div>
                   ))}
                </div>

                <button onClick={() => navigate('/login')} className="w-full text-primary font-bold hover:underline">
                   உள்நுழைந்து முழு டிக்கெட் பார்க்க ➔
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
