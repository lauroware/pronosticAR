import { createContext, useState, useContext } from 'react';

const GrupoContext = createContext();

export const GrupoProvider = ({ children }) => {
  const [grupos, setGrupos] = useState([]);
  const [grupoActual, setGrupoActual] = useState(null);

  return (
    <GrupoContext.Provider value={{ grupos, setGrupos, grupoActual, setGrupoActual }}>
      {children}
    </GrupoContext.Provider>
  );
};

export const useGrupo = () => useContext(GrupoContext);