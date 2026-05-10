# Widget de reservas BarberiaOS

El widget permite instalar un boton flotante de reserva en webs externas sin dependencias, cookies ni captura de datos personales. Al hacer clic, envia al cliente a la reserva publica de la barberia.

## Instalacion basica

```html
<script src="https://barberiaos.com/widget.js" data-barbershop="slug-barberia" async></script>
```

`data-barbershop` es obligatorio y debe coincidir con el slug publico de la barberia. El destino generado es:

```text
https://barberiaos.com/r/slug-barberia
```

## Opciones

```html
<script
  src="https://barberiaos.com/widget.js"
  data-barbershop="slug-barberia"
  data-label="Reservar cita"
  data-theme="gold"
  data-position="bottom-right"
  async
></script>
```

- `data-label`: texto del boton. Por defecto: `Reservar ahora`.
- `data-theme`: `dark`, `light` o `gold`. Por defecto: `dark`.
- `data-position`: `bottom-right`, `bottom-left`, `top-right` o `top-left`. Por defecto: `bottom-right`.

## Notas de integracion

- Insertar el script antes de `</body>` o en el gestor de scripts del CMS.
- Compatible con carga `async`.
- Si falta `data-barbershop`, el widget no se muestra y registra un `console.warn` controlado.
- Si el script se carga dos veces, solo se monta un widget.
