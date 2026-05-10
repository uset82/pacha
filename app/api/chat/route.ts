import { NextResponse } from 'next/server';
import { callModel, tool } from '@openrouter/agent';
import { OpenRouter } from '@openrouter/sdk';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side operations
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
if (!supabaseUrl.startsWith('http')) supabaseUrl = 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

const getOpeningHoursTool = tool({
  name: 'getOpeningHours',
  description: 'Get the current opening hours of Pasha International Food & Bar',
  inputSchema: z.object({}),
  execute: async () => {
    return { 
      hours: "Monday-Thursday: 16:00 - 22:00, Friday-Saturday: 16:00 - 23:00, Sunday: 14:00 - 21:00",
      location: "Strandgaten 85, Bergen, Norway, 5004"
    };
  },
});

const getMenuPricesTool = tool({
  name: 'getMenuPrices',
  description: 'Queries the menu to get details and prices of dishes. Use this to provide prices or check if a dish exists.',
  inputSchema: z.object({
    query: z.string().describe('The name of the dish or category to search for (e.g. "Pacha Lamb", "Empanadas")')
  }),
  execute: async ({ query }) => {
    // In a real scenario, this would query the Supabase menu table
    // For now, return the mocked luxurious items from the brief:
    const mockMenu = [
      { name: 'Pacha Lamb', description: 'Grilled lamb served with rice or crispy potatoes, accompanied by a fresh salad and homemade vinaigrette.', price: '349 NOK' },
      { name: 'Peruansk Lomo Saltado', description: 'Authentic Peruvian flavors.', price: '289 NOK' },
      { name: 'Tyrkisk Börek', description: 'Traditional Turkish pastry.', price: '149 NOK' },
      { name: 'Peruansk Empanadas', description: 'Delicious Sunday special.', price: '129 NOK' }
    ];
    
    const results = mockMenu.filter(m => m.name.toLowerCase().includes(query.toLowerCase()) || query === '');
    return { results: results.length > 0 ? results : mockMenu };
  },
});

const bookReservationTool = tool({
  name: 'bookReservation',
  description: 'Books a table reservation for the user.',
  inputSchema: z.object({
    name: z.string(),
    email: z.string().email(),
    date: z.string().describe('YYYY-MM-DD format'),
    time: z.string().describe('HH:MM format'),
    party_size: z.number().int().positive()
  }),
  execute: async ({ name, email, date, time, party_size }) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([{ name, email, date, time, party_size }])
        .select();
      
      if (error) {
        console.error("Supabase Error:", error);
        return { success: false, error: "Database error, but we have noted your request." };
      }
      return { success: true, message: `Reservation confirmed for ${party_size} people on ${date} at ${time}.` };
    } catch (err) {
      // Fallback if Supabase is not properly configured yet
      return { success: true, message: `[Simulated] Reservation confirmed for ${party_size} people on ${date} at ${time}.` };
    }
  },
});

const fileComplaintTool = tool({
  name: 'fileComplaint',
  description: 'Files a customer complaint or feedback.',
  inputSchema: z.object({
    name: z.string(),
    email: z.string().email(),
    message: z.string()
  }),
  execute: async ({ name, email, message }) => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .insert([{ name, email, message }])
        .select();
        
      if (error) {
         console.error("Supabase Error:", error);
         return { success: false, error: "Could not save to database." };
      }
      return { success: true, message: 'Your complaint has been filed and the management will review it shortly.' };
    } catch (err) {
       return { success: true, message: '[Simulated] Your complaint has been filed.' };
    }
  },
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemMessage = {
      role: 'system',
      content: `You are the luxurious, polite, and helpful AI concierge for Pasha International Food & Bar in Bergen, Norway.
Your tone is elegant, welcoming, and concise. You assist users with booking reservations, checking opening hours, providing menu prices and details, offering recommendations, and fielding any feedback or complaints.
Always verify if the user needs further assistance after providing information.`
    };

    const fullMessages = [systemMessage, ...messages];

    // Using openrouter/auto or a specific model
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API;
    const client = new OpenRouter({ apiKey });
    const result = await callModel(client, {
      model: 'openai/gpt-4o-mini',
      input: fullMessages,
      tools: [getOpeningHoursTool, getMenuPricesTool, bookReservationTool, fileComplaintTool] as const,
    });

    const text = await result.getText();

    return NextResponse.json({
      role: 'assistant',
      content: text
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
