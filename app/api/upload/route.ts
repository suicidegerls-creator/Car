import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import sharp from 'sharp'

// Настройки оптимизации изображений
const IMAGE_CONFIG = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 85,
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
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

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    // Конвертируем File в Buffer для обработки sharp
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Получаем метаданные изображения
    const metadata = await sharp(buffer).metadata()

    // Оптимизируем изображение
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

    // Конвертируем в WebP
    const optimizedBuffer = await sharpInstance
      .webp({ quality: IMAGE_CONFIG.quality })
      .toBuffer()

    // Получаем метаданные оптимизированного изображения
    const optimizedMetadata = await sharp(optimizedBuffer).metadata()

    // Генерируем уникальное имя файла
    const timestamp = Date.now()
    const baseName = file.name.replace(/\.[^/.]+$/, '')
    const safeBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_')
    const fileName = `${timestamp}-${safeBaseName}.webp`
    const filePath = `wheels/${fileName}`

    // Проверяем/создаем bucket
    const { data: buckets } = await supabase.storage.listBuckets()
    const imagesBucketExists = buckets?.some(b => b.name === 'images')
    
    if (!imagesBucketExists) {
      const { error: createBucketError } = await supabase.storage.createBucket('images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
      })
      
      if (createBucketError && !createBucketError.message.includes('already exists')) {
        return NextResponse.json({ 
          error: 'Failed to create storage bucket: ' + createBucketError.message 
        }, { status: 500 })
      }
    }

    // Загружаем в Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, optimizedBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000', // 1 year cache
        upsert: false,
      })

    if (error) {
      throw error
    }

    // Получаем публичный URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return NextResponse.json({ 
      url: urlData.publicUrl,
      pathname: filePath,
      width: optimizedMetadata.width,
      height: optimizedMetadata.height,
      size: optimizedBuffer.length,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed: ' + (error as Error).message }, { status: 500 })
  }
}
