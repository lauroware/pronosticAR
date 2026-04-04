const medallas = { 1: '🥇', 2: '🥈', 3: '🥉' };

const MedallaPuesto = ({ posicion, size = 'md' }) => {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };
  return (
    <span className={sizes[size]}>
      {medallas[posicion] || <span className="font-bold text-gray-500">#{posicion}</span>}
    </span>
  );
};

export default MedallaPuesto;