"use client";

import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CountUp from 'react-countup';
import { useRealtimeLeads, useRealtimeEvents } from "@/hooks/useRealtimeLeads";

// --- UTILITY DATA/COMPONENTS ---

const LEAD_STATUS_COLORS: { [key: string]: string } = {
    new: "border-sky-500 bg-sky-900/50 text-sky-300",
    contacted: "border-yellow-500 bg-yellow-900/50 text-yellow-300",
    appointment: "border-purple-500 bg-purple-900/50 text-purple-300",
    closed: "border-green-500 bg-green-900/50 text-green-300",
    lost: "border-red-500 bg-red-900/50 text-red-300",
};

const ServiceBadge: React.FC<{ status: string }> = ({ status }) => {
    const colorClass = LEAD_STATUS_COLORS[status] || 'border-slate-600 bg-slate-800 text-slate-400';
    return <Badge variant={undefined} className={`capitalize ${colorClass}`}>{status}</Badge>;
};

const Header = () => (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-700 bg-cardBackground mb-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            <h1 className="text-3xl font-extrabold text-skyBlue">DentistLeads.pro</h1>
            <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-bold text-success">LIVE</span>
            </div>
        </div>
        <p className="text-sm text-muted-foreground">Live Demo Dashboard</p>
    </header>
);

const MetricCard = ({ title, value, subtitle, valueSuffix }: { title: string, value: number, subtitle: string, valueSuffix?: string }) => (
    <Card className="flex-1 min-w-[150px] bg-cardBackground border-slate-700 shadow-xl">
        <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-foreground flex items-baseline">
                {valueSuffix && <span className="text-xl mr-1">{valueSuffix}</span>}
                <CountUp start={0} end={value} duration={2.5} separator="," decimals={valueSuffix === '$' ? 0 : 1} />
                {!valueSuffix && title.includes('Value') && <span className="text-xl ml-1">$</span>}
            </div>
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </CardContent>
    </Card>
);

