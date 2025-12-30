export interface PrivacyHero1Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  image?: string;
  lastUpdated?: string;
  showBreadcrumb?: boolean;
}

export interface PrivacyHero2Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  lastUpdated?: string;
  accentColor?: string;
  showBreadcrumb?: boolean;
}

export interface PrivacyContent1Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  contentSections?: string; // JSON string of content sections
}

export interface PrivacyContent2Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  expandAllByDefault?: boolean;
  contentSections?: string; // JSON string of content sections
}