const P={};
const q=s=>new URLSearchParams(location.search).get(s);
const nom=(o)=>o?`${o.nombre} ${o.apellido}`:'—';
const opts=(arr,val,txt,sel)=>arr.map(r=>`<option value="${esc(r[val])}"${r[val]==sel?' selected':''}>${esc(typeof txt==='function'?txt(r):r[txt])}</option>`).join('');
const campo=(l,h,c='')=>`<div class="campo ${c}"><label>${l}</label>${h}</div>`;
const lupa='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#000" stroke-width="2"><circle cx="10" cy="10" r="7"/><path d="M15 15l6 6"/></svg>';
const buscador=`<div class="busca"><input id="q" placeholder="Buscar" autocomplete="off">${lupa}</div>`;
const msgDe=(c)=>(t,tipo='error')=>{const m=c.querySelector('#msg');m.textContent=t;m.className='msg '+tipo};
// Las reglas de los formularios las verifica el servidor (verificar.php)
// Convierte un <select> en un campo con buscador. El <select> original se conserva (oculto),
// así que su .value, .innerHTML y el evento change siguen funcionando igual.
const buscable=sel=>{
  const norm=t=>String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const cont=document.createElement('div');cont.className='combo';
  sel.parentNode.insertBefore(cont,sel);cont.appendChild(sel);
  const inp=document.createElement('input');inp.type='text';inp.autocomplete='off';inp.placeholder='Buscar...';inp.className=sel.className;
  const ul=document.createElement('ul');ul.className='combo-lista';ul.hidden=true;
  cont.append(inp,ul);
  let act=-1;
  const textoSel=()=>sel.selectedOptions[0]?.textContent||'';
  const mostrar=()=>{inp.value=textoSel()};
  const pintar=filtro=>{
    const f=norm(filtro||'');
    const ops=[...sel.options].filter(o=>norm(o.textContent).includes(f));
    ul.innerHTML=ops.length?ops.map(o=>`<li data-v="${esc(o.value)}"${o.value===sel.value?' class="act"':''}>${esc(o.textContent)}</li>`).join(''):'<li class="vacio">Sin resultados</li>';
    act=ops.findIndex(o=>o.value===sel.value);
  };
  const abrir=filtro=>{pintar(filtro);ul.hidden=false;ul.querySelector('.act')?.scrollIntoView({block:'nearest'})};
  const cerrar=()=>{ul.hidden=true;mostrar()};
  const elegir=v=>{sel.value=v;sel.dispatchEvent(new Event('change',{bubbles:true}));cerrar()};
  const mover=d=>{const li=[...ul.querySelectorAll('li[data-v]')];if(!li.length)return;
    act=(act+d+li.length)%li.length;li.forEach((x,i)=>x.classList.toggle('act',i===act));li[act].scrollIntoView({block:'nearest'})};
  let recien=false; // el primer clic que da el foco deja el texto seleccionado, así lo que se escribe lo reemplaza
  inp.addEventListener('focus',()=>{recien=true;inp.select();abrir()});
  inp.addEventListener('click',()=>{if(recien||ul.hidden){inp.select();recien=false}if(ul.hidden)abrir()});
  inp.addEventListener('input',()=>abrir(inp.value));
  inp.addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'){e.preventDefault();ul.hidden?abrir():mover(1)}
    else if(e.key==='ArrowUp'){e.preventDefault();ul.hidden?abrir():mover(-1)}
    else if(e.key==='Enter'){e.preventDefault();const li=ul.querySelectorAll('li[data-v]')[act>=0?act:0];if(li&&!ul.hidden)elegir(li.dataset.v)}
    else if(e.key==='Escape'){cerrar();inp.blur()}
  });
  ul.addEventListener('mousedown',e=>{e.preventDefault();const li=e.target.closest('li[data-v]');if(li)elegir(li.dataset.v)});
  inp.addEventListener('blur',cerrar);
  // si cambian las opciones del select (p. ej. al elegir otro tipo de vehículo) o su texto, se actualiza lo mostrado
  new MutationObserver(()=>{if(ul.hidden)mostrar()}).observe(sel,{childList:true,characterData:true,subtree:true});
  mostrar();
};
const verificar=async(accion,campos,existentes,archivo)=>{
  const fd=new FormData();fd.append('accion',accion);
  for(const k in campos)fd.append(k,campos[k]);
  if(existentes)fd.append('existentes',JSON.stringify(existentes));
  if(archivo)fd.append('archivo',archivo);
  if(location.protocol==='file:')return{ok:false,error:'La app está abierta como archivo (file://). Abrila desde un servidor con PHP, por ejemplo http://localhost:8000 con "php -S localhost:8000" o XAMPP.'};
  let r,t;
  try{r=await fetch('verificar.php',{method:'POST',body:fd});t=await r.text()}
  catch(e){return{ok:false,error:'No se pudo conectar con el servidor ('+location.origin+').'}}
  try{return JSON.parse(t)}
  catch(e){return{ok:false,error:'El servidor respondió '+r.status+' pero no ejecutó verificar.php (¿PHP no está activo en este servidor?). '+(t.trim().startsWith('<?php')?'Está devolviendo el código sin ejecutarlo.':'Respuesta: '+t.replace(/<[^>]*>/g,' ').trim().slice(0,150))}}
};

