import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#ffffff' },
  header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eeeeee', paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0ea5e9' },
  subtitle: { fontSize: 12, color: '#64748b', marginTop: 4 },
  section: { margin: 10, padding: 10 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  metricCard: { padding: 10, backgroundColor: '#f8fafc', borderRadius: 8, width: '22%' },
  metricValue: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  metricLabel: { fontSize: 10, color: '#64748b' },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCell: { margin: 'auto', marginTop: 5, fontSize: 10 }
});

const ReportPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>DentistLeads.pro Weekly Report</Text>
        <Text style={styles.subtitle}>Date Range: {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{data.totalLeads}</Text>
          <Text style={styles.metricLabel}>Total Leads</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{data.appointments}</Text>
          <Text style={styles.metricLabel}>Appointments</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>${data.revenue.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Revenue</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>${data.avgValue.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Avg Lead Value</Text>
        </View>
      </View>

      <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: 'bold' }}>Leads by Service</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.tableCell}>Service</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>Count</Text></View>
        </View>
        {data.leadsByService.map((item: any) => (
          <View style={styles.tableRow} key={item.service}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.service}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.count}</Text></View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export async function POST() {
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    const totalLeads = leads.length;
    const appointments = leads.filter(l => l.status === 'appointment').length;
    const closedLeads = leads.filter(l => l.status === 'closed');
    const revenue = closedLeads.reduce((acc, l) => acc + Number(l.revenue), 0);
    const avgValue = closedLeads.length > 0 ? revenue / closedLeads.length : 0;

    const serviceCounts = leads.reduce((acc: any, l) => {
      acc[l.service] = (acc[l.service] || 0) + 1;
      return acc;
    }, {});

    const leadsByService = Object.entries(serviceCounts).map(([service, count]) => ({ service, count }));

    const pdfBuffer = await renderToBuffer(<ReportPDF data={{ totalLeads, appointments, revenue, avgValue, leadsByService }} />);

    await resend.emails.send({
      from: 'reports@dentistleads.pro',
      to: process.env.REPORT_EMAIL!,
      subject: 'Weekly DentistLeads Report',
      attachments: [
        {
          filename: 'weekly-report.pdf',
          content: pdfBuffer,
        },
      ],
      html: '<p>Please find attached your weekly lead report.</p>',
    });

    return NextResponse.json({ success: true, message: `Report sent to ${process.env.REPORT_EMAIL}` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
