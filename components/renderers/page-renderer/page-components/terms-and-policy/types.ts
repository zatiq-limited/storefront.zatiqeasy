export interface TermsHeroSettings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  image?: string;
  lastUpdated?: string;
  showBreadcrumb?: boolean;
}

export interface TermsContentSettings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  contentSections?: string; // JSON string of content sections
}

export interface ContentSection {
  title: string;
  content: string;
}
