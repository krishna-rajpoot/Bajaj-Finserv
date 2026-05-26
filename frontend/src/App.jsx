import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TicketProvider, useTickets } from './context/TicketContext';
import StatsStrip from './components/StatsStrip';
import CreateTicketPanel from './components/CreateTicketPanel';
import TicketBoard from './components/TicketBoard';

const Dashboard = () => {
  const { filters, setFilters } = useTickets();

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">DeskFlow</h1>
            <p className="text-gray-500 mt-1">Support Ticket Triage Board</p>
          </div>
        </header>

        <StatsStrip />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateTicketPanel />
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select 
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    id="breached"
                    type="checkbox"
                    checked={filters.breached}
                    onChange={(e) => setFilters({ ...filters, breached: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="breached" className="ml-2 block text-sm text-gray-900">
                    Show only SLA breached
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <TicketBoard />
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

function App() {
  return (
    <TicketProvider>
      <Dashboard />
    </TicketProvider>
  );
}

export default App;
