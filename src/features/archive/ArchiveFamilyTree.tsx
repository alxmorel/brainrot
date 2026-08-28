import Image from "next/image";
import Link from "next/link";
import { archiveCopy, getArchiveCharacter } from "@/data/archive";
import { familyTree } from "@/data/archive/familyTree";
import { cn } from "@/shared/utils/cn";

function nodeById(id: string) {
  return familyTree.nodes.find((node) => node.id === id);
}

function edgeLabel(from: string, to: string) {
  return familyTree.edges.find(
    (edge) =>
      (edge.from === from && edge.to === to) ||
      (edge.from === to && edge.to === from),
  )?.label;
}

function NodeCard({ id }: { id: string }) {
  const node = nodeById(id);
  if (!node) return null;
  const portrait = node.slug ? getArchiveCharacter(node.slug)?.image : undefined;
  const inner = (
    <span className="flex h-full w-full flex-col items-center rounded-2xl border-[3px] border-ink bg-white p-2 text-center shadow-sticker-sm">
      {portrait ? (
        <span className="relative mb-2 block aspect-square w-full overflow-hidden rounded-xl border-[3px] border-ink bg-white">
          <Image
            src={portrait}
            alt={node.name}
            fill
            sizes="160px"
            className="object-contain p-1"
          />
        </span>
      ) : (
        <span className="mb-2 flex aspect-square w-full items-center justify-center rounded-xl border-[3px] border-dashed border-ink/40 bg-cream font-display text-lg font-bold text-ink/35">
          ?
        </span>
      )}
      <span className="font-display text-[0.65rem] font-bold uppercase leading-tight tracking-[-0.03em] text-ink sm:text-xs">
        {node.name}
      </span>
    </span>
  );
  const className = "block w-full max-w-[9.5rem]";
  if (!node.slug) {
    return <span className={className}>{inner}</span>;
  }
  return (
    <Link href={`/brainrots/${node.slug}`} className={cn(className, "hover:[&>span]:bg-acid-yellow")}>
      {inner}
    </Link>
  );
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center" aria-hidden>
      <span className="h-3 w-[3px] bg-ink" />
      <span className="rounded-md border-2 border-ink bg-white px-1.5 py-0.5 font-display text-[0.55rem] font-bold uppercase leading-none tracking-wide text-hot-pink sm:text-[0.6rem]">
        {label}
      </span>
      <span className="h-3 w-[3px] bg-ink" />
    </div>
  );
}

function ChainCluster({ nodes }: { nodes: string[] }) {
  return (
    <div className="flex flex-col items-center">
      {nodes.map((id, index) => {
        const next = nodes[index + 1];
        const label = next ? edgeLabel(id, next) : undefined;
        return (
          <div key={id} className="flex w-full flex-col items-center">
            <NodeCard id={id} />
            {label ? <Connector label={label} /> : null}
          </div>
        );
      })}
    </div>
  );
}

function ForkCluster({ hub, childIds }: { hub: string; childIds: string[] }) {
  return (
    <div className="flex flex-col items-center">
      <NodeCard id={hub} />
      <span className="h-4 w-[3px] bg-ink" aria-hidden />
      <div className="relative w-full">
        <span
          className="absolute top-0 right-[16.67%] left-[16.67%] h-[3px] bg-ink"
          aria-hidden
        />
        <div className="grid grid-cols-3 items-start">
          {childIds.map((id) => {
            const label = edgeLabel(hub, id) ?? "";
            return (
              <div key={id} className="flex flex-col items-center">
                <Connector label={label} />
                <NodeCard id={id} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ArchiveFamilyTree() {
  return (
    <div>
      <p className="rounded-2xl border-[3px] border-ink bg-ultraviolet px-3 py-2 text-xs font-bold leading-relaxed text-white sm:text-sm">
        {familyTree.disclaimer}
      </p>

      <div className="mt-8 grid gap-10 sm:grid-cols-2 sm:gap-8">
        {familyTree.clusters.map((cluster) => (
          <section key={cluster.title}>
            <h3 className="mb-4 text-center font-display text-sm font-bold uppercase tracking-wide text-ink">
              {cluster.title}
            </h3>
            {cluster.kind === "chain" ? (
              <ChainCluster nodes={cluster.nodes} />
            ) : (
              <ForkCluster hub={cluster.hub} childIds={cluster.children} />
            )}
          </section>
        ))}
      </div>

      <ul className="sr-only">
        {familyTree.edges.map((edge) => {
          const from = nodeById(edge.from);
          const to = nodeById(edge.to);
          if (!from || !to) return null;
          return (
            <li key={`${edge.from}-${edge.to}-${edge.label}`}>
              {edge.label} : {from.name} → {to.name}
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs font-bold text-ink/50">{archiveCopy.familyTreeNote}</p>
    </div>
  );
}
