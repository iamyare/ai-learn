# Stick Note

## Descripción

Stick Note es una aplicación innovadora diseñada para mejorar el aprendizaje de los estudiantes. La aplicación muestra simultáneamente el documento de estudio y la transcripción en tiempo real de la clase impartida por el docente. Esto ayuda a mejorar la retención y comprensión del material por parte de los estudiantes, y es especialmente útil para personas con discapacidades auditivas. ![Stick Note Notebook](https://udmwntxrpzjwqptmwozr.supabase.co/storage/v1/object/public/public_bucket/photo_landing.webp)

## Características principales

- **Visualización simultánea:** Documentos de estudio y transcripciones de clase.
- **Historial de chat:** Para interacciones de los estudiantes.
- **Contenido adicional:** Integración de respuestas más completas.
- **Eventos importantes:** Botón que analiza la transcripción y el video para identificar fechas clave (exámenes, reuniones, etc.).
- **Almacenamiento:** Base de datos para transcripciones, PDFs y chats.
- **Multiplataforma:** Acceso a la información desde diferentes dispositivos.

## Tecnologías utilizadas

- **Framework:** Next.js
- **Estilos:** Tailwind CSS
- **Frontend:** React
- **Base de datos:** Supabase
- **IA:** SDK de Vercel para IA, API de Gemini de Google ![Captura de pantalla 1](https://udmwntxrpzjwqptmwozr.supabase.co/storage/v1/object/public/public_bucket/photo_landingpage_phone.webp)

## Instalación y uso

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/iamyare/stick-note.git
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno:** Crear un archivo `.env.local` en la raíz del proyecto y añadir las siguientes variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```

4. **Iniciar el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

**Nota:** Es necesario crear la base de datos en Supabase con la estructura necesaria según el tipado del proyecto.

## Estado actual y limitaciones

- **Desarrollo:** La interfaz gráfica está en desarrollo y se presenta como un prototipo funcional.
- **Mejoras:** Se están realizando mejoras continuas en rendimiento y accesibilidad.
- **Errores conocidos:** Problema en la transcripción en tiempo real en dispositivos Apple con navegadores basados en Chromium (funciona correctamente en Safari).
- **Compatibilidad:** No se han reportado problemas en dispositivos Windows.

## Contribuciones

Este proyecto es mantenido por [iamyare](https://github.com/iamyare). Las contribuciones son bienvenidas a través de pull requests.

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](notion://www.notion.so/iamyare/LICENSE) para más detalles.

## Contacto

- **GitHub:** [iamyare](https://github.com/iamyare)
- **Instagram:** [i.am.yare](https://www.instagram.com/i.am.yare)

## Demo

Puedes ver una demostración del proyecto en: [https://sticky-notes-yare.vercel.app](https://sticky-notes-yare.vercel.app/)
