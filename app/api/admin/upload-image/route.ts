import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * API endpoint do uploadu obrazów produktów do Supabase Storage
 * POST - Upload image do bucket 'product-images'
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Brak pliku' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy format pliku. Dozwolone: JPEG, PNG, WebP' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Plik jest zbyt duży (maksymalnie 5MB)' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const ext = file.name.split('.').pop() || 'jpg';
    const sanitizedExt = ext.replace(/[^a-zA-Z0-9]/g, '');

    // Organize by productId if provided
    const fileName = productId
      ? `${productId}/${timestamp}-${randomStr}.${sanitizedExt}`
      : `temp/${timestamp}-${randomStr}.${sanitizedExt}`;

    // Upload to Supabase Storage
    const supabase = createServerClient();

    const { data, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('product-images').getPublicUrl(data.path);

    console.log('✅ Image uploaded to Supabase:', publicUrl);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: fileName,
      path: data.path,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd podczas uploadu' },
      { status: 500 }
    );
  }
}
