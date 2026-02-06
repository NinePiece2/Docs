import { z } from "zod";
import { trackEvent as umamiTrackEvent } from "./umami";

const eventSchema = z.object({
  name: z.enum([
    "copy_npm_command",
    "copy_usage_import_code",
    "copy_usage_code",
    "copy_primitive_code",
    "copy_theme_code",
    "copy_block_code",
    "copy_chunk_code",
    "enable_lift_mode",
    "copy_chart_code",
    "copy_chart_theme",
    "copy_chart_data",
    "copy_color",
    "set_layout",
    "search_query",
    "create_app",
    "copy_create_share_url",
    "copy_registry_add_command",
  ]),
  // declare type AllowedPropertyValues = string | number | boolean | null
  properties: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()]),
    )
    .optional(),
});

export type Event = z.infer<typeof eventSchema>;

// can add analytics provider here
export function trackEvent(input: Event): void {
  try {
    const event = eventSchema.parse(input);
    umamiTrackEvent(event.name, event.properties);
  } catch (error) {
    console.error("✗ Event validation failed:", error);
  }
}
