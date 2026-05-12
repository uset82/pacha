import { NextResponse } from "next/server";
import { callModel, tool } from "@openrouter/agent";
import { OpenRouter } from "@openrouter/sdk";
import { z } from "zod";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { formatNok } from "@/lib/format";
import { getMenuItems } from "@/lib/data/menu";
import { getSiteSettings } from "@/lib/data/settings";
import { siteDetails } from "@/lib/site";

const getOpeningHoursTool = tool({
  name: "getOpeningHours",
  description: "Get the current opening hours and location for Pasha International Food & Bar.",
  inputSchema: z.object({}),
  execute: async () => {
    const settings = await getSiteSettings();

    return {
      hours: settings.opening_hours,
      location: siteDetails.location,
      phone: siteDetails.phone,
    };
  },
});

const getMenuPricesTool = tool({
  name: "getMenuPrices",
  description: "Queries the live CMS menu to get current dish details, categories, and prices.",
  inputSchema: z.object({
    query: z.string().describe("The dish name, category, or keyword to search for. Use an empty string for all active dishes."),
  }),
  execute: async ({ query }) => {
    const normalizedQuery = query.trim().toLowerCase();
    const menuItems = await getMenuItems();
    const results = menuItems
      .filter((item) => {
        if (!normalizedQuery) {
          return true;
        }

        return [item.name, item.description, item.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .map((item) => ({
        name: item.name,
        category: item.category,
        description: item.description,
        price: formatNok(item.price_nok),
      }));

    return {
      results,
      message: results.length === 0 ? "No matching active menu items were found." : undefined,
    };
  },
});

const bookReservationTool = tool({
  name: "bookReservation",
  description: "Creates a requested table reservation. Ask for all required fields before using this tool.",
  inputSchema: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    date: z.string().describe("Reservation date in YYYY-MM-DD format."),
    time: z.string().describe("Reservation time in HH:MM format."),
    party_size: z.number().int().min(1).max(20),
    message: z.string().optional(),
  }),
  execute: async ({ name, email, phone, date, time, party_size, message }) => {
    const supabase = createSupabasePublicClient();

    if (!supabase) {
      return {
        success: false,
        error: "The booking system is not configured yet. Please call Pasha directly to reserve.",
        phone: siteDetails.phone,
      };
    }

    const { error } = await supabase.from("reservations").insert({
      name,
      email,
      phone,
      reservation_date: date,
      reservation_time: time,
      party_size,
      message: message || "Requested through Pasha Concierge chat.",
      status: "requested",
    });

    if (error) {
      console.error("Supabase reservation error:", error.message);
      return {
        success: false,
        error: "The booking request could not be saved. Please call Pasha directly to reserve.",
        phone: siteDetails.phone,
      };
    }

    return {
      success: true,
      message: `Reservation requested for ${party_size} people on ${date} at ${time}. Pasha will confirm the table soon.`,
    };
  },
});

const fileComplaintTool = tool({
  name: "fileComplaint",
  description: "Files customer feedback or a complaint for the owner to review.",
  inputSchema: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(5),
  }),
  execute: async ({ name, email, message }) => {
    const supabase = createSupabasePublicClient();

    if (!supabase) {
      return {
        success: false,
        error: "Feedback storage is not configured yet. Please contact Pasha by email.",
        email: siteDetails.email,
      };
    }

    const { error } = await supabase.from("complaints").insert({
      name,
      email,
      message,
      status: "requested",
    });

    if (error) {
      console.error("Supabase complaint error:", error.message);
      return {
        success: false,
        error: "The feedback could not be saved. Please contact Pasha by email.",
        email: siteDetails.email,
      };
    }

    return {
      success: true,
      message: "Your feedback has been sent to the Pasha team for review.",
    };
  },
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const systemMessage = {
      role: "system",
      content: `You are the polite and helpful AI concierge for Pasha International Food & Bar in Bergen, Norway.
Use the live tools for menu prices, opening hours, reservations, and feedback instead of guessing.
When booking a table, collect name, email, phone, date, time, and party size first.
Keep replies warm, concise, and practical.`,
    };
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API;

    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key is not configured." }, { status: 500 });
    }

    const client = new OpenRouter({ apiKey });
    const result = await callModel(client, {
      model: "openai/gpt-4o-mini",
      input: [systemMessage, ...messages],
      tools: [getOpeningHoursTool, getMenuPricesTool, bookReservationTool, fileComplaintTool] as const,
    });
    const text = await result.getText();

    return NextResponse.json({
      role: "assistant",
      content: text,
    });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown chat API error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
