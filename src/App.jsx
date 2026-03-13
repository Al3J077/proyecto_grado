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
    stock: '',
    categoria: 'Materia Prima',
    proveedor: '',
    precio_unidad: '',
    fecha_vencimiento: '',
    es_peligroso: 'false'
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
  setDatos({
    nombre: insumo.nombre,
    stock: insumo.stock_actual,
    categoria: insumo.categoria,
    proveedor: insumo.proveedor || '',
    precio_unidad: insumo.precio_unidad || 0,
    fecha_vencimiento: insumo.fecha_vencimiento || '',
    es_peligroso: insumo.es_peligroso || 'false'
  });
  setIdEditando(insumo.id);
}


  // Funcion asincrona (espera a internet)
// Funcion asincrona (espera a internet)
  async function guardarEnNube() {

    //  FILTROS DE SEGURIDAD:
    const fechaParaGuardar = datos.fecha_vencimiento === '' ? null : datos.fecha_vencimiento;
    const esPeligrosoBooleano = datos.es_peligroso === 'true';
    
    // Si dejan los números vacíos, mandamos un 0 para que Supabase no explote
    const stockSeguro = datos.stock === '' ? 0 : datos.stock;
    const precioSeguro = datos.precio_unidad === '' ? 0 : datos.precio_unidad;

    // Modo de insertar
    if (idEditando === null)  {
      const { error } = await supabase.from('insumos').insert({
        nombre: datos.nombre,
        stock_actual: stockSeguro,       // Usamos el número seguro
        categoria: datos.categoria,
        proveedor: datos.proveedor,
        precio_unidad: precioSeguro,     // Usamos el número seguro
        fecha_vencimiento: fechaParaGuardar,
        es_peligroso: esPeligrosoBooleano,
        unidad_medida: 'gr'
      });

      if (error) {
        alert('Error al guardar: ' + error.message);
      } else {
        alert('Insumo guardado');
        cargarInsumos();
        setDatos({ nombre: '', stock: '', categoria: 'Materia prima', proveedor: '', precio_unidad: '', fecha_vencimiento: '', es_peligroso: 'false' });
      } 
    }
    // Modo Editar
    else {
      const { error } = await supabase.from('insumos')
      .update({
        nombre: datos.nombre,
        stock_actual: stockSeguro,       // Usamos el número seguro
        categoria: datos.categoria,
        proveedor: datos.proveedor,
        precio_unidad: precioSeguro,     // Usamos el número seguro
        fecha_vencimiento: fechaParaGuardar,
        es_peligroso: esPeligrosoBooleano    
      })
      .eq('id', idEditando);

      if (error) alert('Error al actualizar: ' + error.message);
      else {
        alert('Insumo actualizado correctamente.');
        setIdEditando(null);
        setDatos({ nombre: '', stock: 0, categoria: 'Materia prima', proveedor: '', precio_unidad: 0, fecha_vencimiento: '', es_peligroso: 'false' });
        cargarInsumos(); 
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
      <input name="nombre" value={datos.nombre} type="text" placeholder="Nombre del insumo" onChange={manejarCambio} />
      <input name="stock" value={datos.stock} type="number" placeholder="Stock disponible" onChange={manejarCambio} />
      <input name="proveedor" value={datos.proveedor} type="text" placeholder="Nombre del proveedor" onChange={manejarCambio} />
      <input name="precio_unidad" value={datos.precio_unidad} type="number" placeholder="Precio x Unidad ($)" onChange={manejarCambio} />
      <input name="fecha_vencimiento" value={datos.fecha_vencimiento} type="date" onChange={manejarCambio} />

      <select name="es_peligroso" value={datos.es_peligroso} onChange={manejarCambio}>
        <option value="false">🟢 Seguro</option>
        <option value="true">🔴 ATENCION: Quimico Peligroso</option>
      </select>

      <select name="categoria" value={datos.categoria} onChange={manejarCambio}>
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
      <th style={{ padding: '8px' }}>Proveedor</th>
      <th style={{ padding: '8px' }}>Precio</th>
      <th style={{ padding: '8px' }}>Vence</th>
      <th style={{ padding: '8px' }}>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {listaInsumos.map((insumo) => {
      let colorFondo = 'transparent';
      if (insumo.stock_actual === 0) colorFondo = '#ffcccc';
      else if (insumo.stock_actual <= 10) colorFondo = '#fff3cd';

      let colorTexto = insumo.es_peligroso === 'true' || insumo.es_peligroso === true ? 'red' : 'black';
      let grosorTexto = insumo.es_peligroso === 'true' || insumo.es_peligroso === true ? 'bold' : 'normal';

      return (
        <tr key={insumo.id} style={{ backgroundColor: colorFondo, color: colorTexto, fontWeight: grosorTexto }}>
          <td style={{ padding: '8px'}}>{insumo.nombre}</td>
          <td style={{ padding: '8px'}}>{insumo.categoria}</td>
          <td style={{ padding: '8px' }}>
            {insumo.stock_actual} {insumo.stock_actual <= 10 ? '⚠️' : ''}
          </td>

          <td style={{ padding: '8px' }}>{insumo.proveedor}</td>
          <td style={{ padding: '8px' }}>${insumo.precio_unidad}</td>
          <td style={{ padding: '8px' }}>{insumo.fecha_vencimiento}</td>

          <td style={{ padding: '8px' }}>
            <button onClick={() => cargarParaEditar(insumo)} style={{ background: '#0275d8', color: 'white', border: 'none', padding: '5px', cursor: 'pointer', marginRight: '5px' }}>
              Editar
            </button>
            <button onClick={() => eliminarInsumo(insumo.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px', cursor: 'pointer' }}>
              Borrar
            </button>
          </td>
        </tr>
      );
   })}
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
