import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 })
  }

  try {
    const response = await fetch(`https://${url}`)
    const arrayBuffer = await response.arrayBuffer()
    
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/javascript',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('Error fetching worker:', error)
    return new NextResponse('Error fetching worker', { status: 500 })
  }
}
