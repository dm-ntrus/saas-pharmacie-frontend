export type ModuleIconKey =
  | "LayoutDashboard"
  | "ShoppingCart"
  | "Package"
  | "Users"
  | "FileText"
  | "Syringe"
  | "Snowflake"
  | "FlaskConical"
  | "Video"
  | "Link2"
  | "Bot"
  | "Plug"
  | "Tags"
  | "Undo2"
  | "BadgeDollarSign"
  | "Truck"
  | "Receipt"
  | "Wallet"
  | "BookOpen"
  | "Building2"
  | "GitBranch"
  | "ShieldCheck"
  | "Handshake"
  | "Sheet"
  | "UserCog"
  | "BarChart3"
  | "Bell"
  | "PieChart"
  | "Gift"
  | "ScrollText"
  | "Settings";

export type PlatformModule = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  outcomes: string[];
  icon: ModuleIconKey;
  planNote?: string;
};

export type ModuleCategory = {
  id: string;
  label: string;
  intro: string;
  modules: PlatformModule[];
};
