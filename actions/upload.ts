'use server'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_ENDPOINT as string,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY as string,
  },
})

export async function generateUploadUrl(fileName: string, contentType: string, userId: string) {
  if (!userId) {
    throw new Error('No autorizado')
  }

  try {
    const key = `${userId}/${Date.now()}-${fileName}`
    
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ACL: 'public-read'
    })

    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600,
      signableHeaders: new Set(['host', 'content-type', 'x-amz-acl']) // Firmar headers host, content-type y x-amz-acl
    })

    const publicUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${key}`

    return { uploadUrl, publicUrl }
  } catch (error) {
    console.error('Error generating signed URL:', error)
    throw new Error('Error generando URL de subida')
  }
}
