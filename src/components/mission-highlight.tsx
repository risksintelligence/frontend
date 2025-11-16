import { currentMission } from '../lib/mission';

interface Props {
  title?: string;
  description?: string;
}

export default function MissionHighlight({ title, description }: Props) {
  const mission = {
    title: title ?? currentMission.title,
    description: description ?? currentMission.description,
  };
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <h3 className="text-sm uppercase text-[#64748b]">Sector Mission</h3>
      <p className="text-lg font-bold">{mission.title}</p>
      <p className="text-sm text-[#475569]">{mission.description}</p>
      <a href={currentMission.link} className="mt-2 inline-block text-xs text-[#2563eb]" target="_blank" rel="noreferrer">
        View Mission Charter
      </a>
    </div>
  );
}
