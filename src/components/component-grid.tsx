import { Driver } from '../lib/api';
import { semanticColors } from '../lib/theme';

interface Props {
  drivers: Driver[] | undefined;
}

const componentTypeMap: Record<string, 'financial' | 'supply'> = {
  'Credit Spreads': 'financial',
  'Yield Curve': 'financial', 
  'VIX': 'financial',
  'Currency': 'financial',
  'Supply Chain': 'supply',
  'Commodity Prices': 'supply',
  'Energy': 'supply',
  'Transport': 'supply'
};

export default function ComponentGrid({ drivers }: Props) {
  if (!drivers) return null;
  
  const financialDrivers = drivers.filter(d => componentTypeMap[d.component] === 'financial');
  const supplyDrivers = drivers.filter(d => componentTypeMap[d.component] === 'supply');
  
  const renderGroup = (title: string, items: Driver[], color: string) => (
    <div className="mb-4">
      <h4 className="text-xs uppercase font-semibold mb-2" style={{ color }}>{title}</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[#64748b] text-xs">
            <th className="text-left">Component</th>
            <th className="text-right">Impact</th>
            <th className="text-right">Z-Score</th>
            <th className="text-right">Conf.</th>
          </tr>
        </thead>
        <tbody>
          {items.map((driver) => (
            <tr key={driver.component} className="border-t border-[#e2e8f0]">
              <td>{driver.component}</td>
              <td className="text-right" style={{ color }}>
                {driver.impact > 0 ? '+' : ''}{driver.impact?.toFixed(1)}bp
              </td>
              <td className="text-right text-xs text-[#475569]">
                {driver.z_score ? `${driver.z_score.toFixed(1)}σ` : '--'}
              </td>
              <td className="text-right text-xs text-[#64748b]">
                {driver.confidence ? `${(driver.confidence * 100).toFixed(0)}%` : '--'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-[#94a3b8]">
        Impact measured in basis points | Z-scores vs 5-year rolling window | 
        ML confidence from GERI v1 methodology
      </p>
    </div>
  );

  return (
    <div>
      {financialDrivers.length > 0 && renderGroup('Financial Stress', financialDrivers, semanticColors.financialStress)}
      {supplyDrivers.length > 0 && renderGroup('Supply Chain', supplyDrivers, semanticColors.supplyChainStress)}
    </div>
  );
}
