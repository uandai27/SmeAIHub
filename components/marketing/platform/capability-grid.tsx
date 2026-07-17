import { CapabilityCard } from "./capability-card";
import { platformCapabilities } from "./platform-data";

export function CapabilityGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {platformCapabilities.map((capability) => (
        <CapabilityCard
          key={capability.title}
          title={capability.title}
          description={capability.description}
          icon={capability.icon}
        />
      ))}
    </div>
  );
}