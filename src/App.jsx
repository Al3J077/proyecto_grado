import React, { useState } from 'react';
import { supabase } from './supabase';

function App() {

  //Aqui va la LOGICA (CEREBRO)
  const [datos, setDatos] = useState({
    nombre: '',
    stock: 0,
    categoria: 'Materia Prima'
  });

function manejarCambio(evento) {
  const { name, value } = evento.target;
  //Muy importante:
  setDatos({

  ...datos,  //1. copia todo lo que ya habia(para no borrar el stock)
    [name]: value //2. Actualiza SOLO el campo q se toca
  })
}

  // Funcion asincrona (espera a internet)
  async function guardarEnNube() {
    // le decimos a supabase que inserte un objeto nuevo en la tabla insumos
    const { error } = await supabase.from('insumos').insert({
       nombre: datos.nombre,
       stock_actual:datos.stock,
      categoria: datos.categoria,
      unidad_medida: 'gr' });

      if (error) {
        alert('Error: ' + error.message)
        } else {
        alert('Insumo guardado en Supabase!')
        setDatos({   // Limpiar el input
          nombre: '',
          stock: 0,
          categoria: 'Materia Prima'
        });
        } 
      }

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>

      {/*Input de NOMBRE*/}
      <input
      name="nombre"
      type="text"
      placeholder="Nombre del insumo"
      onChange={manejarCambio} />

      {/*Input de STOCK (numero) */}
      <input
      name="stock"
      type="number"
      placeholder="Stock disponible"
      onChange={manejarCambio} />

      {/* Select de CATEGORIA */}
      <select name="categoria" onChange={manejarCambio}>
     <option value="Materia prima">Materia prima</option>
     <option value="Envase">Envase</option>        
     <option value="Etiqueta">Etiqueta</option>
      </select>

      <button onClick={guardarEnNube}>Guardar TODO</button>
    </div>

<p>Vista previa: {JSON.stringify(datos)}</p>
    </>
  );
}
export default App;
