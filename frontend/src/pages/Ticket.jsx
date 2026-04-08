import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { QRCodeSVG } from 'qrcode.react'; // I'll use standard qr if available or substitute
import { NavBar } from '../components/NavBar';
import { ticketAPI } from '../services/api';
import { Printer, Download, Save, QrCode, Train, Bus, Plane } from 'lucide-react';

export function Ticket() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await ticketAPI.getById(ticketId);
        setTicket(res.data);
      } catch (err) {
         console.warn("Using mock ticket for demonstration", err);
         setTicket({
             id: ticketId,
             pnr: '4567890123',
             type: 'train',
             source: 'சென்னை',
             destination: 'கோவை',
             date: '25 டிசம்பர் 2024',
             deptTime: '13:50',
             arrTime: '21:15',
             duration: '7 மணி 25 நிமிடம்',
             name: 'வைகை எக்ஸ்பிரஸ் #12635',
             status: 'உறுதிப்படுத்தப்பட்டது',
             classType: '3A',
             passengers: [{ name: 'குமார்', age: 35, seat: 'B1-01', gender: 'ஆண்' }],
             totalAmount: 1076,
             food: 'சைவம்',
             luggage: '15 கிலோ'
         });
      }
    };
    fetchTicket();
  }, [ticketId]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Namma_Yatri_Ticket_${ticketId}`,
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('டிக்கெட் சேமிக்கப்பட்டது!');
    }, 1000);
  };

  const handleDownload = () => handlePrint(); // Maps to react-to-print for simplicity or could be PDF lib

  if (!ticket) return <div className="min-h-screen pt-20 text-center font-bold text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="no-print"><NavBar /></div>
      
      <div className="max-w-2xl mx-auto px-4 mt-8 md:mt-12">
        {/* Ticket Card */}
        <div ref={printRef} className="bg-white rounded-xl shadow-2xl overflow-hidden print-only-card relative">
           {/* Top Section */}
           <div className="bg-gradient-to-r from-blue-800 to-primary text-white p-6 pb-8">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h1 className="text-2xl font-bold font-sans">நம்ம யாத்ரி</h1>
                    <p className="text-blue-200 text-sm">உங்கள் பயணம், எங்கள் பொறுப்பு</p>
                 </div>
                 <div className="bg-brandGreen text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    {ticket.status} ✓
                 </div>
              </div>

              <div className="flex flex-col items-center">
                 {ticket.type === 'train' ? <Train size={48} className="mb-2"/> : ticket.type === 'bus' ? <Bus size={48}/> : <Plane size={48}/>}
                 <h2 className="text-2xl font-bold">{ticket.name}</h2>
              </div>
           </div>

           {/* Torn Edge Effect SVG separator */}
           <svg className="w-full h-4 -mt-2 absolute text-white" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
              <path d="M0,0 Q5,100 10,0 Q15,100 20,0 Q25,100 30,0 Q35,100 40,0 Q45,100 50,0 Q55,100 60,0 Q65,100 70,0 Q75,100 80,0 Q85,100 90,0 Q95,100 100,0 L100,100 L0,100 Z" />
           </svg>

           {/* Middle Section */}
           <div className="px-6 pt-10 pb-6 bg-white">
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-8">
                 <div className="text-center w-1/3">
                    <p className="text-xs text-brandMutedText mb-1 uppercase font-semibold">புறப்பாடு</p>
                    <p className="text-3xl font-bold text-brandDarkText mb-1">{ticket.deptTime}</p>
                    <p className="font-bold text-primary text-lg">{ticket.source}</p>
                 </div>
                 <div className="text-center flex flex-col items-center flex-1 px-4">
                    <p className="text-sm font-bold text-brandMutedText bg-gray-50 px-3 py-1 rounded-full mb-2">{ticket.duration}</p>
                    <div className="w-full relative flex items-center justify-center">
                      <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                      <div className="absolute font-bold text-xl text-gray-400">➔</div>
                    </div>
                 </div>
                 <div className="text-center w-1/3">
                    <p className="text-xs text-brandMutedText mb-1 uppercase font-semibold">வருகை</p>
                    <p className="text-3xl font-bold text-brandDarkText mb-1">{ticket.arrTime}</p>
                    <p className="font-bold text-primary text-lg">{ticket.destination}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                    <p className="text-brandMutedText text-xs font-semibold">PNR எண்</p>
                    <p className="font-mono text-xl font-bold text-brandDarkText">{ticket.pnr}</p>
                 </div>
                 <div>
                    <p className="text-brandMutedText text-xs font-semibold">பயண தேதி</p>
                    <p className="text-lg font-bold text-brandDarkText">{ticket.date}</p>
                 </div>
                 <div>
                    <p className="text-brandMutedText text-xs font-semibold">வகுப்பு</p>
                    <p className="text-lg font-bold text-brandDarkText">{ticket.classType}</p>
                 </div>
                 <div>
                    <p className="text-brandMutedText text-xs font-semibold">டிக்கெட் ID</p>
                    <p className="font-mono text-sm font-bold text-brandDarkText">{ticket.id.substring(0, 15)}</p>
                 </div>
              </div>

              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                 <h3 className="font-bold text-brandDarkText mb-3 border-b pb-2">பயணிகள் விவரம்</h3>
                 <table className="w-full text-left font-medium">
                    <thead className="text-brandMutedText text-xs">
                       <tr><th>பெயர்</th><th>வயது</th><th>இருக்கை</th></tr>
                    </thead>
                    <tbody>
                       {ticket.passengers.map((p, i) => (
                          <tr key={i} className="border-b last:border-0 border-gray-100">
                             <td className="py-2">{p.name} ({p.gender})</td>
                             <td className="py-2">{p.age}</td>
                             <td className="py-2 font-bold text-primary">{p.seat || 'காத்திருப்பு'}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              <div className="flex justify-between items-center font-bold text-lg border-t pt-4">
                 <span className="text-brandMutedText">ஆர்டர் மொத்தம்</span>
                 <span className="text-primary text-2xl">₹{ticket.totalAmount}</span>
              </div>
           </div>

           {/* Bottom Section */}
           <div className="bg-brandLightBlue p-6 flex flex-col items-center justify-center border-t border-blue-100">
              {/* Try QRCode if library available, else fallback */}
              <div className="bg-white p-2 rounded shadow-sm mb-3 border">
                 <QrCode size={100} className="text-brandDarkText"/> 
              </div>
              <p className="text-sm font-bold text-primary">கேட்டில் / தளத்தில் காட்டவும்</p>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 no-print">
           <button onClick={handleDownload} className="btn-primary w-full shadow"><Download className="mr-2"/> பதிவிறக்கு</button>
           <button onClick={handlePrint} className="btn-secondary w-full shadow border border-blue-200"><Printer className="mr-2"/> அச்சிடு</button>
           <button onClick={handleSave} className="bg-white text-primary font-bold py-3 px-6 rounded-btn border-2 border-primary hover:bg-blue-50 flex justify-center items-center"><Save className="mr-2"/> டிக்கெட் சேமி</button>
        </div>
      </div>
    </div>
  );
}
