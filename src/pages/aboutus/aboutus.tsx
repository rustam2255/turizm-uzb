import React from 'react';
import { MapPin,  Instagram, Send, Globe, Camera, Users, Award, Star, Building, Utensils, Landmark } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      {/* Mission Statement */}
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Biz haqimizda</h2>
            <div className="prose prose-lg text-gray-700 space-y-6">
              <p className="text-xl leading-relaxed">
                <strong>TOURISM UZBEKISTAN</strong> — premium ikki tilli turistik jurnal bo'lib,
                O'zbekistonni ichki va xalqaro sayohatchilar uchun eng jozibador yo'nalishlardan biri
                sifatida targ'ib etishga xizmat qiladi.
              </p>
              <p className="leading-relaxed">
                Biz hashamat va madaniyatni, zamonaviy tendensiyalar va abadiy qadriyatlarni uyg'unlashtirib,
                O'zbekistonni dunyoga sayohat, tarix, gastronomiya, arxitektura, biznes va tibbiy turizm
                orqali namoyon etamiz.
              </p>
            </div>
          </div>
          <div className="p-8 md:flex justify-between gap-50  border">
            <div>
              <h4 className="text-xl  font-bold mb-2">Marketing bo'limi</h4>
              <p className="text-black mb-4">Reklama va hamkorlik uchun</p>
              <div className="space-y-2 text-sm">
                <p className="text-sky-900">+998 77 480 00 12</p>
                <p className="text-sky-900">+998 77 340 77 73</p>
                <p className="text-sky-900">+998 97 700 02 78</p>
              </div>
            </div>
            <div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Manzil</h3>
                <p className="text-black leading-relaxed">
                  Toshkent shahar, Yakkasaroy tumani<br />
                  Qushbegi mavzesi, Qushbegi ko'chasi 11A uy
                </p>
              </div>
              <div className="flex mt-4 space-x-4">
                <a href="#" className="w-16 h-16 bg-sky-900  flex items-center justify-center hover:scale-110 transition-transform duration-300 group">
                  <Send className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                </a>
                <a href="#" className="w-16 h-16 bg-sky-900 flex items-center justify-center hover:scale-110 transition-transform duration-300 group">
                  <Instagram className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Features */}
      <div className=" py-5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-5">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Har bir sonimizda</h2>
            <p className="text-xl text-gray-600">Professional kontent va eksklyuziv materiallar</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8  shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-sky-900 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Eksklyuziv Intervyular</h3>
              <p className="text-gray-600 leading-relaxed">
                Soha yetakchilari va mashhur shaxslar bilan maxsus suhbatlar
              </p>
            </div>

            <div className="bg-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-sky-900 flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chuqur Tahlil</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional darajada tayyorlangan tahliliy maqolalar
              </p>
            </div>

            <div className="bg-white p-8  shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-sky-900 flex items-center justify-center mb-6">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Dizayn</h3>
              <p className="text-gray-600 leading-relaxed">
                Xalqaro darajadagi foto va dizayn elementlari
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tourism Categories */}
      <div className="py-5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-5">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Bizning Yo'nalishlar</h2>
            <p className="text-xl text-gray-600">O'zbekistonni turli jihatdan ochib beruvchi kontent</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: "Sayohat", color: "sky-900" },
              { icon: Landmark, title: "Tarix", color: "sky-900" },
              { icon: Utensils, title: "Gastronomiya", color: "sky-900" },
              { icon: Building, title: "Arxitektura", color: "sky-900" },
              { icon: Globe, title: "Biznes Turizm", color: "sky-900" },
              { icon: Award, title: "Tibbiy Turizm", color: "sky-900" }
            ].map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white p-6  shadow-md group-hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className={`w-14 h-14 bg-${item.color}  flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className=" text-black py-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold mb-3">Nima uchun biz?</h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              TOURISM UZBEKISTAN oddiy jurnal emas. U — biznes uchun nufuzli platforma va
              premium auditoriya bilan ishonchli muloqot vositasi bo'lib, mamlakatimizning
              ijobiy qiyofasini shakllantiradi va yangi investitsiya imkoniyatlarini ochadi.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-2">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building className="w-10 h-10 " />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-sky-900">Biznes Platforma</h3>
              <p className="">Nufuzli biznes muhit yaratish</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-sky-900">Premium Auditoriya</h3>
              <p className="">Sifatli va maxsus auditoriya</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="w-10 h-10 " />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-sky-900">Global Impact</h3>
              <p className="">O'zbekistonning ijobiy qiyofasi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;