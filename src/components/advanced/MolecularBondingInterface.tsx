"use client";
import React, { useMemo } from "react";

import { cn } from "@/lib/utils";
import { OptimizedGlass } from "@/primitives";

export interface MolecularBond {
  id: string;
  from: string;
  to: string;
  strength: number;
  type?: "ionic" | "covalent" | "hydrogen" | "van-der-waals";
  resonance?: number;
}

export interface MoleculeNode {
  id: string;
  symbol: string;
  name: string;
  charge?: number;
  valence?: number;
  electronegativity?: number;
}

export interface MolecularBondingInterfaceProps {
  className?: string;
  molecules?: MoleculeNode[];
  bonds?: MolecularBond[];
  onInspectBond?: (bond: MolecularBond) => void;
}

const DEFAULT_MOLECULES: MoleculeNode[] = [
  { id: "c", symbol: "C", name: "Carbon", valence: 4, electronegativity: 2.55 },
  { id: "o", symbol: "O", name: "Oxygen", valence: 2, electronegativity: 3.44 },
  {
    id: "h1",
    symbol: "H",
    name: "Hydrogen",
    valence: 1,
    electronegativity: 2.2,
  },
  {
    id: "h2",
    symbol: "H",
    name: "Hydrogen",
    valence: 1,
    electronegativity: 2.2,
  },
];

const DEFAULT_BONDS: MolecularBond[] = [
  {
    id: "c-o",
    from: "c",
    to: "o",
    strength: 0.82,
    type: "covalent",
    resonance: 0.4,
  },
  { id: "c-h1", from: "c", to: "h1", strength: 0.61, type: "covalent" },
  { id: "c-h2", from: "c", to: "h2", strength: 0.63, type: "covalent" },
];

const bondColors: Record<Required<MolecularBond>["type"], string> = {
  ionic: "from-blue-500/70 to-sky-500/40",
  covalent: "from-purple-500/70 to-fuchsia-500/40",
  hydrogen: "from-emerald-400/70 to-teal-500/30",
  "van-der-waals": "from-amber-400/70 to-orange-400/40",
};

export function MolecularBondingInterface({
  className,
  molecules = DEFAULT_MOLECULES,
  bonds = DEFAULT_BONDS,
  onInspectBond,
}: MolecularBondingInterfaceProps) {
  const moleculeMap = useMemo(() => {
    const dictionary = new Map<string, MoleculeNode>();
    molecules.forEach((molecule) => {
      dictionary.set(molecule.id, molecule);
    });
    return dictionary;
  }, [molecules]);

  return (
    <OptimizedGlass
      role="group"
      aria-label="Molecular bonding interface"
      className={cn(
        "glass-radius-3xl glass-border glass-border-soft glass-p-6 space-y-6",
        "bg-gradient-to-br from-white/10 via-white/5 to-white/8",
        className
      )}
    >
      <header className="glass-space-y-1">
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">
          Molecular Bonding Interface
        </h2>
        <p className="glass-text-sm glass-text-primary-opacity-70">
          Visualize complex bonding interactions with electronegativity and
          resonance indicators.
        </p>
      </header>

      <div className="glass-grid glass-gap-4 md:glass-grid-cols-[minmax(0,240px)_1fr]">
        <section className="glass-radius-2xl glass-border glass-border-white/10 glass-surface-subtle/5 glass-p-4 glass-backdrop-blur">
          <h3 className="glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-80 glass-uppercase glass-tracking-wide">
            Molecules
          </h3>
          <ul className="glass-mt-3 glass-space-y-3 glass-text-sm">
            {molecules.map((molecule) => (
              <li
                key={molecule.id}
                className="glass-flex glass-items-center glass-justify-between glass-radius-xl glass-border glass-border-white/10 glass-px-3 glass-py-2 glass-text-primary-opacity-85"
              >
                <div className="glass-flex glass-items-center glass-gap-3">
                  <span className="glass-flex glass-h-9 glass-w-9 glass-items-center glass-justify-center glass-radius-full glass-surface-subtle/10 glass-text-base glass-font-semibold">
                    {molecule.symbol}
                  </span>
                  <span>
                    <div className="glass-font-medium glass-text-primary">
                      {molecule.name}
                    </div>
                    <div className="glass-text-xs glass-text-primary-glass-opacity-60">
                      Valence: {molecule.valence ?? "—"} | EN:{" "}
                      {molecule.electronegativity?.toFixed(2) ?? "—"}
                    </div>
                  </span>
                </div>
                {typeof molecule.charge === "number" && (
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      molecule.charge >= 0
                        ? "text-emerald-300"
                        : "text-rose-300"
                    )}
                  >
                    {molecule.charge >= 0
                      ? `+${molecule.charge}`
                      : molecule.charge}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-radius-2xl glass-border glass-border-white/10 glass-surface-subtle/5 glass-p-4 glass-backdrop-blur">
          <h3 className="glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-80 glass-uppercase glass-tracking-wide">
            Bond Network
          </h3>
          <div className="glass-mt-4 glass-grid glass-gap-3 glass-text-sm">
            {bonds.map((bond) => {
              const source = moleculeMap.get(bond.from);
              const target = moleculeMap.get(bond.to);
              if (!source || !target) return null;

              const gradient = bond.type
                ? bondColors[bond.type]
                : "from-slate-500/60 to-slate-700/30";
              return (
                <button
                  key={bond.id}
                  type="button"
                  onClick={() => onInspectBond?.(bond)}
                  className={cn(
                    "w-full rounded-2xl border border-white/10 px-4 py-3 text-left transition hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 glass-focus glass-touch-target glass-contrast-guard",
                    "bg-gradient-to-r",
                    gradient
                  )}
                >
                  <div className="glass-flex glass-items-center glass-justify-between glass-gap-4 glass-text-primary">
                    <div className="glass-flex glass-items-center glass-gap-2 glass-text-sm">
                      <span className="glass-font-semibold">
                        {source.symbol}
                      </span>
                      <span className="glass-text-primary-glass-opacity-60">
                        ⇄
                      </span>
                      <span className="glass-font-semibold">
                        {target.symbol}
                      </span>
                    </div>
                    <span className="glass-text-xs glass-uppercase glass-tracking-wide glass-text-primary-glass-opacity-80">
                      {bond.type ?? "unknown"}
                    </span>
                  </div>

                  <div className="glass-mt-3 glass-grid glass-gap-2 glass-text-xs glass-text-primary-glass-opacity-80 sm:glass-grid-cols-2">
                    <div className="glass-flex glass-items-center glass-justify-between">
                      <span>Strength Index</span>
                      <span className="glass-font-semibold glass-text-primary">
                        {(bond.strength * 100).toFixed(0)}%
                      </span>
                    </div>
                    {typeof bond.resonance === "number" && (
                      <div className="glass-flex glass-items-center glass-justify-between">
                        <span>Resonance</span>
                        <span className="glass-font-semibold glass-text-primary-glass-opacity-90">
                          {(bond.resonance * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </OptimizedGlass>
  );
}

export default MolecularBondingInterface;
