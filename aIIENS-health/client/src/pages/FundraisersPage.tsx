import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { campaignApi } from '@/api/campaignApi';
import { CampaignCard } from '@/components/campaign/CampaignCard';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Search, SlidersHorizontal, HeartPulse, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'cardiac', label: 'Cardiac' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'orthopedic', label: 'Orthopedic' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'other', label: 'Other' },
];

const URGENCIES = [
  { value: '', label: 'Any Urgency' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export default function FundraisersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  const currentCategory = searchParams.get('category') || '';
  const currentUrgency = searchParams.get('urgency') || '';
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentSearch = searchParams.get('search') || '';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['campaigns', currentPage, currentCategory, currentUrgency, currentSearch],
    queryFn: () => campaignApi.getCampaigns({ 
      page: currentPage, 
      limit: 12,
      category: currentCategory,
      urgency: currentUrgency,
      search: currentSearch
    }),
    placeholderData: (prev) => prev,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (searchInput) prev.set('search', searchInput);
      else prev.delete('search');
      prev.set('page', '1');
      return prev;
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setSearchParams(prev => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      prev.set('page', '1');
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-brand-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <HeartPulse className="w-16 h-16 mx-auto mb-6 text-brand-300 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Help Save a Life Today
          </h1>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            100% of your donation goes directly to verified partner hospitals for the patient's treatment. 
            Zero platform fees. Total transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-brand-900 hover:bg-surface-100 font-bold" onClick={() => {
              const el = document.getElementById('browse-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Browse Fundraisers
            </Button>
            <Link 
              to="/fundraisers/create" 
              className="inline-flex items-center justify-center font-medium rounded-xl h-12 px-7 text-base bg-transparent hover:bg-brand-800 text-brand-100 border border-brand-400 transition-all duration-200"
            >
              Start a Fundraiser
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="browse-section" className="container mx-auto px-4 py-12 md:py-16">
        
        {/* Trust Banner */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-10 flex flex-col md:flex-row items-center gap-4 justify-center text-center md:text-left text-emerald-800 animate-fade-in">
          <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
          <p className="font-medium text-sm md:text-base">
            <strong>AIIENS Promise:</strong> Every case is medically verified. Funds are settled directly to the treating hospital's bank account to prevent fraud.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-surface-200 mb-10 sticky top-20 z-20">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            
            <form onSubmit={handleSearch} className="flex-1 max-w-lg flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-surface-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 text-sm h-[42px]"
                  placeholder="Search by medical condition, hospital, or patient..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-[42px]">Search</Button>
            </form>

            <Button 
              variant="outline" 
              className="md:hidden flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </Button>

            <div className={`md:flex items-center gap-4 ${showFilters ? 'flex flex-col w-full' : 'hidden'}`}>
              <div className="w-full md:w-48">
                <Select 
                  label="" 
                  value={currentCategory} 
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  options={CATEGORIES}
                />
              </div>
              <div className="w-full md:w-48">
                <Select 
                  label="" 
                  value={currentUrgency} 
                  onChange={(e) => handleFilterChange('urgency', e.target.value)}
                  options={URGENCIES}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Results Grid */}
        {isError && (
          <Alert variant="error" title="Could not load fundraisers" className="mb-8">
            There was a problem connecting to our servers. Please try again later.
          </Alert>
        )}

        {isLoading && !data ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Spinner size="lg" />
            <p className="mt-4 text-surface-500 font-medium">Loading fundraisers...</p>
          </div>
        ) : data?.data.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-200 p-12 text-center shadow-sm">
            <HeartPulse className="w-16 h-16 mx-auto text-surface-300 mb-4" />
            <h3 className="text-xl font-bold text-surface-900 mb-2">No campaigns found</h3>
            <p className="text-surface-600 mb-6 max-w-md mx-auto">
              We couldn't find any active fundraisers matching your current filters. Try adjusting your search criteria.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchParams(new URLSearchParams());
              setSearchInput('');
            }}>Clear All Filters</Button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {data?.data.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>

            {/* Pagination */}
            {data?.meta && data.meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button 
                  variant="outline" 
                  disabled={!data.meta.hasPrevPage}
                  onClick={() => handlePageChange(data.meta.page - 1)}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <span className="text-sm font-medium text-surface-600">
                  Page {data.meta.page} of {data.meta.totalPages}
                </span>
                <Button 
                  variant="outline" 
                  disabled={!data.meta.hasNextPage}
                  onClick={() => handlePageChange(data.meta.page + 1)}
                  className="gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}

      </section>
    </div>
  );
}
