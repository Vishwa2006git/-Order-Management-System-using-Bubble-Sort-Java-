import React from 'react';
import { useAuth } from '../AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  LogOut, 
  HelpCircle, 
  Star,
  Menu as MenuIcon,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { profile, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = profile?.role === 'owner' 
    ? [
        { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
        { id: 'menu', label: 'Manage Menu', icon: Package },
        { id: 'java-console', label: 'Java System', icon: MenuIcon },
      ]
    : [
        { id: 'menu', label: 'Order Menu', icon: Package },
        { id: 'my-orders', label: 'My History', icon: Star },
        { id: 'java-console', label: 'Order Logic', icon: MenuIcon },
        { id: 'help', label: 'AI Assistant', icon: HelpCircle },
      ];

  return (
    <div className="min-h-screen bg-red-50 flex font-sans text-slate-900">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-red-600 text-white rounded-lg shadow-lg"
      >
        {isSidebarOpen ? <X /> : <MenuIcon />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-red-100 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
              <Package className="w-6 h-6" />
            </div>
            <h1 className="font-display font-bold text-xl tracking-tight text-red-600">RedFlow</h1>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'text-slate-500 hover:bg-red-50 hover:text-red-600'}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-red-50">
          <div className="mb-4 px-4 py-3 bg-red-50 rounded-2xl">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Signed in as</p>
            <p className="text-xs font-bold text-red-700 truncate">{profile?.email}</p>
            <p className="text-[10px] text-red-400 mt-1 capitalize">{profile?.role}</p>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-100 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
};
