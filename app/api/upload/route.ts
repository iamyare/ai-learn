import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Verificar y limpiar las credenciales
const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID?.trim() ?? ''
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY?.trim() ?? ''

if (!accessKeyId || !secretAccessKey) {
  console.error('Credenciales de R2 no configuradas correctamente')
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId,
    secretAccessKey
  },
  forcePathStyle: true // Necesario para Cloudflare R2
})

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3005',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'Archivo y userId son requeridos' },
        { status: 400 }
      )
    }

    const key = `${userId}/${Date.now()}-${file.name}`
    const buffer = await file.arrayBuffer()

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type
    })

    try {
      await s3Client.send(command)
    } catch (uploadError) {
      console.error('Error específico de S3:', uploadError)
      return NextResponse.json(
        { error: 'Error al subir a R2', details: uploadError },
        { status: 500 }
      )
    }

    const publicUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${key}`
    return NextResponse.json({ url: publicUrl, key: file.name })
  } catch (error) {
    console.error('Error en upload:', error)
    return NextResponse.json(
      { error: 'Error al procesar la subida' },
      { status: 500 }
    )
  }
}
