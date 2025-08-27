import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from '@components/error';
import Navbar from '@components/navbar';
import HotelDetailsPage from '@/pages/hotelsDetail';
import MagazineDetail from '@pages/magazineDetail';
import TravelDetailPage from '@pages/travelDestinationDetail';
import NewsDetail from '@pages/newsDetail';
import DocumentDetail from '@pages/documentsDetail';
import "@/i18n/i18n"

import ScrollToTop from './components/ScroolToTop';
import Service from './pages/services';
import Resort from './pages/resort';
import { Helmet } from 'react-helmet-async';
import Banks from './pages/banks';
import Clinics from './pages/clinics';
import Markets from './pages/market';
import ResortDetail from './pages/resortDetail';
import MarketDetail from './pages/market/marketDetail';
import ClinicDetail from './pages/clinics/clinicDetail';
import BankDetail from './pages/banks/bankDetail';
import Media from './pages/media';
import ArticleDetail from './pages/media/article-Detail';
import NewsDetailPage from './pages/media/news-Detail';
import Airplane from './pages/airplane';
import TourBus from './pages/tourbus';
import BusDetail from './pages/tourbus/busDetail';
import AirplaneDetail from './pages/airplane/airplaneDetail';
import Footer from './components/footer';
// import Footer from './components/footer';

const Home = lazy(() => import('@pages/home'));
const Magazines = lazy(() => import('@/pages/magazines'));
const Article = lazy(() => import('@/pages/article'));
const Hotels = lazy(() => import('@pages/hotels'));
const TravelDestination = lazy(() => import('@/pages/travelDestination'));
const Documents = lazy(() => import('@/pages/documents'));
const NotFound = lazy(() => import('@pages/notFound'));
const Maps = lazy(() => import('@pages/maps'));

const knownPaths = [
  '/news', '/magazines', '/article', '/hotels', '/',
  '/travel-destination', '/documents', '/maps',
  '/magazines/:id', '/hotels/:idAndSlug', '/hotels/:id',
  '/travel-destination/:id', "/news/:idAndSlug", "/article/:id", "/services",
  '/services/resort', '/services/tour-firm','/services/airplanes', '/services/tour-bus', '/services/banks', '/services/clinics',
  '/services/market', '/services/resort/:id', '/services/tours', '/services/tour/:id', '/services/shop/:id', '/services/clinic/:id',
  '/services/bank/:id', '/media/news', '/media/article/detail/:id', '/media/news/detail/:id', '/services/airplane/:id','/services/tour-bus/:idSlug'
];

const AppContent = () => {
  const location = useLocation();

  const isKnownPath = knownPaths.some((path) => {
    const pathPattern = path.replace(/:\w+/g, '.*');
    return new RegExp(`^${pathPattern}$`).test(location.pathname);
  });


  return (
    <>
    <Helmet>
      <meta name="google-site-verification" content="google846d702df5c0d815" />
    </Helmet>
      {isKnownPath && <Navbar />}
      <Suspense fallback={<p className="text-center mt-10 text-gray-500">Loading...</p>}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news/:idSlug" element={<NewsDetail />} />
          <Route path="/magazines" element={<Magazines />} />
          <Route path="/article" element={<Article />} />
          <Route path="/article/:idSlug" element={<ArticleDetail />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/services/tours" element={<TravelDestination />} />
          <Route path='/services/tour/:idSlug' element={<TravelDetailPage />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/magazines/:idSlug" element={<MagazineDetail />} />
          <Route path="/hotels/:idSlug" element={<HotelDetailsPage />} />
          <Route path="/documents/:id" element={<DocumentDetail />} />
          <Route path='/services' element={<Service />} />
          <Route path='/services/resort' element={<Resort />} />
          <Route path='/services/banks' element={<Banks />} />
          <Route path='/services/clinics' element={<Clinics />} />
          <Route path='/services/market' element={<Markets />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/services/resort/:idSlug" element={<ResortDetail />} />
          <Route path='/services/clinics' element={<Clinics />} />
          <Route path='/services/shop/:idSlug' element={<MarketDetail />} />
          <Route path='/services/clinic/:idSlug' element={<ClinicDetail />} />
          <Route path='/services/bank/:idSlug' element={<BankDetail />} />
          <Route path='/services/tour-bus/:idSlug' element={<BusDetail />} />
          <Route path='/services/airplane/:idSlug' element={<AirplaneDetail />} />
          <Route path='/media/news/' element={<Media />} />
          <Route path='/media/article/detail/:idSlug' element={<ArticleDetail />} />
          <Route path='/media/news/detail/:idSlug' element={<NewsDetailPage />} />
          <Route path='/services/airplanes' element={<Airplane />} />
          <Route path='/services/tour-bus' element={<TourBus/>}/>
        </Routes>
      </Suspense>
      <Footer /> 
    </>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
