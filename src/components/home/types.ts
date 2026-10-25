// src/data/site.json içindeki home.sections kayıtlarının tipi.
export type HomeCta = {
  label: string;
  href: string;
};

export type HomeItem = {
  icon?: string;
  title: string;
  text?: string;
  href?: string;
};

export type HomeSectionKind =
  | "hero"
  | "text"
  | "steps"
  | "cards"
  | "other"
  | "list"
  | "contact";

export type HomeSection = {
  id: string;
  kind: HomeSectionKind;
  title: string;
  subtitle?: string;
  paragraphs?: string[];
  items?: HomeItem[];
  note?: string;
  itemLinkLabel?: string;
  ctas?: HomeCta[];
};
