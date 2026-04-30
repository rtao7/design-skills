import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: result, error: err } = await supabaseAdmin.rpc('increment_news_likes', { news_id: id });

  if (err) return NextResponse.json({ error: err.message }, { status: 500 });
  return NextResponse.json({ likes: result });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: result, error: err } = await supabaseAdmin.rpc('decrement_news_likes', { news_id: id });

  if (err) return NextResponse.json({ error: err.message }, { status: 500 });
  return NextResponse.json({ likes: result });
}
