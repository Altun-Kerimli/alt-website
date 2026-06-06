import { enforceBouncer } from "@/proxy";
import { PortfolioManager } from "./components/PortfolioManager";

export default async function AdminPortfolioPage() {
  await enforceBouncer();
  return <PortfolioManager />;
}