import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { NextRequest } from 'next/server'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY ?? ''
  }
})

export async function GET(
  request: NextRequest,
  context: { params: { key: string[] } }
) {
  try {
    const { params } = await context;
    // Asegurarse de que params.key sea un array
    const keyParts = Array.isArray(params.key) ? params.key : [params.key];
    
    // Construir la key completa
    const key = keyParts
      .map(part => decodeURIComponent(part))
      .join('/')
      .replace(/\+/g, ' ');

    console.log('Intentando obtener archivo:', {
      bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      key
    });

    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    
    if (!response.Body) {
      throw new Error('No se encontró el contenido del archivo');
    }

    const buffer = Buffer.from(await response.Body.transformToByteArray());
    
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${encodeURIComponent(key.split('/').pop() || 'document.pdf')}"`,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error: any) {
    console.error('Error al obtener archivo:', {
      message: error.message,
      code: error.code,
      key: context.params.key
    });

    return new Response(
      JSON.stringify({ 
        error: 'Error al obtener el archivo',
        details: error.message 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

// Agregar soporte para OPTIONS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  })
}