const ACCESO={'administrador':['traslados','documentos','usuarios','encuestas'],'usuario de ambulancias':['traslados'],'usuario de documentos':['documentos'],'usuario de encuestas':['encuestas']};
const ICONOS={traslados:'traslados',documentos:'documentos',usuarios:'usuarios',encuestas:'encuestas'};
function shell(titulo,activo,o={}){
  const s=Sesion.get();
  if(!s){location.href='index.html';return {};}
  const admin=s.roles.includes('administrador');
  const ok=s.roles.flatMap(r=>ACCESO[r]||[]);
  const nav=[['Traslados','traslados.html','traslados'],['Documentación','documentos.html','documentos'],['Usuarios','usuarios.html','usuarios'],['Encuestas','encuestas.html','encuestas']].filter(n=>ok.includes(n[2]));
  document.body.innerHTML=`<aside class="side"><div class="tit"><span>${titulo}</span>${ICONOS[activo]?`<img src="img/ic-${ICONOS[activo]}.png" alt="">`:''}</div>${o.nav===false?'':`<nav>${nav.map(n=>`<a href="${n[1]}"${n[2]===activo?' class="on"':''}>${n[0]}</a>`).join('')}</nav>`}<img class="logo-lateral" src="img/logo.png" alt="Hospital de Clínicas"></aside><div class="main"><header class="top"><span>${esc(s.roles.join(', '))}</span><span>${esc(s.nombre)}</span><a class="btn" id="salir" href="index.html">Cerrar sesión</a></header><main class="content"></main></div>`;
  document.getElementById('salir').onclick=()=>Sesion.logout();
  if(activo&&!ok.includes(activo)){location.href='panel.html';return {};}
  return {c:document.querySelector('.content'),sesion:s,admin,ok};
}

