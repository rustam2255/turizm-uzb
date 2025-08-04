// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp } from 'lucide-react';

// interface OpenSections {
//   garden: boolean;
//   business: boolean;
//   corporate: boolean;
//   terms: boolean;
//   hotels: boolean;
//   vacation: boolean;
//   caesars: boolean;
//   contact: boolean;
// }

// interface FooterSection {
//   title: string;
//   items: string[];
// }

// interface Brand {
//   name: string;
//   subtitle?: string;
//   logo?: boolean;
// }

// const Footer: React.FC = () => {
//   const [openSections, setOpenSections] = useState<OpenSections>({
//     garden: false,
//     business: false,
//     corporate: false,
//     terms: false,
//     hotels: false,
//     vacation: false,
//     caesars: false,
//     contact: false
//   });

//   const toggleSection = (section: keyof OpenSections): void => {
//     setOpenSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const footerData: Record<string, FooterSection> = {
//     garden: {
//       title: 'Wyndham Garden',
//       items: ['Weddings', 'About', 'Locations', 'Road Trip Guide']
//     },
//     business: {
//       title: 'Wyndham Business',
//       items: ['Join Wyndham Business', 'Managed Travel Programs', 'Projects & Groups', 'Small & Mid-Size Business', 'Travel Advisors']
//     },
//     corporate: {
//       title: 'Corporate Resources',
//       items: ['Corporate Website', 'Media Center', 'Franchise Information', 'Career', 'Social Responsibility']
//     },
//     terms: {
//       title: 'Terms & Policies',
//       items: ['Best Rate Guarantee', 'Privacy Notice', 'Terms of Use', 'About Safemark', 'Cookie Consent', 'Do Not Sell My Personal Information']
//     }
//   };

//   const hotelBrands: Record<string, Brand[]> = {
//     'EXTENDED STAY': [
//       { name: 'Hawthorn', subtitle: 'EXTENDED STAY' },
//       { name: 'waterwalk', subtitle: 'EXTENDED STAY' }
//     ],
//     'ECONOMY': [
//       { name: 'Days Inn', logo: true },
//       { name: 'Super 8', logo: true },
//       { name: 'MICROTEL', subtitle: 'BY WYNDHAM' },
//       { name: 'Howard Johnson', logo: true }
//     ],
//     'MIDSCALE': [
//       { name: 'LA QUINTA', logo: true },
//       { name: 'WINGATE', subtitle: 'BY WYNDHAM' },
//       { name: 'WYNDHAM GARDEN', logo: true },
//       { name: 'AmericInn', logo: true }
//     ],
//     'LIFESTYLE': [
//       { name: 'TRYP', subtitle: 'BY WYNDHAM' },
//       { name: 'esplendor', logo: true },
//       { name: 'DAZZLER', logo: true },
//       { name: 'VIENNA HOUSE', logo: true }
//     ],
//     'UPSCALE': [
//       { name: 'WYNDHAM', logo: true },
//       { name: 'TM', subtitle: 'TRADEMARK COLLECTION BY WYNDHAM' }
//     ],
//     'DISTINCTIVE': [
//       { name: 'REGISTRY', subtitle: 'COLLECTION HOTELS' },
//       { name: 'DOLCE', subtitle: 'HOTELS AND RESORTS' },
//       { name: 'WYNDHAM GRAND', logo: true }
//     ]
//   };

//   const vacationBrands: Brand[] = [
//     { name: 'CLUB WYNDHAM', logo: true },
//     { name: 'WORLDMARK', subtitle: 'BY WYNDHAM' },
//     { name: 'SHELL VACATIONS CLUB', logo: true },
//     { name: 'MARGARITAVILLE VACATION CLUB', logo: true },
//     { name: 'cottages.com', logo: true },
//     { name: 'vacasa', logo: true }
//   ];

//   const caesarsBrands: Brand[] = [
//     { name: 'CAESARS', logo: true },
//     { name: 'HARRAHS', logo: true },
//     { name: 'HORSESHOE', logo: true },
//     { name: 'ELDORADO', logo: true },
//     { name: 'TROPICANA', logo: true },
//     { name: 'Flamingo', logo: true },
//     { name: 'THE CROMWELL', logo: true },
//     { name: 'SILVER LEGACY', logo: true }
//   ];

//   return (
//     <footer className="bg-[rgba(77,199,232,1)] text-white">
//       {/* Main Footer Content */}
//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
//           {Object.entries(footerData).map(([key, section]) => (
//             <div key={key} className="space-y-4">
//               <button
//                 onClick={() => toggleSection(key)}
//                 className="flex items-center justify-between w-full text-left"
//               >
//                 <h3 className="text-lg font-semibold text-white">{section.title}</h3>
//                 {openSections[key] ? 
//                   <ChevronUp className="w-5 h-5 text-white/80" /> : 
//                   <ChevronDown className="w-5 h-5 text-white/80" />
//                 }
//               </button>
              
//               {openSections[key] && (
//                 <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
//                   {section.items.map((item, index) => (
//                     <div key={index}>
//                       <a href="#" className="block text-white/90 hover:text-white transition-colors duration-200 text-sm py-1">
//                         {item}
//                       </a>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Contact Section */}
//         <div className="border-t border-white/20 pt-8 mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-white">Contact</h3>
//             <button onClick={() => toggleSection('contact')}>
//               {openSections.contact ? 
//                 <ChevronUp className="w-5 h-5 text-white/80" /> : 
//                 <ChevronDown className="w-5 h-5 text-white/80" />
//               }
//             </button>
//           </div>
          
//           {openSections.contact && (
//             <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
//               <p className="text-white/90 text-sm">Reservations: (800) 407-9832</p>
//               <p className="text-white/90 text-sm">Customer Care/Help</p>
//             </div>
//           )}
//         </div>

//         {/* Wyndham Rewards */}
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-white mb-8">WYNDHAM REWARDS®</h2>
//         </div>

//         {/* Hotels by Wyndham */}
//         <div className="mb-12">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-xl font-semibold text-white text-center w-full">HOTELS BY WYNDHAM</h3>
//             <button onClick={() => toggleSection('hotels')}>
//               {openSections.hotels ? 
//                 <ChevronUp className="w-6 h-6 text-white/80" /> : 
//                 <ChevronDown className="w-6 h-6 text-white/80" />
//               }
//             </button>
//           </div>
          
//           {openSections.hotels && (
//             <div className="animate-in slide-in-from-top-2 duration-200">
//               {Object.entries(hotelBrands).map(([category, brands]) => (
//                 <div key={category} className="mb-8">
//                   <h4 className="text-sm font-semibold text-white/80 text-center mb-4">{category}</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {brands.map((brand, index) => (
//                       <div key={index} className="text-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200">
//                         <div className="text-white font-semibold">{brand.name}</div>
//                         {brand.subtitle && (
//                           <div className="text-white/70 text-xs mt-1">{brand.subtitle}</div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>


 


//       </div>
//     </footer>
//   );
// };

// export default Footer;