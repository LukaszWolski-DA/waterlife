import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * API endpoint do uploadu obrazów produktów
 * POST - Upload image do /public/images/products/
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Brak pliku' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy format pliku' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Plik jest zbyt duży (max 5MB)' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `product-${timestamp}-${originalName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'images', 'products');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return public URL
    const url = `/images/products/${filename}`;

    console.log('✅ Image uploaded:', url);

    return NextResponse.json({
      success: true,
      url,
      filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd podczas uploadu' },
      { status: 500 }
    );
  }
}
