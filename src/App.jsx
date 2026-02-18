import React, { useState } from 'react';
import { supabase } from './supabase';

function App() {

  //Aqui va la LOGICA (CEREBRO)
  const [nombre, setNombre] = useState('');

  // Funcion asincrona (espera a internet)
  async function guardarEnNube() {
    // le decimos a supabase que inserte un objeto nuevo en la tabla insumos
    const { error } = await supabase.from('insumos').insert({
       nombre: nombre,
      categoria: 'Prueba',
      unidad_medida: 'unidad' });

      if (error) {
        alert('Error; ' + error.message)
        } else {
        alert('Insumo guardado en Supabase!')
        setNombre('') // Limpiar el input
      }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>INVENTARIO DE PRODUCCIÓN</h1>
      <input type="text"
      placeholder="Nombre del insumo"
      onChange={(e) => setNombre(e.target.value)} />

      <p>Estás escribiendo: {nombre}</p>

      <button onClick={guardarEnNube}>Guardar insumo</button>

      {/* Aqui va LO VISUAL (OJOS) */}
    </div>
  )
} 

export default App;
