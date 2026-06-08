import BillingSection from '@/components/billing-section';

export default function BillingPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      <div className="container mx-auto px-4">
        <BillingSection />
      </div>
    </main>
  );
}