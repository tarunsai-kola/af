import { Link } from 'react-router-dom';
import { Heart, Globe, MessageCircle, Share2, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-950 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="lg:pr-8">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                AIIENS <span className="text-brand-400">Health</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              A healthcare public-benefit platform connecting donors, patients, and hospitals to save lives through transparent medical fundraising and free health camps.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-surface-900 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface-900 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface-900 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Platform</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/fundraisers" className="hover:text-brand-400 transition-colors">Medical Fundraisers</Link></li>
              <li><Link to="/blood" className="hover:text-brand-400 transition-colors">Blood Donation Hub</Link></li>
              <li><Link to="/camps" className="hover:text-brand-400 transition-colors">Free Health Camps</Link></li>
              <li><Link to="/impact" className="hover:text-brand-400 transition-colors">Our Impact</Link></li>
              <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-6">Support & Legal</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/donation-policy" className="hover:text-brand-400 transition-colors">Donation Policy</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6">Get in Touch</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-400 shrink-0" />
                <span>support@aiiens.health</span>
              </li>
              <li className="mt-6 p-4 rounded-xl bg-surface-900 border border-surface-800">
                <p className="text-xs font-medium text-white mb-1">Emergency Blood Request?</p>
                <p className="text-xs mb-3">Hospitals can post verified blood requests directly.</p>
                <Link to="/blood/requests" className="text-brand-400 font-medium text-xs hover:underline">
                  View active requests →
                </Link>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-surface-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} AIIENS Health. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Non-profit Public Benefit Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-surface-700"></span>
            <span>Registered NGO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
