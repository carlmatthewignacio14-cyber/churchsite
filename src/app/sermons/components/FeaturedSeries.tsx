import React from 'react';

// Keeping the interface and array intact prevents any typescript reference breaks elsewhere
interface Series {
  id: number;
  title: string;
  description: string;
  sermonCount: number;
  imageUrl: string;
  alt: string;
}

const series: Series[] = [];

export default function FeaturedSeries() {
  // Returning null hides this entire section from your page completely and safely
  return null;
}