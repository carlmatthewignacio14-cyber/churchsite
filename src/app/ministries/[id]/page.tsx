'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

const ministriesDetails: Record<string, {
  name: string;
  tagline: string;
  description: string;
  fullDescription: string;
  image: string;
  buildingLocation: string;
  schedule: string;
  leader: {
    name: string;
    role: string;
    bio: string;
    image: string;
    email: string;
    phone: string;
    messenger: string;
  };
  events: { id: string; title: string; date: string; time: string; location: string; description: string }[];
  testimonials: { quote: string; author: string; role: string }[];
}> = {
  youth: {
    name: 'Youth Ministry',
    tagline: 'Ages 13–35',
    description: 'A vibrant space where teenagers and young adults discover identity, purpose, and community.',
    fullDescription: 'Our Youth Ministry is designed to empower the next generation with biblical truth, authentic fellowship, and leadership opportunities. Through weekly gatherings, annual youth camps, and outreach programs, young people find a safe environment to grow in Christ.',
    image: '/assets/images/710299155_970621969219794_887923649744832117_n-1783629134755.jpg',
    buildingLocation: 'Youth Center, Room 204 (Second Floor)',
    schedule: 'Every Sunday at 3:00 PM',
    leader: {
      name: 'Pastor Michael Santos',
      role: 'Youth Pastor',
      bio: 'Pastor Mike has been leading youth and young adult ministries for over 8 years, passionate about seeing the next generation boldly live out their faith.',
      image: '/assets/images/728094408_988529577429033_74278605388633550_n.jpg',
      email: 'youth.cogop@gmail.com',
      phone: '+63 917 123 4567',
      messenger: 'https://m.me/kianesses',
    },
    events: [
      { id: '1', title: 'Friday Night Youth Ignite', date: 'Every Friday', time: '7:00 PM - 9:30 PM', location: 'Youth Center, Room 204', description: 'Worship, interactive message, games, and snack fellowship.' },
      { id: '2', title: 'Youth Worship Jam Session', date: 'Last Saturday of the Month', time: '5:00 PM - 8:00 PM', location: 'Main Sanctuary', description: 'An acoustic night of extended worship and group prayer.' },
    ],
    testimonials: [
      { quote: 'Finding this youth community completely changed how I view my faith. I found true friends who hold me accountable.', author: 'Joshua M.', role: 'Youth Member (3 Years)' },
      { quote: 'The leadership team genuinely listens and cares about what we go through as students and young professionals.', author: 'Bea S.', role: 'College Group Leader' },
    ],
  },
  women: {
    name: "Women's Ministry",
    tagline: 'Community & Growth',
    description: 'Monthly gatherings, Bible studies, and retreats for women of all ages.',
    fullDescription: 'The Women’s Ministry exists to nurture spiritual growth, sisterhood, and mutual encouragement. We study the Word together, support one another through life seasons, and serve our local church community with grace.',
    image: '/assets/images/695475790_952572347691423_8949784877680740857_n.jpg',
    buildingLocation: 'Main Fellowship Hall, East Wing',
    schedule: 'Second Saturday of every month at 2:00 PM',
    leader: {
      name: 'Sis. Rachel Reyes',
      role: 'Women’s Ministry Director',
      bio: 'Rachel has a heart for mentoring women through deep biblical study and creating safe spaces for authentic fellowship and healing.',
      image: '/assets/images/695475790_952572347691423_8949784877680740857_n.jpg',
      email: 'women.cogop@gmail.com',
      phone: '+63 918 234 5678',
      messenger: 'https://m.me/',
    },
    events: [
      { id: '1', title: 'Women’s Morning Prayer & Brunch', date: 'Second Saturday of the Month', time: '9:00 AM - 11:30 AM', location: 'Fellowship Hall', description: 'Enjoy breakfast, sisterhood fellowship, and a focused devotional.' },
      { id: '2', title: 'Seasonal Sisterhood Retreat', date: 'Annually in October', time: 'All Day', location: 'Tagaytay Conference Center', description: 'A weekend getaway focused on renewal, rest, and connection.' },
    ],
    testimonials: [
      { quote: 'The monthly brunches and prayer circles have been my sanctuary during busy weeks. I am deeply blessed by these women.', author: 'Elena R.', role: 'Ministry Participant' },
    ],
  },
  men: {
    name: "Men's Ministry",
    tagline: 'Brotherhood',
    description: 'Equipping men to lead with integrity in home, work, and community.',
    fullDescription: 'Men of Valor is dedicated to building strong, accountable brotherhoods. We challenge one another to step up as spiritual leaders through honest conversations, breakfast gatherings, and community service projects.',
    image: '/assets/images/728094408_988529577429033_74278605388633550_n.jpg',
    buildingLocation: 'Fellowship Hall, Room 102',
    schedule: 'Third Saturday of every month at 7:00 AM',
    leader: {
      name: 'Bro. David Mendoza',
      role: 'Men’s Fellowship Coordinator',
      bio: 'David is dedicated to encouraging men to walk authentically with God, lead their families with love, and serve with integrity.',
      image: '/assets/images/728094408_988529577429033_74278605388633550_n.jpg',
      email: 'men.cogop@gmail.com',
      phone: '+63 919 345 6789',
      messenger: 'https://m.me/',
    },
    events: [
      { id: '1', title: 'Men’s Breakfast & Brotherhood Talk', date: 'Third Saturday of the Month', time: '7:00 AM - 9:00 AM', location: 'Fellowship Hall', description: 'Hot breakfast, coffee, and practical teaching on godly leadership.' },
      { id: '2', title: 'Community Service & Build Day', date: 'Quarterly', time: '8:00 AM - 12:00 PM', location: 'Local Community Project', description: 'Putting our faith into action by serving families and maintaining grounds.' },
    ],
    testimonials: [
      { quote: 'Iron sharpens iron here. Being surrounded by men who genuinely pursue God has transformed my role as a father and husband.', author: 'Mark D.', role: 'Core Member' },
    ],
  },
  worship: {
    name: 'Worship Team',
    tagline: 'Lead in Song',
    description: 'Join our music ministry — vocalists, instrumentalists, and production crew welcome.',
    fullDescription: 'Our Worship Ministry facilitates encounters with God through music, arts, and technical production. We value excellence, spiritual depth, and a servant’s heart in creating an atmosphere of worship.',
    image: '/assets/images/727928138_988525360762788_1191887275324024034_n.jpg',
    buildingLocation: 'Main Sanctuary & Media Booth',
    schedule: 'Rehearsals every Thursday at 7:30 PM',
    leader: {
      name: 'Bro. Jonathan Cruz',
      role: 'Worship Director',
      bio: 'Jonathan has spent over a decade leading congregations in dynamic worship and training musicians and tech crews to excel in technical arts.',
      image: '/assets/images/727928138_988525360762788_1191887275324024034_n.jpg',
      email: 'worship.cogop@gmail.com',
      phone: '+63 920 456 7890',
      messenger: 'https://m.me/',
    },
    events: [
      { id: '1', title: 'Weekly Worship Practice & Sound Check', date: 'Thursdays', time: '7:30 PM - 9:30 PM', location: 'Sanctuary Stage', description: 'Reviewing setlists, vocal arrangements, and instrumental transitions.' },
      { id: '2', title: 'Creative Arts & Tech Workshop', date: 'Bi-monthly on Saturdays', time: '2:00 PM - 5:00 PM', location: 'Media Room', description: 'Training sessions for audio engineering, lighting, and media projection.' },
    ],
    testimonials: [
      { quote: 'Serving on the audio and production team taught me how technical skill can be offered as a direct act of worship.', author: 'Carlo P.', role: 'Tech & Media Crew' },
    ],
  },
  kids: {
    name: "Kid's Ministry",
    tagline: 'Developing Leaders, Discipling Kids',
    description: 'A fun, safe, and engaging environment where kids learn faith through interactive Bible stories.',
    fullDescription: 'NextGen Kids provides a secure, joyful atmosphere tailored specifically for children. Through interactive lessons, crafts, games, and dynamic worship, we plant the seeds of God’s love early on.',
    image: '/assets/images/720318355_975915628579816_5709777563636170972_n.jpg',
    buildingLocation: 'Kids Wing, Ground Floor (Rooms 101–105)',
    schedule: 'Every Sunday during main worship services',
    leader: {
      name: 'Sis. Anna Marie Lim',
      role: 'Children’s Ministry Coordinator',
      bio: 'Teacher Anna is an early childhood educator with a deep calling to make learning about Jesus fun, engaging, and foundational for kids.',
      image: '/assets/images/720318355_975915628579816_5709777563636170972_n.jpg',
      email: 'kids.cogop@gmail.com',
      phone: '+63 921 567 8901',
      messenger: 'https://m.me/',
    },
    events: [
      { id: '1', title: 'Sunday Kid’s Church Experience', date: 'Every Sunday', time: '9:30 AM & 4:00 PM', location: 'Kids Wing & Rooms', description: 'Age-appropriate Bible lessons, fun crafts, and interactive games.' },
      { id: '2', title: 'Annual Vacation Bible School (VBS)', date: 'Summer Season', time: '8:00 AM - 12:00 PM', location: 'Church Grounds', description: 'A week-long immersive themed camp filled with learning and activities.' },
    ],
    testimonials: [
      { quote: 'My children look forward to Sunday school all week long. The teachers make learning about Jesus so engaging and joyful!', author: 'Sarah L.', role: 'Parent' },
    ],
  },
};

