# Reorganizacion de /dashboard/estadisticas

Fecha: 2026-05-25

## Regla de separacion

Huecos = accion inmediata.
Estadisticas = analisis del negocio.

## Que queda en Estadisticas

La pagina debe enfocarse en:

- Ocupacion media.
- Reservas por periodo.
- Ingresos estimados o reales.
- Rendimiento por barbero.
- Servicios mas vendidos.
- Clientes nuevos/recurrentes.
- Cancelaciones y no-show.
- Tendencias semanales o mensuales.

## Que se mueve a Huecos

Debe moverse o dejar de ser protagonista:

- Listado de huecos libres por barbero.
- Proximo hueco libre de hoy.
- Mensajes para llenar huecos.
- Acciones de reserva inmediata.
- Disponibilidad desde ahora.

## Que se comparte

Puede compartirse la logica base de disponibilidad, pero con dos salidas:

- Huecos: intervalos accionables con servicios que caben y CTAs.
- Estadisticas: agregados analiticos como ocupacion, huecos perdidos o horas libres por periodo.

## Componentes reutilizables

- `StatCard` para metricas.
- `PageHeader` para encabezado.
- La funcion central de huecos para calcular agregados, no para renderizar la experiencia operativa dentro de Estadisticas.

## Riesgo actual

`/dashboard/estadisticas` se comporta como una segunda pantalla de Huecos. Esto duplica informacion, confunde navegacion y debilita el valor de Huecos como accion rapida.
