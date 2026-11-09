// Capa de datos: replica las tablas y relaciones de Base_de_datos.sql usando localStorage.
const PK={usuario:'idUsuario',rol:'idRol',categoria:'idCategoria',documento:'idDocumento',encuesta:'idEncuesta',pregunta:'idPregunta',opcionRespuesta:'idOpcion',respuestaEncuesta:'idRespuestaEncuesta',respuestaPregunta:'idRespuestaPregunta',tipoVehiculo:'idTipoVehiculo',vehiculo:'idVehiculo',tipoElemento:'idTipoElemento',proveedor:'idProveedor',canalSolicitud:'idCanal',ruta:'idRuta',solicitudTraslado:'idSolicitud',estadoTraslado:'idEstado',traslado:'idTraslado',historialEstado:'idHistorial',chofer:'ciChofer',enfermero:'ciEnfermero',paciente:'ciPaciente'};
const AUTO=['usuario','rol','categoria','documento','encuesta','pregunta','opcionRespuesta','respuestaEncuesta','respuestaPregunta','tipoVehiculo','vehiculo','tipoElemento','proveedor','canalSolicitud','ruta','solicitudTraslado','estadoTraslado','traslado','historialEstado'];
// [tabla hija, columna, tabla padre] -> ON DELETE CASCADE
const FK=[['usuarioRol','idUsuario','usuario'],['documento','idCategoria','categoria'],['documento','idUsuario','usuario'],['encuesta','idCategoria','categoria'],['pregunta','idEncuesta','encuesta'],['opcionRespuesta','idPregunta','pregunta'],['respuestaEncuesta','idEncuesta','encuesta'],['respuestaPregunta','idRespuestaEncuesta','respuestaEncuesta'],['respuestaPregunta','idPregunta','pregunta'],['respuestaPregunta','idOpcion','opcionRespuesta'],['vehiculo','idTipoVehiculo','tipoVehiculo'],['compatibilidad','idTipoVehiculo','tipoVehiculo'],['compatibilidad','idTipoElemento','tipoElemento'],['solicitudTraslado','ciPaciente','paciente'],['solicitudTraslado','idTipoElemento','tipoElemento'],['solicitudTraslado','idRuta','ruta'],['solicitudTraslado','idCanal','canalSolicitud'],['solicitudTraslado','idUsuario','usuario'],['traslado','idSolicitud','solicitudTraslado'],['traslado','idVehiculo','vehiculo'],['traslado','ciChofer','chofer'],['traslado','ciEnfermero','enfermero'],['traslado','idProveedor','proveedor'],['traslado','idRuta','ruta'],['historialEstado','idTraslado','traslado'],['historialEstado','idEstado','estadoTraslado']];

const ahora=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`};
const hoy=()=>ahora().slice(0,10);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const DB=(()=>{
  localStorage.removeItem('sigsm_db');
  const KEY='sigsm_db_v2';
  let data=null;
  try{data=JSON.parse(localStorage.getItem(KEY))}catch(e){}
  if(!data)data=JSON.parse(JSON.stringify(SEED));
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}};
  // Si el navegador ya tenía datos guardados, se suman los ejemplos nuevos (categorías y documentos agregados en SEED.__v=2)
  // sin tocar nada de lo existente: no se repiten ni se vuelven a crear los que el usuario haya borrado.
  const DESDE_V2={categoria:3,documento:3};
  if((data.__v||1)<(SEED.__v||1)){
    const sig=t=>data[t].reduce((m,r)=>Math.max(m,r[PK[t]]),0)+1,idCat={};
    SEED.categoria.forEach(c=>{
      let e=data.categoria.find(x=>x.nombre===c.nombre);
      if(!e&&c.idCategoria>DESDE_V2.categoria){e={...c,idCategoria:sig('categoria')};data.categoria.push(e)}
      if(e)idCat[c.idCategoria]=e.idCategoria;
    });
    SEED.documento.filter(d=>d.idDocumento>DESDE_V2.documento&&idCat[d.idCategoria]&&!data.documento.some(x=>x.titulo===d.titulo)&&data.usuario.some(u=>u.idUsuario==d.idUsuario))
      .forEach(d=>data.documento.push({...d,idDocumento:sig('documento'),idCategoria:idCat[d.idCategoria]}));
    data.__v=SEED.__v;save();
  }
  const api={
    all:t=>data[t],
    get:(t,id)=>data[t].find(r=>r[PK[t]]==id),
    where:(t,f)=>data[t].filter(f),
    insert(t,row){
      const pk=PK[t];
      if(AUTO.includes(t)&&row[pk]==null)row[pk]=data[t].reduce((m,r)=>Math.max(m,r[pk]),0)+1;
      data[t].push(row);save();return row;
    },
    update(t,id,cambios){Object.assign(api.get(t,id),cambios);save()},
    removeWhere(t,f){data[t]=data[t].filter(r=>!f(r));save()},
    remove(t,id){ // borrado con cascada, como ON DELETE CASCADE
      data[t]=data[t].filter(r=>r[PK[t]]!=id);
      FK.filter(f=>f[2]===t).forEach(([hija,col])=>{
        const hijos=data[hija].filter(r=>r[col]==id);
        if(PK[hija])hijos.forEach(h=>api.remove(hija,h[PK[hija]]));
        else data[hija]=data[hija].filter(r=>r[col]!=id);
      });
      save();
    },
    reset(){localStorage.removeItem(KEY);location.reload()}
  };
  return api;
})();

const rolesDe=id=>DB.where('usuarioRol',r=>r.idUsuario==id).map(r=>DB.get('rol',r.idRol).nombreRol);

const Sesion={
  K:'sigsm_sesion_v2',
  get(){try{return JSON.parse(sessionStorage.getItem(this.K))}catch(e){return null}},
  login(nombre,clave){
    const u=DB.all('usuario').find(x=>x.nombreUsuario===nombre);
    if(!u||u.contrasenaHash!==clave)return{error:'Usuario o contraseña incorrectos.'};
    if(!u.activo)return{error:'Tu usuario está inactivo. Contactá a un administrador.'};
    sessionStorage.setItem(this.K,JSON.stringify({idUsuario:u.idUsuario,nombre:u.nombreUsuario,roles:rolesDe(u.idUsuario)}));
    return{ok:true};
  },
  logout(){sessionStorage.removeItem(this.K)}
};
