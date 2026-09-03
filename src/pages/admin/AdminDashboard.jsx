import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Panel, MetricCard, Pill, Icon, StatChip } from '../../components/admin/ui';
import TrafficChart from '../../components/admin/TrafficChart';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    trends: 0,
    articles: 0,
    overalls: 0,
    spotifyEmbeds: 0,
    newsletterSubscribers: 0,
  });
  const [analyticsStats, setAnalyticsStats] = useState({
    current: 0,
    previous: 0,
    allTime: 0,
    average: 0,
    change: 0,
    realtime: 0,
    monthly: [],
    loading: true,
    error: null
  });
  const [searchConsoleStats, setSearchConsoleStats] = useState({
    performance: {
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0
    },
    topQueries: [],
    topPages: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        // Verify token with backend
        const response = await fetch(`${API_URL}/api/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Session expired');
        }

        const adminInfo = localStorage.getItem('adminInfo');
        if (adminInfo) {
          setAdmin(JSON.parse(adminInfo));
        }

        // Fetch stats
        await fetchStats(token);
        // Fetch analytics data
        fetchAnalytics(token);
        // Fetch search console data
        fetchSearchConsole(token);
      } catch (err) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    const fetchAnalytics = async (token) => {
      try {
        const analyticsResponse = await fetch(`${API_URL}/api/analytics/visitors?site=2koveralls`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          setAnalyticsStats({
            ...analyticsData.visitors,
            loading: false,
            error: null
          });
        } else {
          const errorData = await analyticsResponse.json();
          setAnalyticsStats(prev => ({
            ...prev,
            loading: false,
            error: errorData.message || errorData.error || 'Analytics not configured'
          }));
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setAnalyticsStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load analytics'
        }));
      }
    };

    const fetchSearchConsole = async (token) => {
      try {
        const performanceResponse = await fetch(`${API_URL}/api/search-console/performance?site=2koveralls`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const queriesResponse = await fetch(`${API_URL}/api/search-console/top-queries?site=2koveralls`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const pagesResponse = await fetch(`${API_URL}/api/search-console/top-pages?site=2koveralls`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        let performance = { clicks: 0, impressions: 0, ctr: 0, position: 0 };
        let topQueries = [];
        let topPages = [];
        let error = null;

        if (performanceResponse.ok) {
          const perfData = await performanceResponse.json();
          performance = perfData.performance;
        } else {
          const errorData = await performanceResponse.json();
          error = errorData.message || 'Search Console not configured';
        }

        if (queriesResponse.ok) {
          const queriesData = await queriesResponse.json();
          topQueries = queriesData.queries || [];
        }

        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();
          topPages = pagesData.pages || [];
        }

        setSearchConsoleStats({
          performance,
          topQueries,
          topPages,
          loading: false,
          error
        });
      } catch (err) {
        console.error('Error fetching Search Console data:', err);
        setSearchConsoleStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load Search Console data'
        }));
      }
    };

    const fetchStats = async (token) => {
      try {
        // Fetch trends count
        const articlesResponse = await fetch(`${API_URL}/api/lowkeygrid/articles/admin/all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Fetch native write-up articles count
        const writeupsResponse = await fetch(`${API_URL}/api/koveralls-articles/admin/all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Fetch overalls count
        const overallsResponse = await fetch(`${API_URL}/api/overalls`);

        // Fetch spotify embeds count
        const spotifyResponse = await fetch(`${API_URL}/api/spotify-embeds/all?site=lowkeygrid`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Fetch newsletter subscriber count
        const newsletterResponse = await fetch(`${API_URL}/api/newsletter/subscribers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        let articlesCount = 0;
        let writeupsCount = 0;
        let overallsCount = 0;
        let spotifyCount = 0;
        let newsletterCount = 0;

        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json();
          articlesCount = articlesData.length;
        }

        if (writeupsResponse.ok) {
          const writeupsData = await writeupsResponse.json();
          writeupsCount = writeupsData.length;
        }

        if (overallsResponse.ok) {
          const overallsData = await overallsResponse.json();
          overallsCount = overallsData.length;
        }

        if (spotifyResponse.ok) {
          const spotifyData = await spotifyResponse.json();
          spotifyCount = spotifyData.embeds?.length || 0;
        }

        if (newsletterResponse.ok) {
          const newsletterData = await newsletterResponse.json();
          newsletterCount = newsletterData.active_count ?? newsletterData.count ?? 0;
        }

        setStats({
          trends: articlesCount,
          articles: writeupsCount,
          overalls: overallsCount,
          spotifyEmbeds: spotifyCount,
          newsletterSubscribers: newsletterCount,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    verifyAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-bone-dim">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-down">
        {error}
      </div>
    );
  }

  return (
    <AdminLayout
      admin={admin}
      onLogout={handleLogout}
      title={`Welcome back, ${admin?.username || ''}`}
      subtitle={admin?.email}
    >
      <div className="space-y-4">
        {/* Content Stats */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[.14em] text-bone-dim">Content</h3>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <button onClick={() => navigate('/admin/writeups')} className="text-left">
              <MetricCard label="Articles" value={stats.articles} tone="brand" />
            </button>
            <button onClick={() => navigate('/admin/articles')} className="text-left">
              <MetricCard label="Trends" value={stats.trends} tone="slate" />
            </button>
            <button onClick={() => navigate('/admin/overalls')} className="text-left">
              <MetricCard label="2K Overalls" value={stats.overalls} tone="brand" />
            </button>
            <button onClick={() => navigate('/admin/spotify')} className="text-left">
              <MetricCard label="Spotify Embeds" value={stats.spotifyEmbeds} tone="up" />
            </button>
            <div>
              <MetricCard label="Newsletter Subscribers" value={stats.newsletterSubscribers} tone="slate" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* Google Analytics */}
          <Panel title="Google Analytics" subtitle="Visitor sessions for 2koveralls.com" icon="chart">
            <div className="p-3">
              {analyticsStats.loading ? (
                <div className="py-6 text-center text-sm text-bone-dim">Loading analytics...</div>
              ) : analyticsStats.error ? (
                <div className="py-6 text-center text-sm text-bone-dim">{analyticsStats.error}</div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatChip label="This Month" value={analyticsStats.current?.toLocaleString() || 0} trend={analyticsStats.change} tone="brand" />
                    <StatChip label="Last Month" value={analyticsStats.previous?.toLocaleString() || 0} />
                    <StatChip label="All Time" value={analyticsStats.allTime?.toLocaleString() || 0} />
                    <StatChip label="Avg. Monthly" value={analyticsStats.average?.toLocaleString() || 0} />
                    {analyticsStats.realtime !== undefined && (
                      <Pill tone="up" pulse>{analyticsStats.realtime} live</Pill>
                    )}
                  </div>
                  <TrafficChart monthly={analyticsStats.monthly} />
                </div>
              )}
            </div>
          </Panel>

          {/* Google Search Console */}
          <Panel title="Search Console" subtitle="SEO performance for 2koveralls.com" icon="search">
            <div className="p-3">
              {searchConsoleStats.loading ? (
                <div className="py-6 text-center text-sm text-bone-dim">Loading Search Console data...</div>
              ) : searchConsoleStats.error ? (
                <div className="py-6 text-center text-sm text-bone-dim">{searchConsoleStats.error}</div>
              ) : (
                <>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <StatChip label="Clicks (28d)" value={searchConsoleStats.performance.clicks.toLocaleString()} tone="brand" />
                    <StatChip label="Impressions" value={searchConsoleStats.performance.impressions.toLocaleString()} />
                    <StatChip label="CTR" value={`${searchConsoleStats.performance.ctr}%`} />
                    <StatChip label="Avg. Pos" value={searchConsoleStats.performance.position} />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-bone-dim">Top Keywords</h4>
                      {searchConsoleStats.topQueries.length > 0 ? (
                        <div className="divide-y divide-ink-line border border-ink-line bg-ink">
                          {searchConsoleStats.topQueries.slice(0, 4).map((query, index) => (
                            <div key={index} className="flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs">
                              <span className="min-w-0 flex-1 truncate text-bone">{query.query}</span>
                              <span className="flex-shrink-0 text-bone-dim">{query.clicks} clk · {query.ctr}%</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="py-3 text-center text-xs text-bone-dim">No keyword data</p>
                      )}
                    </div>

                    <div>
                      <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-bone-dim">Top Pages</h4>
                      {searchConsoleStats.topPages.length > 0 ? (
                        <div className="divide-y divide-ink-line border border-ink-line bg-ink">
                          {searchConsoleStats.topPages.slice(0, 4).map((page, index) => (
                            <div key={index} className="flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs">
                              <span className="min-w-0 flex-1 truncate text-bone-dim" title={page.page}>
                                {page.page.replace(/^https?:\/\/[^/]+/, '')}
                              </span>
                              <span className="flex-shrink-0 text-bone-dim">{page.clicks} clk</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="py-3 text-center text-xs text-bone-dim">No page data</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Panel>
        </div>

        {/* Quick Actions */}
        <Panel title="Quick Actions" icon="pulse">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 p-3">
            <button
              onClick={() => navigate('/admin/overalls/create')}
              className="flex items-center justify-center gap-2 border border-brand bg-brand py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-brand-dim"
            >
              <Icon name="add" size={15} /> New Overall
            </button>
            <button
              onClick={() => navigate('/admin/writeups/create')}
              className="flex items-center justify-center gap-2 border border-ink-line bg-ink py-2 text-xs font-bold uppercase tracking-wider text-bone transition-colors hover:border-brand hover:text-brand"
            >
              <Icon name="add" size={15} /> New Article
            </button>
            <button
              onClick={() => navigate('/admin/articles/create')}
              className="flex items-center justify-center gap-2 border border-ink-line bg-ink py-2 text-xs font-bold uppercase tracking-wider text-bone transition-colors hover:border-brand hover:text-brand"
            >
              <Icon name="add" size={15} /> New Trend
            </button>
            <button
              onClick={() => navigate('/admin/spotify')}
              className="flex items-center justify-center gap-2 border border-ink-line bg-ink py-2 text-xs font-bold uppercase tracking-wider text-bone transition-colors hover:border-brand hover:text-brand"
            >
              <Icon name="spotify" size={15} /> Spotify Manager
            </button>
          </div>
        </Panel>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
