import React from 'react';
import { getAssetUrl } from '../utils/assets';

export default function WatermarkedImage({ 
  src, 
  alt, 
  className = '', 
  showWatermark = true,
  watermarkSize = 'md' // 'sm', 'md', 'lg'
}) {
  const watermarkSizes = {
    sm: 'w-48 h-48',
    md: 'w-72 h-72', 
    lg: 'w-96 h-96'
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Main Image */}
      <img 
        src={getAssetUrl(src)} 
        alt={alt} 
        className="w-full h-full object-cover"
      />
      
      {/* Watermark Overlay */}
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div 
            className={`${watermarkSizes[watermarkSize]} opacity-30`}
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/logos/logo-icon.svg)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              filter: 'brightness(0.5)'
            }}
          />
          {/* Additional smaller watermarks in corners for extra protection */}
          <div 
            className="absolute top-2 left-2 w-6 h-6 opacity-30"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/logos/logo-icon.svg)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(0.5)'
            }}
          />
          <div 
            className="absolute top-2 right-2 w-6 h-6 opacity-30"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/logos/logo-icon.svg)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(0.5)'
            }}
          />
          <div 
            className="absolute bottom-2 left-2 w-6 h-6 opacity-30"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/logos/logo-icon.svg)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(0.5)'
            }}
          />
          <div 
            className="absolute bottom-2 right-2 w-6 h-6 opacity-30"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/logos/logo-icon.svg)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(0.5)'
            }}
          />
        </div>
      )}
    </div>
  );
}