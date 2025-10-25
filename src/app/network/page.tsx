'use client'

import NetworkOverview from '@/components/network/NetworkOverview'

export default function NetworkOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading">Network Analysis</h1>
        <p className="text-secondary mt-2">
          Comprehensive systemic risk topology and network dependency analysis
        </p>
      </div>

      <NetworkOverview />
    </div>
  )
}