function listado(cfg){
  const {c,sesion}=shell(cfg.titulo,cfg.activo,cfg);
  if(!c)return null;
  c.innerHTML=`${cfg.arriba||''}<div class="barra"><div class="col">${cfg.izq||''}${buscador}</div><div class="col der">${cfg.der||''}</div></div><div class="tarjeta"><table class="tabla"><thead><tr>${cfg.cols.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody></tbody></table></div><p class="msg" id="msg"></p><dialog id="dlg"></dialog>`;
  const tb=c.querySelector('tbody'),qq=c.querySelector('#q'),msg=msgDe(c);let sel=null;
  const pintar=()=>{
    const t=qq.value.toLowerCase();
    const filas=cfg.datos().filter(f=>f.texto.toLowerCase().includes(t));
    tb.innerHTML=filas.map(f=>`<tr data-id="${f.id}"${f.id==sel?' class="sel"':''}>${f.celdas.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')||`<tr><td colspan="${cfg.cols.length}">Sin resultados</td></tr>`;
  };
  tb.addEventListener('click',e=>{const tr=e.target.closest('tr[data-id]');if(!tr)return;sel=tr.dataset.id;tb.querySelectorAll('tr').forEach(x=>x.classList.toggle('sel',x===tr))});
  c.addEventListener('input',pintar);c.addEventListener('change',pintar);
  pintar();
  return {c,sesion,pintar,msg,sel:()=>sel,borrar(txt,fn){
    if(sel==null)return msg('Seleccioná una fila primero.');
    if(!confirm(txt))return;
    if(fn(sel)===false)return;
    sel=null;pintar();msg('Listo.','ok');
  }};
}

/* ---------- Panel principal ---------- */
P.panel=()=>{
  const {c,ok}=shell('NEXO',null,{nav:false});if(!c)return;
  const im=n=>`<img src="img/ic-${n}.png" alt="">`;
  const ic={amb:im('traslados'),doc:im('documentos'),usr:im('usuarios'),enc:im('encuestas')};
  const m=[['traslados.html','amb','Trazabilidad de ambulancias','traslados'],['documentos.html','doc','Gestor de documentos','documentos'],['usuarios.html','usr','Gestor de usuarios','usuarios'],['encuestas.html','enc','Gestor de encuestas','encuestas']].filter(x=>ok.includes(x[3]));
  c.innerHTML=`<nav class="modulos">${m.map(x=>`<a class="modulo" href="${x[0]}">${ic[x[1]]}${x[2]}</a>`).join('')}</nav>`;
};

/* ---------- Documentos ---------- */
P.documentos=()=>{
  const L=listado({titulo:'Módulo de documentos',activo:'documentos',
    izq:`<select class="pill" id="cat"><option value="">Categoría</option>${opts(DB.all('categoria'),'idCategoria','nombre')}</select>`,
    der:`<button class="btn b-sm" id="del">Borrar</button><a class="btn b-lg" href="crear-documento.html">Crear documento</a>`,
    cols:['Nombre','Usuario','Fecha','Acción'],
    datos:()=>{const cat=document.getElementById('cat').value;
      return DB.where('documento',d=>d.activo&&(!cat||d.idCategoria==cat)).map(d=>{const u=DB.get('usuario',d.idUsuario);
        return{id:d.idDocumento,texto:`${d.titulo} ${u.nombreUsuario} ${d.descripcion}`,celdas:[esc(d.titulo),esc(u.nombreUsuario),d.fechaCarga,`<a href="${esc(d.archivoUrl)}" target="_blank" rel="noopener">Abrir</a>`]}})}});
  if(!L)return;
  buscable(L.c.querySelector('#cat'));
  L.c.querySelector('#del').onclick=()=>L.borrar('¿Borrar el documento seleccionado?',id=>DB.update('documento',id,{activo:0}));
};
P['crear-documento']=()=>{
  const {c,sesion}=shell('Módulo de documentos','documentos');if(!c)return;
  c.innerHTML=`<form class="form-card chico" id="f" novalidate><h2>Crear documento</h2><div class="grid">
    ${campo('Nombre:','<input id="titulo" maxlength="40">')}${campo('Descripción:','<input id="desc" maxlength="160">')}
    ${campo('Archivo:','<input id="arch" type="file" accept=".pdf,.doc,.docx,.odt,.rtf,.txt,.xls,.xlsx,.ods,.ppt,.pptx,.odp">')}${campo('Categoría:',`<select id="cat">${opts(DB.all('categoria'),'idCategoria','nombre')}</select>`)}
    </div><p class="msg" id="msg"></p><div class="acciones"><a class="btn" href="documentos.html">Atrás</a><button class="btn" type="submit">Crear</button></div></form>`;
  const msg=msgDe(c);
  buscable(c.querySelector('#cat'));
  c.querySelector('#f').onsubmit=async e=>{e.preventDefault();
    const titulo=c.querySelector('#titulo').value.trim(),desc=c.querySelector('#desc').value.trim(),f=c.querySelector('#arch').files[0];
    const btn=c.querySelector('button[type=submit]');btn.disabled=true;msg('Verificando...','ok');
    const j=await verificar('documento',{titulo,desc,cat:c.querySelector('#cat').value},DB.all('documento').map(d=>d.titulo),f);
    btn.disabled=false;
    if(!j.ok)return msg(j.error);
    DB.insert('documento',{idCategoria:+c.querySelector('#cat').value,idUsuario:sesion.idUsuario,titulo,descripcion:desc,archivoUrl:j.url,fechaCarga:hoy(),fechaAsignacion:hoy(),activo:1});
    location.href='documentos.html';
  };
};

/* ---------- Usuarios ---------- */
P.usuarios=()=>{
  const L=listado({titulo:'Módulo de administración de usuarios',activo:'usuarios',soloAdmin:true,
    izq:`<select class="pill" id="rol"><option value="">Tipo de usuario</option>${opts(DB.all('rol'),'idRol','nombreRol')}</select>`,
    der:`<button class="btn b-sm" id="del">Borrar</button><button class="btn b-sm" id="edit">Editar</button><a class="btn b-lg" href="crear-usuario.html">Crear Usuario</a>`,
    cols:['Usuario','Nombre','Email','Rol','Estado'],
    datos:()=>{const r=document.getElementById('rol').value;
      return DB.all('usuario').filter(u=>!r||DB.where('usuarioRol',x=>x.idUsuario==u.idUsuario&&x.idRol==r).length).map(u=>{const roles=rolesDe(u.idUsuario).join(', ');
        return{id:u.idUsuario,texto:`${u.nombreUsuario} ${nom(u)} ${u.email} ${roles}`,celdas:[esc(u.nombreUsuario),esc(nom(u)),esc(u.email),esc(roles),u.activo?'Activo':'Inactivo']}})}});
  if(!L)return;
  L.c.querySelector('#del').onclick=()=>L.borrar('¿Dar de baja al usuario seleccionado?',id=>{
    if(id==L.sesion.idUsuario){L.msg('No podés dar de baja tu propio usuario.');return false}
    DB.update('usuario',id,{activo:0})});
  L.c.querySelector('#edit').onclick=()=>L.sel()==null?L.msg('Seleccioná una fila primero.'):location.href='editar-usuario.html?id='+L.sel();
};
function formUsuario(editar){
  const {c}=shell('Módulo de administración de usuarios','usuarios',{soloAdmin:true});if(!c)return;
  const u=editar?DB.get('usuario',q('id')):null;
  if(editar&&!u){location.href='usuarios.html';return;}
  const miRol=u?DB.where('usuarioRol',r=>r.idUsuario==u.idUsuario)[0]?.idRol:null;
  c.innerHTML=`<form class="form-card chico" id="f" novalidate><h2>${editar?'Editar':'Crear'} usuario</h2><div class="grid">
    ${campo('Usuario:',`<input id="nu" maxlength="50" value="${esc(u?.nombreUsuario)}">`)}
    ${campo('Nombre:',`<input id="no" maxlength="50" value="${esc(u?.nombre)}">`)}${campo('Apellido:',`<input id="ap" maxlength="50" value="${esc(u?.apellido)}">`)}
    ${campo('Email:',`<input id="em" type="email" maxlength="120" value="${esc(u?.email)}">`)}
    ${campo(editar?'Contraseña (vacío = no cambiar):':'Contraseña:','<input id="pw" type="password">')}
    ${campo('Rol:',`<select id="rol">${opts(DB.all('rol'),'idRol','nombreRol',miRol)}</select>`)}
    ${editar?campo('',`<label><input type="checkbox" id="ac"${u.activo?' checked':''}> Activo</label>`,'roles'):''}
    </div><p class="msg" id="msg"></p><div class="acciones"><a class="btn" href="usuarios.html">Atrás</a><button class="btn" type="submit">${editar?'Aplicar cambios':'Crear'}</button></div></form>`;
  const msg=msgDe(c);
  c.querySelector('#f').onsubmit=async e=>{e.preventDefault();
    const v=id=>c.querySelector('#'+id).value.trim(),nu=v('nu'),pw=c.querySelector('#pw').value;
    const rs=[+c.querySelector('#rol').value];
    const campos={editar:editar?1:0,id:u?.idUsuario??'',nu,no:v('no'),ap:v('ap'),em:v('em'),pw,rol:c.querySelector('#rol').value};
    const j=await verificar('usuario',campos,DB.all('usuario').map(x=>({id:x.idUsuario,u:x.nombreUsuario,e:x.email})));
    if(!j.ok)return msg(j.error);
    const datos={nombreUsuario:nu,nombre:v('no'),apellido:v('ap'),email:v('em')};
    let id;
    if(editar){id=u.idUsuario;if(pw)datos.contrasenaHash=pw;datos.activo=c.querySelector('#ac').checked?1:0;DB.update('usuario',id,datos);DB.removeWhere('usuarioRol',r=>r.idUsuario==id);}
    else id=DB.insert('usuario',{...datos,contrasenaHash:pw,activo:1}).idUsuario;
    rs.forEach(r=>DB.insert('usuarioRol',{idUsuario:id,idRol:r,fechaAsignacion:hoy()}));
    location.href='usuarios.html';
  };
}
P['crear-usuario']=()=>formUsuario(false);
P['editar-usuario']=()=>formUsuario(true);

/* ---------- Traslados ---------- */
const solicitudInfo=s=>{
  const t=DB.all('traslado').find(x=>x.idSolicitud==s.idSolicitud),ruta=DB.get('ruta',s.idRuta);
  return{t,ruta,chofer:t?nom(DB.get('chofer',t.ciChofer)):'—',elem:s.elemento||DB.get('tipoElemento',s.idTipoElemento)?.nombre||'—',canal:DB.get('canalSolicitud',s.idCanal).nombre};
};
P.traslados=()=>{
  const L=listado({titulo:'Módulo de trazabilidad de ambulancias',activo:'traslados',
    der:`<button class="btn b-sm" id="del">Borrar</button><a class="btn b-lg" href="crear-solicitud.html">Crear solicitud</a>`,
    cols:['chofer','destino','elemento','canal','Acción'],
    datos:()=>DB.all('solicitudTraslado').map(s=>{const i=solicitudInfo(s);
      return{id:s.idSolicitud,texto:`${i.chofer} ${i.ruta.destino} ${i.elem} ${i.canal} ${s.motivo}`,celdas:[esc(i.chofer),esc(i.ruta.destino),esc(i.elem),esc(i.canal),`<a href="vista-solicitud.html?id=${s.idSolicitud}">Ver</a>`]}})});
  if(!L)return;
  L.c.querySelector('#del').onclick=()=>L.borrar('¿Borrar la solicitud seleccionada y su traslado?',id=>DB.remove('solicitudTraslado',id));
};
P['crear-solicitud']=()=>{
  const {c,sesion}=shell('Módulo de trazabilidad de ambulancias','traslados');if(!c)return;
  const sel=(id,arr,v,t)=>`<select id="${id}">${opts(arr,v,t)}</select>`;
  c.innerHTML=`<form class="form-card" id="f" novalidate><h2>Crear solicitud</h2><div class="grid">
    ${campo('Chofer:',sel('chofer',DB.all('chofer'),'ciChofer',nom))}${campo('Motivo:','<input id="motivo" maxlength="100">')}
    ${campo('Descripción:','<textarea id="desc" maxlength="100"></textarea>','alto')}
    ${campo('Enfermero:',sel('enf',DB.all('enfermero'),'ciEnfermero',nom))}${campo('Tipo de vehículo:',sel('tv',DB.all('tipoVehiculo'),'idTipoVehiculo','nombre'))}
    ${campo('Proveedor:',sel('prov',DB.all('proveedor'),'idProveedor','nombre'))}${campo('Vehículo:','<select id="veh"></select>')}
    ${campo('Paciente:',sel('pac',DB.all('paciente'),'ciPaciente',p=>`${nom(p)} (${p.ciPaciente})`))}${campo('¿Qué se transporta?:','<input id="elem" maxlength="100">')}
    ${campo('Destino:',sel('ruta',DB.all('ruta'),'idRuta',r=>`${r.origen} → ${r.destino}`))}${campo('Canal:',sel('canal',DB.all('canalSolicitud'),'idCanal','nombre'))}
    </div><p class="msg" id="msg"></p><div class="acciones"><a class="btn" href="traslados.html">Atrás</a><button class="btn" type="submit">Crear</button></div></form>`;
  const g=id=>c.querySelector('#'+id),msg=msgDe(c);
  const refrescar=()=>{const tv=g('tv').value;
    g('veh').innerHTML=opts(DB.where('vehiculo',v=>v.activo&&v.idTipoVehiculo==tv),'idVehiculo',v=>`${v.matricula} - ${v.marca} ${v.modelo}`);
  };
  g('tv').onchange=refrescar;refrescar();
  ['chofer','enf','pac','veh'].forEach(id=>buscable(g(id)));
  g('f').onsubmit=async e=>{e.preventDefault();
    const motivo=g('motivo').value.trim(),desc=g('desc').value.trim();
    const campos={chofer:g('chofer').value,motivo,desc,enf:g('enf').value,tv:g('tv').value,prov:g('prov').value,veh:g('veh').value,pac:g('pac').value,elem:g('elem').value.trim(),ruta:g('ruta').value,canal:g('canal').value};
    const j=await verificar('solicitud',campos);
    if(!j.ok)return msg(j.error);
    const s=DB.insert('solicitudTraslado',{ciPaciente:+g('pac').value,idTipoElemento:null,elemento:g('elem').value.trim(),idRuta:+g('ruta').value,idCanal:+g('canal').value,idUsuario:sesion.idUsuario,fechaSolicitud:hoy(),motivo,estadoSolicitud:'pendiente',descripcion:desc});
    const t=DB.insert('traslado',{idSolicitud:s.idSolicitud,idVehiculo:+g('veh').value,ciChofer:+g('chofer').value,ciEnfermero:+g('enf').value,idProveedor:+g('prov').value,idRuta:+g('ruta').value,horaSalida:ahora(),horaLlegada:null});
    DB.insert('historialEstado',{idTraslado:t.idTraslado,idEstado:1,horaLlegada:ahora(),observaciones:'Solicitud recibida.'});
    location.href='traslados.html';
  };
};
P['vista-solicitud']=()=>{
  const {c}=shell('Módulo de trazabilidad de ambulancias','traslados');if(!c)return;
  const s=DB.get('solicitudTraslado',q('id'));
  if(!s){location.href='traslados.html';return;}
  const i=solicitudInfo(s),t=i.t,veh=t&&DB.get('vehiculo',t.idVehiculo),tv=veh&&DB.get('tipoVehiculo',veh.idTipoVehiculo);
  const d=(l,v,caja)=>campo(l,`<div class="dato${caja?' caja':''}">${esc(v)}</div>`,caja?'alto':'');
  const hist=t?DB.where('historialEstado',h=>h.idTraslado==t.idTraslado).map(h=>`<li>${esc(h.horaLlegada)} — ${esc(DB.get('estadoTraslado',h.idEstado).nombre)}: ${esc(h.observaciones)}</li>`).join(''):'';
  c.innerHTML=`<div class="form-card"><h2>Vista solicitud</h2><div class="grid">
    ${d('Chofer:',i.chofer)}${d('Motivo:',s.motivo)}${d('Descripción:',s.descripcion,true)}
    ${d('Enfermero:',t?nom(DB.get('enfermero',t.ciEnfermero)):'—')}${d('Tipo de vehículo:',tv?.nombre||'—')}${d('Vehículo:',veh?`${veh.matricula} - ${veh.marca} ${veh.modelo}`:'—')}
    ${d('Proveedor:',t?DB.get('proveedor',t.idProveedor).nombre:'—')}${d('Paciente:',nom(DB.get('paciente',s.ciPaciente)))}${d('¿Qué se transporta?:',i.elem)}
    ${d('Destino:',`${i.ruta.origen} → ${i.ruta.destino} (${i.ruta.distanciaKm} km)`)}${d('Canal:',i.canal)}${d('Estado / fecha:',`${s.estadoSolicitud} — ${s.fechaSolicitud}`)}
    </div>${hist?`<ul class="hist"><strong>Historial</strong>${hist}</ul>`:''}<div class="acciones"><a class="btn" href="traslados.html">Atrás</a></div></div>`;
};

/* ---------- Encuestas ---------- */
const tabsEnc=a=>`<div class="tabs"><a href="estadisticas.html"${a?'':' class="on"'}>Estadísticas de satisfacción</a><a href="encuestas.html"${a?' class="on"':''}>Encuestas</a></div>`;
P.encuestas=()=>{
  const L=listado({titulo:'Módulo de encuestas',activo:'encuestas',arriba:tabsEnc(true),
    izq:`<select class="pill" id="cat"><option value="">Categoría</option>${opts(DB.all('categoria'),'idCategoria','nombre')}</select>`,
    cols:['Título','Segmento','Respuestas','Acción'],
    datos:()=>{const cat=document.getElementById('cat').value;
      return DB.where('encuesta',e=>!cat||e.idCategoria==cat).map(e=>({id:e.idEncuesta,texto:`${e.titulo} ${e.segmento}`,
        celdas:[esc(e.titulo),esc(e.segmento),DB.where('respuestaEncuesta',r=>r.idEncuesta==e.idEncuesta).length,`<a href="#" data-ver="${e.idEncuesta}">Ver preguntas</a>`]}))}});
  if(!L)return;
  L.c.addEventListener('click',e=>{const id=e.target.dataset?.ver;if(!id)return;e.preventDefault();
    const en=DB.get('encuesta',id),dlg=L.c.querySelector('#dlg');
    dlg.innerHTML=`<h3>${esc(en.titulo)}</h3>${DB.where('pregunta',p=>p.idEncuesta==id).sort((a,b)=>a.orden-b.orden).map(p=>`<p><strong>${p.orden}. ${esc(p.txtPregunta)}</strong></p><ul>${DB.where('opcionRespuesta',o=>o.idPregunta==p.idPregunta).map(o=>`<li>${esc(o.textoOpcion)}</li>`).join('')}</ul>`).join('')}<form method="dialog"><button class="btn b-sm">Cerrar</button></form>`;
    dlg.showModal();});
};
P.estadisticas=()=>{
  const {c}=shell('Módulo de encuestas','encuestas');if(!c)return;
  const grupos=['Extremadamente positivas','Mayormente positivas','Variadas','Mayormente negativas','Extremadamente negativas'];
  const nivel={'Excelente':5,'Muy satisfecho':5,'Sí':5,'Buena':4,'Bueno':4,'Satisfecho':4,'Regular':3,'Poco satisfecho':3,'Mala':2,'Malo':2,'Insatisfecho':2,'No':1};
  const cuentas=grupos.map(n=>[n,0]);
  // cada encuesta completada se clasifica una sola vez según el promedio de sus respuestas
  DB.all('respuestaEncuesta').forEach(re=>{
    const pts=DB.where('respuestaPregunta',r=>r.idRespuestaEncuesta==re.idRespuestaEncuesta).map(r=>nivel[DB.get('opcionRespuesta',r.idOpcion)?.textoOpcion]).filter(Boolean);
    if(pts.length)cuentas[5-Math.round(pts.reduce((a,b)=>a+b,0)/pts.length)][1]++;
  });
  const total=cuentas.reduce((a,x)=>a+x[1],0);
  const max=Math.max(1,...cuentas.map(x=>x[1]));
  c.innerHTML=`${tabsEnc(false)}<div class="stat-ok">Encuestas completadas: ${total}</div><div class="stats"><h2>Estadísticas de satisfacción</h2>${cuentas.map(([n,v])=>`<div class="fila">${n}: ${v}</div><div class="barra-v" style="width:${Math.max(1,v/max*100)}%;max-width:510px${v?'':';opacity:.25'}"></div>`).join('')}</div>`;
};

if(P[document.body.dataset.page])P[document.body.dataset.page]();
