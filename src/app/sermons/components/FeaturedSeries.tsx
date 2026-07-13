import React from 'react';

interface Series {
  id: number;
  title: string;
  description: string;
  sermonCount: number;
  imageUrl: string;
  alt: string;
}

/* 
  FUTURE EDITING ZONE:
  When you want to add new series in the future, just change the text, 
  sermon count, and image paths inside this array!
*/
const series: Series[] = [
  {
    id: 1,
    title: 'Walking in Faith',
    description: 'A journey through the foundations of Christian faith and what it means to trust God in every season of life.',
    sermonCount: 6,
    imageUrl: '/assets/images/sermonsherophoto.png',
    alt: 'Open Bible on a wooden table with soft light streaming through a window',
  },
  {
    id: 2,
    title: 'Rooted in Love',
    description: "Exploring the depth of God's love and how it transforms our relationships, families, and communities.",
    sermonCount: 5,
    imageUrl: '/assets/images/congregation-photo-1783621144580.png',
    alt: 'Church congregation gathered together in worship with hands raised',
  },
  {
    id: 3,
    title: 'The Great Commission',
    description: 'Unpacking the call to go and make disciples of all nations and what that looks like in our everyday lives.',
    sermonCount: 4,
    imageUrl: '/assets/images/720318355_975915628579816_5709777563636170972_n.jpg',
    alt: 'Church members serving and ministering to the community outdoors',
  },
];

export default function FeaturedSeries() {
  // ─── CURRENTLY HIDDEN ───
  // Change "return null;" to "return (" when you are ready to show this section again!
  return null;

  /* 
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Featured Series</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Dive deeper into our curated sermon series designed to grow your faith and strengthen your walk with God.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {series.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>
                <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {item.sermonCount} Sermons
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  */
}