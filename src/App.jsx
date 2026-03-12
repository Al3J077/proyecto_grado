import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function manejarLogin(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) alert(error.message);
    else alert("¡Bienvenido al sistema!");
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={manejarLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          onChange={(e) => setEmail(e.target.value)}
          />
          <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">ENTRAR</button>
      </form>
      </div>
  );

    }
  

function Inventario(){
  //Aqui va la LOGICA (CEREBRO)
  const [datos, setDatos] = useState({
    nombre: '',
    stock: 0,
    categoria: 'Materia Prima'
  });

  const [listaInsumos, setListaInsumos] = useState([]);
  const [idEditando, setIdEditando] = useState(null);


function manejarCambio(evento) {
  const { name, value } = evento.target;
  //Muy importante:
  setDatos({

  ...datos,  //1. copia todo lo que ya habia(para no borrar el stock)
    [name]: value //2. Actualiza SOLO el campo q se toca
  })
}

function cargarParaEditar(insumo) {
  // Llenar formlario con dstos de la fila
  setDatos({
    nombre: insumo.nombre,
    stock: insumo.stock_actual,
    categoria: insumo.categoria
  });
  // se enciende el interruptor guardando el id del insumo
  setIdEditando(insumo.id);

}


  // Funcion asincrona (espera a internet)
  async function guardarEnNube() {

    // Modo de insertar(no actualizar) si el interruptor esta apagado (null)
    if (idEditando === null)  {
      const { error } = await supabase.from('insumos').insert({
      nombre: datos.nombre,
      stock_actual:datos.stock,
      categoria: datos.categoria,
      unidad_medida: 'gr' 
    });

      if (error) {
        alert('Error: ' + error.message);
        } else {
        alert('Insumo guardado');
        cargarInsumos();
        setDatos({   // Limpiar el input
          nombre: '',
          stock: 0,
          categoria: 'Materia Prima'
        });
        } 
      }
    else {
      const { error } = await supabase.from('insumos')
      .update({
        nombre: datos.nombre,
        stock_actual: datos.stock,
        categoria: datos.categoria
      })
      .eq('id', idEditando); // importante, se le dice q fila editar

      if (error) alert('Error: ' + error.message);
      else {
        alert('Insumo actualizaddo correctamente.');
        setIdEditando(null); // se apaga el interruptor
        setDatos({ nombre: '', stock: 0, categoria: 'Materia prima' });
        cargarInsumos(); // Se recarga la tabla
      }
    }
  }

      async function cargarInsumos() {
        const { data, error } = await supabase.from('insumos').select('*');

        if (error) {
          alert("Error al cargar: " + error.message);
        } else {
          setListaInsumos(data);
        }
      }

      async function eliminarInsumo(idParaBorrar) {
        // se le dice a supabase que borre el registro con el id que le pasamos
        const { error } = await supabase 
        .from('insumos')
        .delete()
        .eq('id', idParaBorrar); // eq significa "donde el campo id sea igual a idParaBorrar"

        if (error) {
          alert("No se pudo borrar: " + error.message);
        } else {
          alert("INSUMO ELIMINADO");
          cargarInsumos();
        }
      }

      useEffect(() => {
        cargarInsumos();
      }, []);

     async function cerrarSesion() {
      const { error } = await supabase.auth.signOut();

      if (error) {
        alert("Error al salir: " + error.message);
      }
     }

  return (
    <>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
      <h2>INVENTARIO</h2>
      <button
      onClick={cerrarSesion}
      style={{ background: '#d9534f', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
      CERRAR SESIÓN
      </button>
    </div>

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

     <hr style={{ margin: '20px 0', width: '100%' }} />

<h3>Mis insumos en la Nube</h3>

<table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
  <thead>
    <tr>
      <th style={{ padding: '8px' }}>Nombre</th>
      <th style={{ padding: '8px' }}>Categoria</th>
      <th style={{ padding: '8px' }}>Stock</th>
      <th style={{ padding: '8px' }}>Acciones</th>
    </tr>
  </thead>
  <tbody>

    {listaInsumos.map((insumo) => (
      <tr key={insumo.id}>
        <td style={{ padding: '8px' }}>{insumo.nombre}</td>
        <td style={{ padding: '8px' }}>{insumo.categoria}</td>
        <td style={{ padding: '8px' }}>{insumo.stock_actual}</td>
        <td style={{ padding: '8px' }}>
          <button onClick={() => cargarParaEditar(insumo)} style={{ background: '#0275d8', color: 'white', border: 'none', padding: '5px', cursor: 'pointer', marginRight: '5px' }}
          >Editar</button>
          </td>
        <td style={{ padding: '8px' }}>
          <button onClick={() => eliminarInsumo(insumo.id)}
          style={{ background: 'red', color: 'white', border: 'none', padding: '5px', cursor: 'pointer' }}
            >Borrar</button>
        </td>
      </tr>
    ))}
    </tbody>
</table>


<p>Vista previa: {JSON.stringify(datos)}</p>

    </>
  );
}

function App() {
  // saber si hay alguen logueado
  const [sesion, setSesion] = useState(null);
  // 2. useeFFECT es el vigilante q se ejeuta al abrir la app
  useEffect(() => {
    // hay una sesion guardada de supabase en el navegador?
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesion(session);
    });

    // escuchamos entiepo real si e estado cambia (login o cierre de sesion)
    const { data: {subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSesion(session);
    });

    // se limpia el vigilante si se cierra el componente
    return () => subscription.unsubscribe();
  }, []);

  // 3. decision del vigilante:
  if (!sesion) {
    // si la sesion esta vacia se mostrara el componente login
    return <Login />;
  } else {

    //si la sesion tiene datos, se pasará directamente al inventario
    return <Inventario />;


  }
}

  
export default App;
