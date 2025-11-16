import { Driver } from '../lib/api';

interface Props {
  drivers: Driver[] | undefined;
}

export default function ComponentGrid({ drivers }: Props) {
  if (!drivers) return null;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-[#64748b]">
          <th className="text-left">Component</th>
          <th className="text-right">Contribution</th>
        </tr>
      </thead>
      <tbody>
        {drivers.map((driver) => (
          <tr key={driver.component} className="border-t border-[#e2e8f0]">
            <td>{driver.component}</td>
            <td className="text-right">{driver.contribution}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
