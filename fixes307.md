  You are working on the AuraGlass package and its website integration.

  Package repo:
    /Users/gurbakshchahal/AuraGlass

  Website repo:
    /Users/gurbakshchahal/auraglasswebsite

  Current date:
    2026-05-12

  Primary goal:
    Finish and ship aura-glass@3.0.7 for real. Do not stop at local website fixes. The npm package must be release-ready, verified, documented, and published only after the package and website gates pass.

  Important context:
    The public npm latest is currently 3.0.6.
    The local package repo is already versioned as 3.0.7.
    The website currently installs a local tarball:
      file:../AuraGlass/aura-glass-3.0.7.tgz

    The package GitHub metadata has already been moved to:
      https://github.com/auraoneai/auraglass

    Verify package metadata remains:
      repository: git+https://github.com/auraoneai/auraglass.git
      bugs: https://github.com/auraoneai/auraglass/issues

  Do not treat the website as the source of truth.
  The website is only the proof surface. If a real AuraGlass component is static, clipped, broken, unreadable, or requires fake CSS/SVG to look right, fix the AuraGlass package first. The website may use real package props and real package preview/demo modes, but must not replace real components with hand-rolled mock HTML/CSS.

  Hard rules:
    - Do not publish 3.0.7 until all release gates pass.
    - Do not claim 3.0.7 is shipped unless `npm view aura-glass version` returns 3.0.7 after publish.
    - Do not hide broken previews behind static overlays or fake SVG/CSS animations.
    - Do not leave website-only duct tape where a package API should exist.
    - Do not remove user changes or reset the worktree.
    - Preserve unrelated dirty files.
    - Use package-owned APIs for catalog previews.
    - If a component still cannot work in the browser, document the exact limitation and add an explicit release-blocker or accepted limitation, not a silent exemption.

  Current known verified state:
    Package:
      - `npm run typecheck -- --pretty false` passed before the latest interruption.
      - `npm run build` passed before the latest interruption.
      - `npm pack --silent` produced `aura-glass-3.0.7.tgz`.

    Website:
      - Installed local tarball `aura-glass-3.0.7.tgz`.
      - `npm run typecheck -- --pretty false` passed before the latest interruption.
      - `npm run build` passed before the latest interruption.
      - Local prod server was running on:
          http://localhost:3021

    Public npm:
      - `npm view aura-glass version` returned `3.0.6`.
      - Therefore 3.0.7 has NOT been published.

  Current package-level fixes already started:
    - GlassParticles:
        Added compact/contained/preview sizing props.
        Fixed `respectMotionPreference={false}` being ignored.
        Real canvas motion detected in catalog.

    - GlassParticleField:
        Fixed reduced-motion override behavior.
        Real motion detected in catalog.

    - GlassMeshGradient:
        Added compact/contained/preview sizing props.
        Added `respectMotionPreference`.
        Still failing latest motion sweep.

    - GlassWebGLShader:
        Added compact/contained/preview sizing props.
        Added `renderMode="css"` fallback.
        Added package-owned fallback animation.
        Still failing latest motion sweep because visible pixel movement is too subtle.

    - Glass3DEngine:
        Added `autoDemo`.
        Added reduced-motion override.
        Motion detected in catalog.

    - GlassPhysicsEngine:
        Added `autoRepeat`.
        Added reduced-motion override.
        Motion detected in catalog.

    - GlassMoodRing:
        Fixed inverted reduced-motion logic.
        Added working pulse path in catalog preview.
        Motion detected in catalog.

    - GlassSpotlight:
        Added contained/preview/demoMotion behavior.
        Added reduced-motion override.
        Still failing latest sweep by a tiny margin because visible movement is too subtle.

    - GlassAnimated:
        Added continuous package-owned loop behavior for `repeat: Infinity`.
        Motion detected in catalog.

  Latest focused motion sweep result:
    Script:
      /Users/gurbakshchahal/auraglasswebsite/scripts/audit/motion-sweep-307.ts

    Latest completed result:
      /Users/gurbakshchahal/auraglasswebsite/reports/website-3.0.7-motion/motion-sweep.json

    Latest run:
      ranAt: 2026-05-12T10:10:59.511Z
      passed: false

    Passed:
      - glass-animated
      - glass-animation-sequence
      - glass-transitions
      - glass-particles
      - glass-particle-field
      - glass-liquid-transition
      - glass-3d-engine
      - glass-physics-engine
      - glass-mood-ring
      - dynamic-atmosphere
      - glass-carousel

    Still failing:
      - glass-mesh-gradient
          changedRatio: 0
          page: 12
          reason: motion-static

      - glass-webgl-shader
          changedRatio: 0.0016605842939620382
          page: 12
          reason: motion-static
          Note: computed styles showed package animation names were present, but visual pixel delta was below threshold. Increase visible movement/contrast in the package fallback, do not overlay fake website visuals.

      - glass-spotlight
          changedRatio: 0.0022881306841221107
          page: 13
          reason: motion-static
          Note: threshold is 0.0025. It is barely failing. Increase package-owned demo motion amplitude/visible effect.

  Known audit script defect:
    `motion-sweep-307.ts` currently reports:
      discoveredPages: 30
      cardCount: 435

    That is wrong. The script is walking repeated/fallback pages past the actual catalog pagination. Fix this before using it as release evidence.

    Correct behavior:
      - Discover the actual components page count from the UI, route data, registry, or repeated-page detection.
      - Do not count repeated pages as unique pages.
      - The report must include real page count, total rendered card count, and missing target IDs.
      - It must fail if any target motion component is missing.
      - It must fail if any motion target is visually static.
      - It must save before/after screenshots for each tested motion target.

  User-reported website/catalog visual issues that must be rechecked before shipping:
    These may already be fixed in previous work, but do not assume. Recheck visually and via probes:
      - Buttons showing gray/white outline/border junk or background bleed.
      - Hero/button backgrounds showing unwanted blobs/dirty outlines.
      - Form controls switch click targets misaligned or truncated.
      - GlassInput in homepage form controls not flowing correctly.
      - Feedback overlays too rough / unpolished.
      - Black text on dark glass where text should be white.
      - GlassSparkline truncated before percentages.
      - GlassChart truncated in half.
      - GlassNavigationMenu outer background/outline issue.
      - GlassScrollArea unwanted outlines.
      - GlassFractalLayout overlaying on itself.
      - GlassTessellation black fill.
      - GlassFormTemplate too large/truncated.
      - Page 12 heavy/slow scroll.
      - GlassChat truncated.
      - CollaborativeGlassWorkspace too heavy/dark.
      - GlassMeshGradient blank/static.
      - GlassLiquidTransition static/blank.
      - GlassParticles static/blank.
      - AtmosphericBackground/ParticleBackground blank/static.
      - SpeedDial truncated.
      - GlassWebGLShader too static/subtle.
      - Glass3DEngine visual quality and no debug text leak.
      - GlassSpotlight too subtle/static.
      - ContrastGuard text/contrast correctness.
      - GlassDashboard featured preview truncation.
      - RippleButton gray outline.
      - GlassWizard / GlassWizardTemplate truncated.
      - GlassMetricsGrid truncated.
      - GlassActivityFeed truncated.
      - GlassCalendar clipping.
      - GlassNotificationCenter too empty.
      - DimensionalDashboardContainer too empty.
      - GlassReactionBubbles too faint.
      - GlassCommand layered/overlapping.
      - GlassParticleField overlay/controls quality.
      - GlassGanttChart truncation.
      - GlassDropdownMenuSub visual placement.
      - GlassAdvancedSearch input outline/placement.
      - GlassMagneticCursor should visibly move/interact; no browser extension artifacts should appear in screenshots.

  Also check old-name cleanup:
    The package used to be GalileoGlass and now is AuraGlass.
    The chart plugin currently appears as:
      GalileoElementInteractionPlugin
    Determine whether it should be renamed or aliased to:
      AuraElementInteractionPlugin

    Required behavior:
      - Keep backwards compatibility if possible:
          export GalileoElementInteractionPlugin as deprecated alias
          export AuraElementInteractionPlugin as canonical new name
      - Update docs so new docs use AuraElementInteractionPlugin.
      - Existing Galileo docs may redirect or note deprecation.
      - Ensure package exports/tests cover the new name.
      - Ensure website/catalog does not show Galileo as the primary name unless explicitly listed as deprecated compatibility.

  Also update org ownership docs:
    Replace old repository references where appropriate with:
      https://github.com/auraoneai/auraglass
    Update npm/readme/docs metadata where applicable.
    Verify:
      package.json repository/bugs/homepage if present
      README
      docs
      changelog
      generated docs/readme inventory if present
      llms.txt if present

  Required work plan:

  Phase 1: Stabilize remaining package motion blockers
    1. Work in `/Users/gurbakshchahal/AuraGlass`.
    2. Fix `GlassMeshGradient` so it visibly animates under headless Chromium and real browsers.
       - Do not rely on website overlays.
       - Prefer package-owned animation loop or CSS fallback that visibly changes pixels.
       - Ensure `respectMotionPreference={false}` really overrides reduced motion.
       - Ensure compact/contained preview mode has stable dimensions.
    3. Fix `GlassWebGLShader` CSS fallback so visible motion is strong enough for audit and user inspection.
       - Existing computed styles may animate, but visual delta is too low.
       - Increase movement, opacity change, gradient/color shift, or moving highlight in package fallback.
       - Do not add decorative website overlay to fake it.
    4. Fix `GlassSpotlight` contained demo motion so it clearly moves.
       - Increase package-owned demoMotion amplitude/visible contrast.
       - Ensure `respectMotionPreference={false}` works.
    5. Re-run package typecheck after each meaningful set of edits:
         npm run typecheck -- --pretty false
    6. Add/update package tests where possible for new props/API:
         - GlassMeshGradient compact/respectMotionPreference props
         - GlassWebGLShader renderMode/contained fallback props
         - GlassSpotlight contained demoMotion respectMotionPreference
         - GlassPhysicsEngine autoRepeat/respectMotionPreference
         - GlassMoodRing respectMotionPreference fix
         - GlassAnimated repeat Infinity loop path
       Do not overfit tests to implementation details; at minimum assert props compile/render and no React unknown-prop leakage.

  Phase 2: Fix motion sweep evidence
    1. Work in `/Users/gurbakshchahal/auraglasswebsite`.
    2. Fix:
         scripts/audit/motion-sweep-307.ts
    3. The script must:
         - Determine true page count.
         - Avoid repeated/fallback pages.
         - Report total unique cards.
         - Report route/page for each motion target.
         - Fail if a target is missing.
         - Fail if changedRatio is below threshold.
         - Save before/after screenshots for every target.
         - Write:
             reports/website-3.0.7-motion/motion-sweep.json
             reports/website-3.0.7-motion/*.png
    4. Use a threshold that catches visibly static cards but does not fail tiny antialias-only changes. Current threshold is 0.0025; keep or justify any change in the report.

  Phase 3: Repack and reinstall
    In `/Users/gurbakshchahal/AuraGlass`:
      npm run typecheck -- --pretty false
      npm run build
      npm pack --silent

    In `/Users/gurbakshchahal/auraglasswebsite`:
      npm install /Users/gurbakshchahal/AuraGlass/aura-glass-3.0.7.tgz --legacy-peer-deps --no-audit --no-fund --force
      node -e "const p=require('./node_modules/aura-glass/package.json'); console.log(p.version, p.repository, p.bugs)"

    Expected:
      version: 3.0.7
      repository: github.com/auraoneai/auraglass
      bugs: github.com/auraoneai/auraglass/issues

  Phase 4: Website compile and local prod run
    In `/Users/gurbakshchahal/auraglasswebsite`:
      npm run typecheck -- --pretty false
      npm run build

    Restart local prod server:
      lsof -ti :3021 | xargs kill -9 2>/dev/null || true
      npx next start -p 3021

    Use:
      http://localhost:3021

  Phase 5: Focused visual and motion verification
    1. Run the fixed motion sweep:
         AUDIT_URL=http://localhost:3021 npx tsx scripts/audit/motion-sweep-307.ts

    2. Required result:
         passed: true
         all 14 motion IDs motion-detected:
           - glass-animated
           - glass-animation-sequence
           - glass-transitions
           - glass-particles
           - glass-particle-field
           - glass-mesh-gradient
           - glass-liquid-transition
           - glass-webgl-shader
           - glass-3d-engine
           - glass-physics-engine
           - glass-mood-ring
           - dynamic-atmosphere
           - glass-spotlight
           - glass-carousel

    3. Manually inspect generated before/after screenshots for:
         - no blank motion cards
         - no dark unreadable blocks
         - no static CSS/SVG fake replacing component
         - no clipped controls
         - no black text on dark surfaces
         - no gray outline junk around buttons
         - no page 12 scroll meltdown

  Phase 6: Full website audit gate
    Run the existing website gate from `/Users/gurbakshchahal/auraglasswebsite`:
      bash scripts/audit/run.sh

    If the gate supports report dir env vars, store artifacts under:
      reports/website-3.0.7-final/

    Required:
      - typecheck pass
      - build pass
      - runtime pass
      - contrast pass
      - geometry pass
      - empty previews pass
      - visual density pass
      - contact sheet generated
      - inventory pass
      - no PreviewBoundary catches
      - no page errors
      - no console errors other than explicitly documented benign Next.js preload warnings, if still present
      - page 12 and page 13 scroll/render reliably

    If the gate fails:
      - Fix root cause.
      - Do not add broad exemptions unless the issue is provably a probe false positive.
      - If exemption is necessary, document the exact reason in the report and PRD/closure docs.

  Phase 7: Documentation and release notes
    Update in `/Users/gurbakshchahal/AuraGlass`:
      - README.md
      - CHANGELOG.md
      - 3.0.7PRD.md
      - reports/3.0.7-closure.md, if present
      - docs/readme.md / docs/components/readme.md, if required by local docs generation
      - docs for AuraElementInteractionPlugin rename/alias
      - any docs still referencing old GitHub ownership

    Documentation must include:
      - 3.0.7 shipped fixes
      - motion components fixed with real package APIs
      - compact/contained/preview/demo APIs added
      - website proof status
      - known limitations, if any remain
      - migration note for GalileoElementInteractionPlugin -> AuraElementInteractionPlugin
      - org repository URL

  Phase 8: Final package verification before publish
    In `/Users/gurbakshchahal/AuraGlass`:
      npm run typecheck -- --pretty false
      npm run build
      npm test -- --runInBand
      npm publish --dry-run --access public

    If `npm test -- --runInBand` is not the correct test command, inspect package scripts and run the appropriate test command. Do not skip tests silently. If tests are too broad/slow, run the package’s intended release test suite and document exactly what was run.

    Check public latest before publish:
      npm view aura-glass version

    Expected before publish:
      3.0.6

  Phase 9: Publish 3.0.7
    Only publish if all required gates above pass.

    In `/Users/gurbakshchahal/AuraGlass`:
      npm publish --access public

    Then verify:
      npm view aura-glass version

    Required after publish:
      3.0.7

    If publish fails because of auth/2FA/network:
      - Stop.
      - Do not claim shipped.
      - Report exact npm error and exact command needed.

  Phase 10: Git status and final report
    Do not make a messy blind commit.

    Report:
      - Package files changed
      - Website files changed
      - Tests/gates run with pass/fail
      - npm publish result
      - npm latest version
      - Remaining known issues, if any

    If asked to commit:
      - Commit package changes separately from website changes if possible.
      - Suggested package commit:
          Ship AuraGlass 3.0.7 motion and catalog fixes
      - Suggested website commit:
          Verify AuraGlass 3.0.7 catalog previews

  Expected final answer:
    Be blunt and factual.
    Include:
      - whether 3.0.7 is published
      - npm latest result
      - package gate result
      - website gate result
      - motion sweep result
      - remaining issues, if any

  Do not say “done” unless npm latest is actually 3.0.7 and the gates passed.