import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';
import { isAdminEmail, UNAUTHORIZED_RESPONSE, ADMIN_UNAUTHORIZED_RESPONSE } from '@/lib/auth/admin';
import type { ContactMessageUpdate } from '@/types/contact';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/messages/[id] - pobiera pojedynczą wiadomość
 * Wymaga autoryzacji admin
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Auth check
    const supabase = await createAuthServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: UNAUTHORIZED_RESPONSE.error },
        { status: UNAUTHORIZED_RESPONSE.status }
      );
    }

    if (!isAdminEmail(user.email || '')) {
      return NextResponse.json(
        { error: ADMIN_UNAUTHORIZED_RESPONSE.error },
        { status: ADMIN_UNAUTHORIZED_RESPONSE.status }
      );
    }

    const { id } = await context.params;

    // Fetch message
    const { data: message, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !message) {
      return NextResponse.json(
        { error: 'Wiadomość nie znaleziona' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error in GET /api/admin/messages/[id]:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/messages/[id] - aktualizuje wiadomość (status, notatki)
 * Wymaga autoryzacji admin
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Auth check
    const supabase = await createAuthServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: UNAUTHORIZED_RESPONSE.error },
        { status: UNAUTHORIZED_RESPONSE.status }
      );
    }

    if (!isAdminEmail(user.email || '')) {
      return NextResponse.json(
        { error: ADMIN_UNAUTHORIZED_RESPONSE.error },
        { status: ADMIN_UNAUTHORIZED_RESPONSE.status }
      );
    }

    const { id } = await context.params;
    const body = await request.json() as ContactMessageUpdate;

    // Validation
    if (body.status && !['new', 'read', 'replied', 'archived'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy status wiadomości' },
        { status: 400 }
      );
    }

    // Update message
    const updateData: any = {};
    
    if (body.status !== undefined) {
      updateData.status = body.status;
    }
    
    if (body.admin_notes !== undefined) {
      updateData.admin_notes = body.admin_notes;
    }

    const { data: updatedMessage, error } = await supabase
      .from('contact_messages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating message:', error);
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Wiadomość nie znaleziona' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: 'Nie udało się zaktualizować wiadomości' },
        { status: 500 }
      );
    }

    if (!updatedMessage) {
      return NextResponse.json(
        { error: 'Wiadomość nie znaleziona' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: updatedMessage });
  } catch (error) {
    console.error('Error in PATCH /api/admin/messages/[id]:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/messages/[id] - usuwa wiadomość
 * Wymaga autoryzacji admin
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Auth check
    const supabase = await createAuthServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: UNAUTHORIZED_RESPONSE.error },
        { status: UNAUTHORIZED_RESPONSE.status }
      );
    }

    if (!isAdminEmail(user.email || '')) {
      return NextResponse.json(
        { error: ADMIN_UNAUTHORIZED_RESPONSE.error },
        { status: ADMIN_UNAUTHORIZED_RESPONSE.status }
      );
    }

    const { id } = await context.params;

    // Delete message
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting message:', error);
      return NextResponse.json(
        { error: 'Nie udało się usunąć wiadomości' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/messages/[id]:', error);
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
