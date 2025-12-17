/**
 * Theme-related type definitions
 */

export interface ZatiqTheme {
  id: string;
  version: string;
  global_settings: GlobalSettings;
  global_sections: GlobalSections;
  templates: Record<string, TemplateConfig>;
}

export interface GlobalSettings {
  colors: ThemeColors;
  fonts: ThemeFonts;
  border_radius: BorderRadiusConfig;
  component_styles?: Record<string, ComponentStyle>;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  error: string;
  success: string;
  warning?: string;
  info?: string;
  [key: string]: string | undefined;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  mono?: string;
}

export interface BorderRadiusConfig {
  none?: string;
  small: string;
  medium: string;
  large: string;
  full: string;
}

export interface ComponentStyle {
  [property: string]: string | number;
}

export interface GlobalSections {
  announcement?: GlobalSection;
  header?: GlobalSection;
  footer?: GlobalSection;
  announcementAfterHeader?: GlobalSection;
}

export interface GlobalSection {
  enabled: boolean;
  type: string;
  settings: SectionSettings;
  blocks: Block[];
}

export interface SectionSettings {
  [key: string]: string | number | boolean | null | undefined;
}

export interface Block {
  id?: string;
  wrapper?: string;
  type?: string;
  class?: string;
  style?: BlockStyle;
  data?: BlockData;
  blocks?: Block[];
  condition?: BlockCondition;
  events?: BlockEvents;
  content?: string;
  [key: string]: unknown;
}

export interface BlockStyle {
  backgroundColor?: string;
  color?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  [key: string]: string | number | undefined;
}

export interface BlockData {
  [key: string]: unknown;
}

export interface BlockCondition {
  field: string;
  op: ConditionOperator;
  value: unknown;
}

export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'not_empty'
  | 'empty'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'contains';

export interface BlockEvents {
  onClick?: BlockEvent;
  onHover?: BlockEvent;
  [key: string]: BlockEvent | undefined;
}

export interface BlockEvent {
  action: string;
  target: string;
  value?: unknown;
}

export interface TemplateConfig {
  name: string;
  layout: string;
  sections: string[];
  seo?: SEOConfig;
}

export interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  favicon?: string;
  og?: OpenGraphConfig;
  twitter?: TwitterConfig;
}

export interface OpenGraphConfig {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
}

export interface TwitterConfig {
  card?: 'summary' | 'summary_large_image';
  title?: string;
  description?: string;
  image?: string;
}
