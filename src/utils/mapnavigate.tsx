export  const openGoogleMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}&travelmode=driving`;
    window.open(url, '_blank');
  };

 export const openYandexMaps = (lat: number, lng: number) => {
    const url = `https://yandex.uz/maps/?rtext=~${lat},${lng}&rtt=auto`;
    window.open(url, '_blank');
  };

  // Mobil qurilmalarda native map dasturini ochish
 export const openNativeMap = (lat: number, lng: number, name: string) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // iOS uchun Apple Maps
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const url = `maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
        window.location.href = url;
      } else {
        // Android uchun Google Maps
        const url = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(name)})`;
        window.location.href = url;
      }
    } else {
      // Desktop'da Google Maps ochish
      openGoogleMaps(lat, lng, name);
    }
  };