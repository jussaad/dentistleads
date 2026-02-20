'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  city: string;
  state: string;
  status: string;
  revenue: number;
  created_at: string;
  updated_at: string;
}

export const useRealtimeLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();

    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchLeads(); // Refetch data on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeads]);

  return { leads, loading, error, refetch: fetchLeads };
};

export const useRealtimeEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const channel = supabase
      .channel('lead-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
        },
        (payload) => {
          const newLead = payload.new;
          const event = {
            id: newLead.id,
            name: newLead.name.split(' ')[0], // Just first name for brevity
            service: newLead.service,
            city: newLead.city,
            timestamp: new Date().toISOString(),
          };
          setEvents(prev => [event, ...prev.slice(0, 7)]); // Keep last 8 events
        }
      )
      .subscribe();

    // Initial fetch for recent events (optional, if you want to show some initial state)
    const fetchRecentEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('id, name, service, city, created_at')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Error fetching recent events:', error);
      } else {
        const formattedEvents = data.map(lead => ({
          id: lead.id,
          name: lead.name.split(' ')[0],
          service: lead.service,
          city: lead.city,
          timestamp: lead.created_at,
        }));
        setEvents(formattedEvents);
      }
      setLoading(false);
    };

    fetchRecentEvents();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { events, loading };
};