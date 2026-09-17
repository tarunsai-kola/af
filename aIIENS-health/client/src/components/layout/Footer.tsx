import { Link } from 'react-router-dom';
import { Heart, Globe, Share2, Mail, MessageCircle } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-950 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                AIIENS
              </span>
            </Link>
            <p className="text-sm font-semibold text-white mb-6">
              Technology for Humanity.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Connecting people who need help with people who can help through verified medical fundraising and healthcare support.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-surface-900 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-surface-900 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-surface-900 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-surface-900 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-semibold mb-6">Programs</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/fundraisers" className="hover:text-brand-400 transition-colors">Medical Fundraising</Link></li>
              <li><Link to="/blood" className="hover:text-brand-400 transition-colors">Blood Donation</Link></li>
              <li><Link to="/camps" className="hover:text-brand-400 transition-colors">Medical Camps</Link></li>
              <li><Link to="/assistance" className="hover:text-brand-400 transition-colors">Healthcare Assistance</Link></li>
              <li><Link to="/impact" className="hover:text-brand-400 transition-colors">Community Impact</Link></li>
              <li><Link to="/ngo-network" className="hover:text-brand-400 transition-colors">NGO Network</Link></li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="text-white font-semibold mb-6">Get Involved</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/fundraisers" className="hover:text-brand-400 transition-colors">Donate</Link></li>
              <li><Link to="/blood/become-donor" className="hover:text-brand-400 transition-colors">Become a Donor</Link></li>
              <li><Link to="/volunteer" className="hover:text-brand-400 transition-colors">Volunteer</Link></li>
              <li><Link to="/fundraisers/create" className="hover:text-brand-400 transition-colors">Fundraise</Link></li>
              <li><Link to="/partner" className="hover:text-brand-400 transition-colors">Partner</Link></li>
              <li><Link to="/camps/host" className="hover:text-brand-400 transition-colors">Host a Camp</Link></li>
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h3 className="text-white font-semibold mb-6">Organization</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-brand-400 transition-colors">About</Link></li>
              <li><Link to="/governance" className="hover:text-brand-400 transition-colors">Governance</Link></li>
              <li><Link to="/transparency" className="hover:text-brand-400 transition-colors">Transparency</Link></li>
              <li><Link to="/impact" className="hover:text-brand-400 transition-colors">Impact</Link></li>
              <li><Link to="/careers" className="hover:text-brand-400 transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-6">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/donation-policy" className="hover:text-brand-400 transition-colors">Donation Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-brand-400 transition-colors">Refund Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-brand-400 transition-colors">Healthcare Disclaimer</Link></li>
              <li><Link to="/data-protection" className="hover:text-brand-400 transition-colors">Data Protection</Link></li>
              <li><Link to="/safeguarding" className="hover:text-brand-400 transition-colors">Safeguarding</Link></li>
              <li><Link to="/grievance" className="hover:text-brand-400 transition-colors">Grievance Mechanism</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-surface-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} AIIENS Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
