import { useState, useEffect } from "react";
import { Calendar, Users, Hotel, TrendingUp } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Event = {
  id: string;
  name: string;
  start_date: string;
  participant_count: number;
  status: "active" | "pending" | "completed" | "cancelled";
};

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchEvents() {
      try {
        console.log("[Supabase] Connecting...");
        const { data, error } = await supabase
          .from("events")
          .select("id, name, start_date, participant_count, status")
          .order("start_date", { ascending: false })
          .limit(4);

        if (error) {
          console.error("[Supabase] Error:", error);
          toast({
            variant: "destructive",
            title: "데이터 로드 실패",
            description: error.message,
          });
          return;
        }

        console.log("[Supabase] Connected successfully");
        console.log(`[Data] Events loaded: ${data?.length || 0} rows`);
        setEvents((data || []) as Event[]);
      } catch (err) {
        console.error("[Supabase] Connection error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [toast]);
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">대시보드</h1>
            <p className="mt-2 text-muted-foreground">
              SympoHub 행사 관리 플랫폼에 오신 것을 환영합니다
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Calendar className="h-5 w-5" />
            새 행사 등록
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="전체 행사"
            value={24}
            description="이번 달 진행 중"
            icon={Calendar}
            trend={{ value: "12%", isPositive: true }}
          />
          <StatCard
            title="총 참가자"
            value="3,847"
            description="전체 등록 인원"
            icon={Users}
            trend={{ value: "8.2%", isPositive: true }}
          />
          <StatCard
            title="숙박 이용률"
            value="87%"
            description="객실 배정 완료"
            icon={Hotel}
            trend={{ value: "5.1%", isPositive: true }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
        <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                최근 행사
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="overflow-hidden rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted hover:bg-muted">
                      <TableHead className="font-semibold">행사명</TableHead>
                      <TableHead className="font-semibold">일자</TableHead>
                      <TableHead className="font-semibold">참가자</TableHead>
                      <TableHead className="font-semibold">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          데이터를 불러오는 중...
                        </TableCell>
                      </TableRow>
                    ) : events.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          등록된 행사가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      events.map((event) => (
                        <TableRow key={event.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{event.name}</TableCell>
                          <TableCell>{event.start_date}</TableCell>
                          <TableCell>{event.participant_count}명</TableCell>
                          <TableCell>
                            <StatusBadge status={event.status} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">빠른 작업</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3" size="lg">
                <Calendar className="h-5 w-5 text-primary" />
                새 행사 등록
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" size="lg">
                <Users className="h-5 w-5 text-primary" />
                참가자 추가
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" size="lg">
                <Hotel className="h-5 w-5 text-primary" />
                객실 배정
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
