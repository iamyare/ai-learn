# TODO List para el Proyecto de IA y Gestión de Documentos

## Lector de PDF

- [ ] Cambiar por react-pdf/renderer y investigar pdf-lib

## Estructura y Navegación

- [x] Mejorar el árbol de archivos
- [ ] Implementar funcionalidad de URL con IDs de folders
  - [ ] Diseñar estructura de URLs
  - [ ] Implementar enrutamiento dinámico
  - [ ] Asegurar que los enlaces sean compartibles

## Funcionalidades de IA y Procesamiento de Datos

- [x] Solucionar integración de IA
- [ ] Implementar funcionalidad de audio a texto
  - [ ] Investigar y seleccionar API de transcripción
  - [ ] Integrar API en la interfaz de usuario
  - [ ] Añadir opción de carga de archivos de audio
- [ ] Mejorar visualización de origen de transcripción en respuestas
  - [ ] Destacar visualmente las partes relevantes de la transcripción
  - [-] Implementar sistema de referencias o citas

## Interfaz de Usuario

- [x] Solucionar modal de menú de usuario
- [x] Cambiar input por textarea para mejorar la entrada de texto
- [-] Mejorar renderizado de markdown en el chat
  - [x] Investigar bibliotecas de renderizado de markdown
  - [x] Implementar resaltado de sintaxis para bloques de código
- [x] Implementar opciones de visualización y copia de transcripción
- [ ] Añadir botón para descargar el historial del chat
  - [ ] Diseñar formato de exportación (ej. PDF, TXT)
  - [ ] Implementar funcionalidad de descarga

## Configuración y Personalización

- [ ] Ampliar opciones en el modal de configuración:
  - [ ] Sección de Datos Generales del usuario
  - [ ] Gestión de API Keys
  - [ ] Configuración de dispositivos de audio (micrófono y altavoces)
  - [ ] Selección de idioma predeterminado para los notebooks
- [ ] El estilo de la transcripcion debe de corregirse
- [ ] Estilos recortados

## Optimización de Rendimiento

- [ ] Implementar carga lazy de componentes al hacer scroll
- [ ] Optimizar renderizado de elementos del chat

## Características Adicionales

- [x] Añadir indicador de carga al enviar mensajes
- [x] Implementar botón para descargar imágenes de gráficos
  - [x] Asegurar compatibilidad con diferentes formatos (PNG, SVG)

## Pruebas y Depuración

- [ ] Realizar pruebas de usabilidad de las nuevas características
- [ ] Implementar sistema de logging para facilitar la depuración

## Documentación

- [ ] Actualizar documentación del proyecto con las nuevas características
- [ ] Crear guía de usuario para las funcionalidades principales

---

Leyenda:

- [x] Tarea completada
- [-] Tarea en progreso
- [ ] Tarea pendiente
