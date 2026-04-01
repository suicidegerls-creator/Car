import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

// Настройки оптимизации изображений
const IMAGE_CONFIG = {
  maxWidth: 1200,      // Максимальная ширина
  maxHeight: 1200,     // Максимальная высота
  quality: 85,         // Качество JPEG/WebP
  format: 'webp' as const,  // Формат для конвертации
}

// Размеры для разных вариантов изображений
const IMAGE_SIZES = {
  full: { width: 1200, height: 1200 },
  thumb: { width: 400, height: 400 },
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF, AVIF' }, { status: 400 })
    }

    // Max 10MB (увеличили лимит для больших фото)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    // Конвертируем File в Buffer для обработки sharp
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Получаем метаданные изображения
    const metadata = await sharp(buffer).metadata()
    console.log('[v0] Original image:', metadata.width, 'x', metadata.height, metadata.format)

    // Оптимизируем изображение
    let optimizedBuffer: Buffer

    // Определяем нужно ли изменять размер
    const needsResize = 
      (metadata.width && metadata.width > IMAGE_CONFIG.maxWidth) || 
      (metadata.height && metadata.height > IMAGE_CONFIG.maxHeight)

    let sharpInstance = sharp(buffer)

    if (needsResize) {
      sharpInstance = sharpInstance.resize(IMAGE_CONFIG.maxWidth, IMAGE_CONFIG.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    // Конвертируем в WebP для оптимального размера
    optimizedBuffer = await sharpInstance
      .webp({ quality: IMAGE_CONFIG.quality })
      .toBuffer()

    // Получаем метаданные оптимизированного изображения
    const optimizedMetadata = await sharp(optimizedBuffer).metadata()
    console.log('[v0] Optimized image:', optimizedMetadata.width, 'x', optimizedMetadata.height, 
      'Size:', (optimizedBuffer.length / 1024).toFixed(1), 'KB')

    // Генерируем уникальное имя файла
    const timestamp = Date.now()
    const baseName = file.name.replace(/\.[^/.]+$/, '') // Убираем расширение
    const safeBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_') // Безопасное имя
    const fileName = `wheels/${timestamp}-${safeBaseName}.webp`

    // Загружаем оптимизированное изображение (private store)
    const blob = await put(fileName, optimizedBuffer, {
      access: 'private',
      contentType: 'image/webp',
    })

    console.log('[v0] Uploaded to:', blob.pathname)

    // Возвращаем URL для доступа через наш API
    const publicUrl = `/api/image/${encodeURIComponent(blob.pathname)}`

    return NextResponse.json({ 
      url: publicUrl,
      pathname: blob.pathname,
      width: optimizedMetadata.width,
      height: optimizedMetadata.height,
      size: optimizedBuffer.length,
    })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json({ error: 'Upload failed: ' + (error as Error).message }, { status: 500 })
  }
}
