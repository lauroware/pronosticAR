const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-gray-400">
        PronosticAR © {new Date().getFullYear()} - Desarrollado por Lauro Ware - Powered by <a href="https://www.latinnexo.com.ar/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">LatineNexo</a>
      </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;