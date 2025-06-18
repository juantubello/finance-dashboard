// fetchFinanceData.js
export const fetchFinanceData = async (endpoint, year, month) => {
  try {
    // Construir la URL del endpoint
    const url = `http://192.168.1.11:8000/${endpoint}/${year}/${month}`;
    
    console.log(`Haciendo fetch a: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    
    return data;
    
  } catch (error) {
    console.error('Error al obtener datos financieros:', error.message);
    throw error; // Re-lanzamos el error para que pueda ser manejado por el llamador
  }
};