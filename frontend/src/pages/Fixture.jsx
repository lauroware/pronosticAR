const Fixture = () => {
  const imagenUrl = "https://www.infobae.com/resizer/v2/EQZGS5PPGRAX7HX2LXKRLWICLA.png?auth=17483d44fa81ff19353efb036132cc6c4f3ec2c9011fdf3be96d8c36ebcb4d29&smart=true&width=992&height=992&quality=85"; // Cambiá por tu URL
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🗓️ Fixture Mundial 2026</h1>
      
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <img 
          src={imagenUrl} 
          alt="Fixture Mundial 2026"
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export default Fixture;