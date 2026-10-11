import 'aura-glass/styles';
import { AuroraBackground, DisplayText, FeatureTile, GlassButton, InstallCommand, LogoMark, ShowcaseCard } from 'aura-glass';

const features = [
  ['App UI', 'Production shell, workflow, and data surfaces for real product screens.'],
  ['Theme presets', 'Documented density, motion, and contrast policy starters.'],
  ['Safe AI recipes', 'Provider-unconfigured UI states before hosted credentials are wired.'],
];

export function MarketingLaunchKit() {
  return (
    <main className="ag-marketing-launch-kit glass-min-h-screen glass-text-primary">
      <section className="glass-relative glass-overflow-hidden glass-p-8 md:glass-p-12">
        <AuroraBackground className="ag-aurora-background--light" particles={12} grain vignette reducedMotion seed="auraglass-33-launch" />
        <div className="glass-relative glass-mx-auto glass-grid glass-max-w-6xl glass-gap-8">
          <LogoMark label="AuraGlass" animated={false} />
          <DisplayText as="h1" size="hero" gradient="aurora" balance>
            AuraGlass 3.3 launch kit
          </DisplayText>
          <p className="glass-max-w-2xl glass-text-lg glass-text-secondary">
            Build launch pages that pair premium Liquid Glass marketing surfaces with production package evidence.
          </p>
          <div className="glass-flex glass-flex-wrap glass-gap-3">
            <GlassButton variant="aurora">Start building</GlassButton>
            <InstallCommand packageManager="npm" />
          </div>
          <div className="glass-grid glass-gap-4 md:glass-grid-cols-3">
            {features.map(([title, description], index) => (
              <FeatureTile key={title} index={index + 1} title={title} description={description} tone="aurora" />
            ))}
          </div>
          <ShowcaseCard intensity="strong" glow="aurora" floating={false}>
            <h2>Launch proof</h2>
            <p>Link visual baselines, recipe render evidence, changelog notes, and accessibility signoff before publishing.</p>
          </ShowcaseCard>
        </div>
      </section>
    </main>
  );
}
