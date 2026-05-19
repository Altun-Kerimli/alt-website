import { enforceBouncer } from "@/proxy";
import { PortfolioManager } from "./components/PortfolioManager";

export default async function AdminPortfolioPage() {
  // Guard interceptor running entirely on server
  await enforceBouncer();

  return <PortfolioManager />;
}