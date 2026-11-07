## 4.3 Restricciones no estructurales

1. **Compatibilidad, traslado, vehículo, tipoVehículo y tipoElemento:** El vehículo asignado a un traslado debe pertenecer a un tipoVehículo compatible con el tipoElemento a trasladar, según la tabla compatibilidad. Esto se soluciona con un `SELECT` que obtenga el `id` del tipoVehiculo junto al tipoElemento usados y después PHP compruebe si en la tabla de compatibilidad están relacionados.

2. **traslado (horaLlegada, horaSalida):** `horaLlegada` debe ser posterior a `horaSalida` en traslado. Esto se soluciona haciendo que cuando se cree un traslado, `horaSalida` sea por defecto la hora actual, mientras que la llegada sea por defecto `NULL`, haciendo así que recién al terminar el traslado se almacene la `horaLlegada`.

3. **historialEstado:** Cada nuevo registro de estado debe tener `horaLlegada` posterior al del estado anterior para el mismo `idTraslado` (orden cronológico del historial de estados). Esto se soluciona con un `DATETIME DEFAULT CURRENT_TIMESTAMP`, haciendo así que cada vez que se cree un registro tenga la hora con la que se creó.

4. **solicitudTraslado, estadoSolicitud:** El estado de solicitud no puede pasar de pendiente a finalizado o de finalizado a pendiente, etc. Esto se solventa desde la propia aplicación, ya que no se permiten cambios fuera del orden.

5. **vehiculo:** La matrícula debe cumplir un patrón válido de placas uruguayas. Esto se solventa desde PHP con `preg_match`, validando si cumple las normas.

6. **paciente:** Su fecha de nacimiento no puede ser mayor a la actual. Esto no debería ocurrir, ya que el paciente se consumirá desde una API, pero en el estado actual no se contempla, ya que no se pueden crear nuevos usuarios y los que existen ya fueron creados con anterioridad.

7. **ruta:** `distanciaKm` debe ser mayor a cero. Esto se logra con un `CHECK` que compruebe si es mayor a cero.

8. **solicitudTraslado:** `fechaSolicitud` no debería ser posterior a la fecha/hora del traslado asociado. Esto se soluciona con un `DEFAULT CURRENT_DATE`, junto a que las solicitudes siempre se crean antes que el propio traslado.

9. **ciPaciente:** Se supone que esta tabla no debería existir, ya que se debe consumir de una API. Esta tabla existe de modo provisorio hasta que se disponga de la misma.

### 4.2.2 Módulo Documentación

1. **Encuestas:** Las encuestas deben ser anónimas. Esto se solventa en la propia tabla, ya que no almacena ningún dato del paciente.

2. **opcionRespuesta, idPregunta:** Cada `opcionRespuesta.idOpcion` registrado en `respuestaPregunta` debe pertenecer efectivamente a la misma pregunta indicada en `idPregunta`. Esto se garantiza desde PHP cuando se insertan los datos.

3. **documento:** Debe tener formato de URL válida. Esto se logra mediante un `CHECK` en SQL.

### 4.2.3 Módulo Usuarios

1. **usuario:** El email tiene que tener un formato válido. Esto se logra con un `CHECK` que valida si tiene un “@” y un “.”.

2. **contrasenaHash:** Las contraseñas no se almacenan en texto plano. Deben guardarse con `password_hash()` y verificarse con `password_verify()`.

3. **usuario, usuarioRol, rol:** Cada usuario debe tener un rol asignado. Se solucionará en un futuro mediante PHP (todavía no implementado).

4. **rol:** Los nombres de rol deben ser únicos. Esto se solventó con `ENUM` + `UNIQUE`.

5. **usuario:** Un usuario no administrador.

6. **Control de acceso por rol:** Un usuario con rol `usrDocs` no debería poder operar el módulo de ambulancias, y viceversa; solo `admin` debería gestionar usuarios y roles — regla de autorización de aplicación.