const LeadsTable = ({ leads }: { leads: any[] }) => {
    const [filterStatus, setFilterStatus] = React.useState('all');
    const [filterService, setFilterService] = React.useState('all');
    const [filterCity, setFilterCity] = React.useState('all');
    const [searchQuery, setSearchQuery] = React.useState('');

    const availableStatuses = ['all', 'new', 'contacted', 'appointment', 'closed', 'lost'];
    const availableServices = ['all', 'Teeth Whitening', 'Invisalign', 'Implants', 'Emergency', 'Cleaning', 'Veneers'];
    const availableCities = ['all', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte'];
    
    const filteredLeads = leads
        .filter(lead => 
            (filterStatus === 'all' || lead.status === filterStatus) &&
            (filterService === 'all' || lead.service === filterService) &&
            (filterCity === 'all' || lead.city === filterCity) &&
            (searchQuery === '' || lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || lead.phone.includes(searchQuery))
        );

    const PAGINATION_COUNT = 20;
    const [currentPage, setCurrentPage] = React.useState(1);
    const totalPages = Math.ceil(filteredLeads.length / PAGINATION_COUNT);
    const paginatedLeads = filteredLeads.slice((currentPage - 1) * PAGINATION_COUNT, currentPage * PAGINATION_COUNT);

    React.useEffect(() => {
        setCurrentPage(1); // Reset page on filter change
    }, [filterStatus, filterService, filterCity, searchQuery]);



    return (
        <Card className="mt-8 bg-cardBackground border-slate-700 shadow-xl">
            <CardHeader>
                <CardTitle className="text-lg text-foreground">Leads List</CardTitle>
                <CardDescription className="text-muted-foreground">View, filter, and search through all tracked leads.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Filter Bar */}
                <div className="flex flex-wrap gap-3 mb-6 p-4 border border-slate-700 rounded-lg bg-darkNavy/50">
                    <Input 
                        placeholder="Search by name or phone..." 
                        value={searchQuery} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="flex-1 min-w-[150px] border-slate-600 bg-darkNavy/70 text-foreground"
                    />
                    <Select value={filterStatus} onValueChange={(v: string) => { setFilterStatus(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-[180px] bg-darkNavy border-slate-600"><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                        <SelectContent>
                            {availableStatuses.map(status => (
                                <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filterService} onValueChange={(v: string) => { setFilterService(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-[180px] bg-darkNavy border-slate-600"><SelectValue placeholder="Filter by Service" /></SelectTrigger>
                        <SelectContent>
                            {availableServices.map(service => (
                                <SelectItem key={service} value={service}>{service}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filterCity} onValueChange={(v: string) => { setFilterCity(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-[180px] bg-darkNavy border-slate-600"><SelectValue placeholder="Filter by City" /></SelectTrigger>
                        <SelectContent>
                            {availableCities.map(city => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-slate-700 shadow-inner">
                    <table className="min-w-full divide-y divide-slate-700 text-sm">
                        <thead className="bg-cardBackground/80 text-xs uppercase tracking-wider text-muted-foreground sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Phone</th>
                                <th className="px-4 py-3 text-left">Service</th>
                                <th className="px-4 py-3 text-left">City</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-right">Revenue</th>
                                <th className="px-4 py-3 text-left">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-cardBackground">
                            {paginatedLeads.length > 0 ? paginatedLeads.map((lead: any) => (
                                <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{lead.name}</td>
                                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{lead.phone}</td>
                                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{lead.service}</td>
                                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{lead.city}</td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <ServiceBadge status={lead.status} />
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-sm">{lead.status === 'closed' ? `$${lead.revenue.toLocaleString()}` : '-'}</td>
                                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{new Date(lead.created_at).toLocaleTimeString()}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">No leads found matching criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 mt-4">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3 justify-between border-t border-slate-700">
                <Button variant="outline" onClick={() => fetch('/api/report', { method: 'POST' })}>Generate PDF Report</Button>
                <Button variant="outline" onClick={() => fetch('/api/slack', { method: 'POST' })}>Test Slack Alert</Button>
                <Button onClick={() => fetch('/api/leads', { method: 'POST' })}>Add Demo Lead</Button>
            </CardFooter>
        </Card>
    );
};

const LiveFeedSidebar = ({ events }: { events: any[] }) => (
    <div className="w-full lg:w-72 p-4 border-l border-slate-700 bg-cardBackground rounded-xl shadow-lg h-full lg:sticky lg:top-4">
        <h3 className="text-lg font-bold mb-4 text-foreground flex items-center space-x-2 border-b border-slate-700 pb-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Live Activity Feed</span>
        </h3>
        <div className="space-y-3 overflow-y-auto max-h-[60vh] lg:max-h-[70vh]">
            {events.length === 0 ? (
                <p className="text-sm text-muted-foreground pt-4">No recent activity.</p>
            ) : (
                // Reverse to show newest at the bottom if scrolling naturally, or keep as is if animating in from top
                [...events].reverse().map((event: any) => ( 
                    <div key={event.id} className="p-3 bg-slate-800 rounded-lg border border-skyBlue/50 text-sm transition-opacity duration-500 opacity-100">
                        <p className="text-foreground">
                            <span className="text-lg mr-1 align-middle">🦷</span>
                            <span className="font-semibold">{event.name}</span> from {event.city} requested <span className="text-skyBlue font-semibold">{event.service}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                    </div>
                ))
            )}
        </div>
    </div>
);

const ChartPlaceholder = ({ title }: { title: string }) => (
    <Card className="bg-cardBackground border-slate-700 h-[400px] shadow-xl">
        <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full -mt-12">
            <div className="text-muted-foreground text-sm border-2 border-dashed border-slate-600 p-6 rounded-lg">
                Chart data integration pending (Task 11)
            </div>
        </CardContent>
    </Card>
);


export default function Dashboard() {
    const { leads: fetchedLeads, loading: leadsLoading, error: leadsError, refetch } = useRealtimeLeads();
    const { events: realtimeEvents, loading: eventsLoading } = useRealtimeEvents();

    const [metrics, setMetrics] = React.useState({
        totalLeads: 0,
        totalAppointments: 0,
        totalRevenue: 0,
        avgLeadValue: 0,
        leadsByServiceData: [
            { name: 'Cleaning', count: 0 },
            { name: 'Teeth Whitening', count: 0 },
            { name: 'Invisalign', count: 0 },
            { name: 'Implants', count: 0 },
            { name: 'Emergency', count: 0 },
            { name: 'Veneers', count: 0 },
        ],
        leadsByStatusData: [
            { name: 'new', value: 0, color: '#0ea5e9' },
            { name: 'contacted', value: 0, color: '#f59e0b' },
            { name: 'appointment', value: 0, color: '#8b5cf6' },
            { name: 'closed', value: 0, color: '#22c55e' },
            { name: 'lost', value: 0, color: '#ef4444' },
        ],
    });
    const [leads, setLeads] = React.useState<any[]>([]);
    const [events, setEvents] = React.useState<any[]>([]);

    // Process fetched leads into metrics and table data
    React.useEffect(() => {
        if (fetchedLeads.length > 0) {
            const totalLeadsCount = fetchedLeads.length;
            const appointmentsCount = fetchedLeads.filter((l: any) => l.status === 'appointment').length;
            const closedLeads = fetchedLeads.filter((l: any) => l.status === 'closed');
            const totalRevenueSum = closedLeads.reduce((acc: number, l: any) => acc + Number(l.revenue), 0);
            const avgValue = closedLeads.length > 0 ? totalRevenueSum / closedLeads.length : 0;

            setMetrics({
                totalLeads: totalLeadsCount,
                totalAppointments: appointmentsCount,
                totalRevenue: totalRevenueSum,
                avgLeadValue: avgValue,
                leadsByServiceData: [
                    { name: 'Cleaning', count: fetchedLeads.filter((l: any) => l.service === 'Cleaning').length },
                    { name: 'Teeth Whitening', count: fetchedLeads.filter((l: any) => l.service === 'Teeth Whitening').length },
                    { name: 'Invisalign', count: fetchedLeads.filter((l: any) => l.service === 'Invisalign').length },
                    { name: 'Implants', count: fetchedLeads.filter((l: any) => l.service === 'Implants').length },
                    { name: 'Emergency', count: fetchedLeads.filter((l: any) => l.service === 'Emergency').length },
                    { name: 'Veneers', count: fetchedLeads.filter((l: any) => l.service === 'Veneers').length },
                ],
                leadsByStatusData: [
                    { name: 'new', value: fetchedLeads.filter((l: any) => l.status === 'new').length, color: '#0ea5e9' },
                    { name: 'contacted', value: fetchedLeads.filter((l: any) => l.status === 'contacted').length, color: '#f59e0b' },
                    { name: 'appointment', value: fetchedLeads.filter((l: any) => l.status === 'appointment').length, color: '#8b5cf6' },
                    { name: 'closed', value: fetchedLeads.filter((l: any) => l.status === 'closed').length, color: '#22c55e' },
                    { name: 'lost', value: fetchedLeads.filter((l: any) => l.status === 'lost').length, color: '#ef4444' },
                ],
            });

            // Prepare data for the leads table
            setLeads(fetchedLeads);
        } else if (!leadsLoading && !leadsError) {
            // No leads fetched yet, use empty array
            setLeads([]);
        }
    }, [fetchedLeads, leadsLoading, leadsError]);

    // Use events from the realtime hook
    React.useEffect(() => {
        if (realtimeEvents.length > 0) {
            setEvents(realtimeEvents);
        }
    }, [realtimeEvents]);


    return (
        <div className="min-h-screen bg-darkNavy p-2 sm:p-6 font-inter antialiased">
            <div className="max-w-screen-2xl mx-auto">
                <Header />
                
                {/* Metrics Row */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <MetricCard 
                        title="Total Leads" 
                        value={metrics.totalLeads} 
                        subtitle="+12 this week" 
                        valueSuffix=""
                    />
                    <MetricCard 
                        title="Appointments" 
                        value={metrics.totalAppointments} 
                        subtitle={`7.3% conversion`} 
                        valueSuffix=""
                    />
                    <MetricCard 
                        title="Revenue" 
                        value={metrics.totalRevenue} 
                        subtitle="From closed leads" 
                        valueSuffix="$"
                    />
                    <MetricCard 
                        title="Avg Lead Value" 
                        value={metrics.avgLeadValue} 
                        subtitle="Per closed deal" 
                        valueSuffix=""
                    />
                </div>

                {/* Charts Row */}
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    {/* Left: Bar Chart (60%) */}
                    <div className="lg:w-3/5">
                        <Card className="bg-cardBackground border-slate-700 h-[400px] shadow-xl">
                            <CardHeader>
                                <CardTitle>Leads by Service</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[calc(100%-60px)] -mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={metrics.leadsByServiceData || []} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={40}/>
                                        <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} 
                                            labelStyle={{ color: '#0ea5e9' }} 
                                            formatter={(value, name, props) => [`${value} Leads`, name]}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                        <Bar dataKey="count" fill="#0ea5e9" name="Leads" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Donut Chart (40%) */}
                    <div className="lg:w-2/5">
                        <Card className="bg-cardBackground border-slate-700 h-[400px] shadow-xl">
                            <CardHeader>
                                <CardTitle>Leads by Status</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center items-center h-full -mt-12">
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={metrics.leadsByStatusData || []}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={3}
                                        >
                                            {(metrics.leadsByStatusData || []).map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="p-2 bg-cardBackground border border-slate-700 rounded-lg shadow-xl text-xs">
                                                            <p className="font-bold text-skyBlue">{data.name.toUpperCase()}</p>
                                                            <p className="text-muted-foreground">Leads: {data.value}</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Table and Live Feed Row */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:flex-grow">
                        <LeadsTable leads={leads} />
                    </div>
                    
                    <div className="lg:w-72 flex-shrink-0">
                        <LiveFeedSidebar events={events} />
                    </div>
                </div>
            </div>
        </div>
    );
}