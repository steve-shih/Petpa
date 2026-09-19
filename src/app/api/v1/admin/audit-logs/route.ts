import { NextResponse } from 'next/server';
import { auditLogs } from '@/lib/mock-data';

// GET /api/v1/admin/audit-logs - 最高管理員獲取全站操作軌跡 Audit Log RESTful API
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');

  let filtered = auditLogs;
  if (role && role !== 'all') {
    filtered = auditLogs.filter(l => l.role === role);
  }

  return NextResponse.json({
    success: true,
    code: 200,
    timestamp: new Date().toISOString(),
    totalCount: filtered.length,
    data: filtered,
  });
}
