import { HomeCampaign } from "@/features/home/HomeCampaign";
import { getBestSellerBrainrots } from "@/server/bestsellers";

export const revalidate = 3600;

export default async function HomePage() {
  const bestsellers = await getBestSellerBrainrots();
  return <HomeCampaign bestsellers={bestsellers} />;
}
