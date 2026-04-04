import { NavLink } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/partidos', icon: '⚽', label: 'Partidos' },
  { path: '/pronosticos', icon: '🎯', label: 'Mis Pronósticos' },
  { path: '/grupos', icon: '👥', label: 'Grupos' },
  { path: '/rankings', icon: '🏆', label: 'Rankings' },
  { path: '/perfil', icon: '👤', label: 'Mi Perfil' },
];

const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-20">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className={`text-xl`}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;