export default function MinistryDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : 'youth';
  const ministry = ministriesDetails[id] || ministriesDetails['youth'];

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', interest: 'Join as Member' });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/ministries" className="text-xs font-semibold tracking-wider uppercase text-accent hover:underline flex items-center gap-2">
            ← Back to All Ministries
          </Link>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden shadow-xl border border-border">
            <AppImage
              src={ministry.image}
              alt={ministry.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase bg-primary/15 text-primary px-3 py-1.5 rounded-full w-fit">
              {ministry.tagline}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold">{ministry.name}</h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-light">
              {ministry.fullDescription}
            </p>

            {/* Clear Meeting Times & Locations Block */}
            <div className="bg-card border border-border p-4 rounded-xl mt-2 grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-accent">📍 Location:</span>
                <span className="font-semibold text-foreground">{ministry.buildingLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-accent">🕒 Schedule:</span>
                <span className="font-semibold text-foreground">{ministry.schedule}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ministry Leadership & Bio Section */}
        <div className="mb-16 bg-card border border-border p-8 rounded-3xl shadow-md">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-accent block mb-2">
            Meet Your Leader
          </span>
          <h2 className="font-display text-2xl font-bold mb-6">Ministry Leadership &amp; Direct Contact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden shadow-md border border-border">
              <AppImage
                src={ministry.leader.image}
                alt={ministry.leader.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="md:col-span-2 flex flex-col gap-3">
              <div>
                <h3 className="font-display text-xl font-bold">{ministry.leader.name}</h3>
                <p className="text-xs text-accent uppercase tracking-wider font-semibold">{ministry.leader.role}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                &ldquo;{ministry.leader.bio}&rdquo;
              </p>

              {/* Direct Contact Options */}
              <div className="border-t border-border pt-4 mt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${ministry.leader.email}`}
                  className="bg-background border border-border px-3 py-2 rounded-xl text-xs font-semibold hover:border-primary transition-colors flex items-center gap-1.5"
                >
                  ✉️ {ministry.leader.email}
                </a>
                <a
                  href={`tel:${ministry.leader.phone}`}
                  className="bg-background border border-border px-3 py-2 rounded-xl text-xs font-semibold hover:border-primary transition-colors flex items-center gap-1.5"
                >
                  📞 {ministry.leader.phone}
                </a>
                <a
                  href={ministry.leader.messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary/20 text-primary border border-primary/30 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-primary/30 transition-colors flex items-center gap-1.5"
                >
                  💬 Message Leader
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        {ministry.testimonials && ministry.testimonials.length > 0 && (
          <div className="mb-20 bg-card border border-border p-8 rounded-3xl shadow-sm">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-accent block mb-2 text-center">
              Community Voices
            </span>
            <h2 className="font-display text-2xl font-bold text-center mb-8">What Members Are Saying</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ministry.testimonials.map((t, idx) => (
                <div key={idx} className="bg-background border border-border/60 p-6 rounded-2xl flex flex-col justify-between gap-4">
                  <p className="text-sm italic text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-sm">{t.author}</p>
                    <p className="text-xs text-accent uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Section Anchor */}
        <div id="events" className="border-t border-border pt-16 scroll-mt-28 mb-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-accent block mb-2">
                Get Connected
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold">
                Upcoming Events for {ministry.name}
              </h2>
            </div>
            <Link
              href="/events"
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-secondary/80 transition-colors"
            >
              View All Church Events
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {ministry.events.map((evt) => (
              <div key={evt.id} className="bg-card border border-border p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-primary/50 transition-colors">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                      {evt.date}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">🕒 {evt.time}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold">{evt.title}</h3>
                  <p className="text-sm text-muted-foreground">{evt.description}</p>
                  <p className="text-xs font-medium text-foreground/85">📍 Location: {evt.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Join / Serve Form Section */}
        <div id="join-form" className="bg-card border border-border p-8 sm:p-12 rounded-3xl shadow-xl">
          <div className="max-w-xl mx-auto text-center mb-8">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-accent block mb-2">
              Take Your Next Step
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
              Get Involved in {ministry.name}
            </h2>
            <p className="text-muted-foreground text-sm">
              Fill out the form below to connect directly with {ministry.leader.name}, ask questions, or sign up to volunteer.
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-primary/10 border border-primary/30 p-8 rounded-2xl text-center max-w-lg mx-auto">
              <h3 className="font-display text-xl font-bold text-primary mb-2">Thank You for Reaching Out!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We have received your interest in the {ministry.name}. {ministry.leader.name} or a coordinator will get in touch with you shortly.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider"
              >
                Submit Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="max-w-xl mx-auto grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912 345 6789"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">How would you like to get involved?</label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="Join as Member">Join as a regular participant / member</option>
                  <option value="Volunteer / Serve">I want to volunteer / serve in this ministry</option>
                  <option value="General Inquiry">I have a question about upcoming gatherings</option>
                </select>
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors shadow-lg"
              >
                Submit Ministry Inquiry →
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
