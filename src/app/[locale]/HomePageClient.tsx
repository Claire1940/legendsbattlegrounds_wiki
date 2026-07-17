"use client";

import { Fragment, Suspense, lazy } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Ban,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Crosshair,
  Flame,
  Gauge,
  Gem,
  GraduationCap,
  Keyboard,
  Lightbulb,
  Medal,
  Sparkles,
  Target,
  Timer,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// 模块头部（眉题徽标 + 标题 + 副标题 + 简介），主题色统一走 CSS 变量
function ModuleHeader({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  intro,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  intro?: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]">
          <Icon className="w-4 h-4" /> {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">{title}</h2>
      {subtitle && (
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3">
          {subtitle}
        </p>
      )}
      {intro && (
        <p className="text-sm md:text-base text-muted-foreground/80 max-w-3xl mx-auto">
          {intro}
        </p>
      )}
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.legendsbattlegrounds.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Legends Battlegrounds Wiki",
        description:
          "Complete Legends Battlegrounds Wiki covering characters, movesets, combos, tier lists, techniques, gamepasses, controls, and updates for the fast-paced Roblox stickman PvP fighter by Arts of Vermillion.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Legends Battlegrounds - Fast-Paced Stickman PvP Fighter",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Legends Battlegrounds Wiki",
        alternateName: "Legends Battlegrounds",
        url: siteUrl,
        description:
          "Complete Legends Battlegrounds Wiki resource hub for characters, movesets, combos, tier lists, techniques, gamepasses, and update guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Legends Battlegrounds Wiki - Fast-Paced Stickman PvP Fighter",
        },
        sameAs: [
          "https://www.roblox.com/games/15269951959/Legends-Battlegrounds",
          "https://www.roblox.com/communities/33327115/Arts-of-Vermillion",
          "https://x.com/Zalekoth",
          "https://www.youtube.com/@Zalekoth",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Legends Battlegrounds",
        gamePlatform: ["PC", "Mobile", "Tablet", "Console", "Roblox"],
        applicationCategory: "Game",
        genre: ["Fighting", "Action", "PvP", "Multiplayer"],
        numberOfPlayers: {
          minValue: 2,
          maxValue: 100,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/15269951959/Legends-Battlegrounds",
        },
      },
      {
        "@type": "VideoObject",
        name: "Legends Battlegrounds - Gameplay Showcase",
        description:
          "Hands-on Legends Battlegrounds gameplay covering stickman PvP combat, combos and the latest update.",
        uploadDate: "2026-03-12",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/TobAbc_6wxc",
        url: "https://www.youtube.com/watch?v=TobAbc_6wxc",
      },
    ],
  };

  const mobileBannerAd = getPreferredMobileBannerSelection();

  // 工具卡片索引 → 模块 section ID（8 张卡对应 8 个模块锚点）
  const toolSectionIds = [
    "beginner-guide",
    "characters-tier-list",
    "best-combos",
    "martial-legend-guide",
    "legends-battlegrounds-jun-guide",
    "legends-battlegrounds-shinji-guide",
    "emotes-cosmetics-gamepasses",
    "updates-sneak-peeks",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/15269951959/Legends-Battlegrounds"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section（支持 IntersectionObserver 自动播放） */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="TobAbc_6wxc"
              title="Legends Battlegrounds - Gameplay Showcase"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（前半屏顺序：Hero → 视频 → 模块导航区） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = toolSectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section（保留模板 1 的最新文章模块） */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={GraduationCap}
            eyebrow={t.modules.legendsBattlegroundsBeginnerGuide.eyebrow}
            title={t.modules.legendsBattlegroundsBeginnerGuide.title}
            subtitle={t.modules.legendsBattlegroundsBeginnerGuide.subtitle}
            intro={t.modules.legendsBattlegroundsBeginnerGuide.intro}
          />

          {/* Controls */}
          <div className="scroll-reveal mb-8 md:mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Keyboard className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">
                {t.modules.legendsBattlegroundsBeginnerGuide.controlsTitle}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              {t.modules.legendsBattlegroundsBeginnerGuide.controls.map(
                (c: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 md:p-4 bg-white/5 border border-border rounded-lg"
                  >
                    <span className="font-mono text-xs md:text-sm px-2 py-1 rounded bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))] whitespace-nowrap">
                      {c.input}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {c.action}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.legendsBattlegroundsBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-lg md:text-xl font-bold">
                        {step.title}
                      </h3>
                      {step.duration && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground">
                          <Timer className="w-3 h-3" /> {step.duration}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-1.5">
                      {step.points.map((p: string, pi: number) => (
                        <li
                          key={pi}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Lightbulb className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {t.modules.legendsBattlegroundsBeginnerGuide.quickTips.map(
                (tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 4 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Tier List */}
      <section
        id="characters-tier-list"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Medal}
            eyebrow={t.modules.legendsBattlegroundsTierList.eyebrow}
            title={t.modules.legendsBattlegroundsTierList.title}
            subtitle={t.modules.legendsBattlegroundsTierList.subtitle}
            intro={t.modules.legendsBattlegroundsTierList.intro}
          />

          <div className="space-y-10 md:space-y-12 scroll-reveal">
            {t.modules.legendsBattlegroundsTierList.rankings.map(
              (ranking: any, ri: number) => (
                <div key={ri}>
                  <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-5">
                    {ranking.name}
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    {ranking.entries.map((e: any, ei: number) => (
                      <div
                        key={ei}
                        className="flex flex-col md:flex-row gap-4 p-4 md:p-5 bg-white/5 border border-border rounded-xl"
                      >
                        <div className="flex items-center gap-3 md:w-48 md:flex-shrink-0">
                          <span className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] text-xl md:text-2xl font-bold text-[hsl(var(--nav-theme-light))]">
                            {e.tier}
                          </span>
                          <div>
                            <p className="font-bold leading-tight">
                              {e.fighter}
                            </p>
                            {e.tag && (
                              <span className="text-xs text-muted-foreground">
                                {e.tag}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground mb-2">
                            {e.summary}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {e.stats.map((s: any, si: number) => (
                              <span
                                key={si}
                                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                              >
                                <span className="text-muted-foreground">
                                  {s.label}:
                                </span>
                                <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                                  {s.value}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: Best Combos */}
      <section id="best-combos" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Zap}
            eyebrow={t.modules.legendsBattlegroundsBestCombos.eyebrow}
            title={t.modules.legendsBattlegroundsBestCombos.title}
            subtitle={t.modules.legendsBattlegroundsBestCombos.subtitle}
            intro={t.modules.legendsBattlegroundsBestCombos.intro}
          />

          {t.modules.legendsBattlegroundsBestCombos.notation && (
            <p className="scroll-reveal text-center text-xs md:text-sm text-muted-foreground mb-8 md:mb-10">
              {t.modules.legendsBattlegroundsBestCombos.notation}
            </p>
          )}

          <div className="space-y-10 scroll-reveal">
            {t.modules.legendsBattlegroundsBestCombos.fighters.map(
              (f: any, fi: number) => (
                <div key={fi}>
                  <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)] text-[hsl(var(--nav-theme-light))]">
                      <Zap className="w-4 h-4" />
                    </span>
                    {f.name}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {f.combos.map((combo: any, ci: number) => (
                      <div
                        key={ci}
                        className="p-5 bg-white/5 border border-border rounded-xl"
                      >
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <h4 className="font-bold">{combo.name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))] whitespace-nowrap">
                            {combo.difficulty}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 mb-3">
                          {combo.sequence.map((s: string, si: number) => (
                            <Fragment key={si}>
                              {si > 0 && (
                                <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                              )}
                              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.25)]">
                                {s}
                              </span>
                            </Fragment>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          <span className="font-medium text-foreground/80">
                            Timing:{" "}
                          </span>
                          {combo.timing}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/80">
                            Use:{" "}
                          </span>
                          {combo.useCase}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 4: Martial Legend */}
      <section
        id="martial-legend-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Flame}
            eyebrow={t.modules.legendsBattlegroundsMartialLegend.eyebrow}
            title={t.modules.legendsBattlegroundsMartialLegend.title}
            subtitle={t.modules.legendsBattlegroundsMartialLegend.subtitle}
            intro={t.modules.legendsBattlegroundsMartialLegend.intro}
          />

          <div className="space-y-8 scroll-reveal">
            {t.modules.legendsBattlegroundsMartialLegend.groups.map(
              (g: any, gi: number) => (
                <div key={gi}>
                  <h3 className="text-lg md:text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                    {g.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {g.moves.map((m: any, mi: number) => (
                      <div
                        key={mi}
                        className="p-5 bg-white/5 border border-border rounded-xl"
                      >
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-bold">{m.name}</h4>
                          {m.role && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]">
                              {m.role}
                            </span>
                          )}
                        </div>
                        {m.properties && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {m.properties.map((p: string, pi: number) => (
                              <span
                                key={pi}
                                className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border text-muted-foreground"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                        {m.bestUse && (
                          <p className="text-xs text-muted-foreground">
                            <Target className="inline w-3 h-3 mr-1 text-[hsl(var(--nav-theme-light))]" />
                            <span className="font-medium text-foreground/80">
                              Best use:{" "}
                            </span>
                            {m.bestUse}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 5: Jun Guide */}
      <section
        id="legends-battlegrounds-jun-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Crosshair}
            eyebrow={t.modules.legendsBattlegroundsJunGuide.eyebrow}
            title={t.modules.legendsBattlegroundsJunGuide.title}
            subtitle={t.modules.legendsBattlegroundsJunGuide.subtitle}
            intro={t.modules.legendsBattlegroundsJunGuide.intro}
          />

          <div className="space-y-8 scroll-reveal">
            {t.modules.legendsBattlegroundsJunGuide.groups.map(
              (g: any, gi: number) => (
                <div key={gi}>
                  <h3 className="text-lg md:text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                    {g.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {g.moves.map((m: any, mi: number) => (
                      <div
                        key={mi}
                        className="p-5 bg-white/5 border border-border rounded-xl"
                      >
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-bold">{m.name}</h4>
                          {m.input && (
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]">
                              {m.input}
                            </span>
                          )}
                          {m.role && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground">
                              {m.role}
                            </span>
                          )}
                          {m.guard && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground">
                              {m.guard}
                            </span>
                          )}
                        </div>
                        {m.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {m.description}
                          </p>
                        )}
                        {m.bestUse && (
                          <p className="text-xs text-muted-foreground">
                            <Target className="inline w-3 h-3 mr-1 text-[hsl(var(--nav-theme-light))]" />
                            <span className="font-medium text-foreground/80">
                              Best use:{" "}
                            </span>
                            {m.bestUse}
                          </p>
                        )}
                        {m.tip && (
                          <p className="text-xs text-muted-foreground">
                            <Lightbulb className="inline w-3 h-3 mr-1 text-[hsl(var(--nav-theme-light))]" />
                            <span className="font-medium text-foreground/80">
                              Tip:{" "}
                            </span>
                            {m.tip}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 6: Shinji Guide */}
      <section
        id="legends-battlegrounds-shinji-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Gauge}
            eyebrow={t.modules.legendsBattlegroundsShinjiGuide.eyebrow}
            title={t.modules.legendsBattlegroundsShinjiGuide.title}
            subtitle={t.modules.legendsBattlegroundsShinjiGuide.subtitle}
            intro={t.modules.legendsBattlegroundsShinjiGuide.intro}
          />

          <div className="space-y-8 scroll-reveal">
            {t.modules.legendsBattlegroundsShinjiGuide.groups.map(
              (g: any, gi: number) => (
                <div key={gi}>
                  <h3 className="text-lg md:text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                    {g.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {g.cards.map((c: any, ci: number) => (
                      <div
                        key={ci}
                        className="p-5 bg-white/5 border border-border rounded-xl"
                      >
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-bold">{c.name}</h4>
                          {c.input && (
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]">
                              {c.input}
                            </span>
                          )}
                          {c.tag && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground">
                              {c.tag}
                            </span>
                          )}
                        </div>
                        {c.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {c.description}
                          </p>
                        )}
                        {c.bestUse && (
                          <p className="text-xs text-muted-foreground">
                            <Target className="inline w-3 h-3 mr-1 text-[hsl(var(--nav-theme-light))]" />
                            <span className="font-medium text-foreground/80">
                              Best use:{" "}
                            </span>
                            {c.bestUse}
                          </p>
                        )}
                        {c.recommendation && (
                          <p className="text-xs text-muted-foreground">
                            <Lightbulb className="inline w-3 h-3 mr-1 text-[hsl(var(--nav-theme-light))]" />
                            {c.recommendation}
                          </p>
                        )}
                        {c.risk && (
                          <p className="text-xs text-muted-foreground">
                            <Ban className="inline w-3 h-3 mr-1 text-[hsl(var(--nav-theme-light))]" />
                            <span className="font-medium text-foreground/80">
                              Risk:{" "}
                            </span>
                            {c.risk}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Gamepasses and Cosmetics */}
      <section
        id="emotes-cosmetics-gamepasses"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Gem}
            eyebrow={t.modules.legendsBattlegroundsGamepasses.eyebrow}
            title={t.modules.legendsBattlegroundsGamepasses.title}
            subtitle={t.modules.legendsBattlegroundsGamepasses.subtitle}
            intro={t.modules.legendsBattlegroundsGamepasses.intro}
          />

          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-[hsl(var(--nav-theme)/0.3)] text-left">
                  <th className="p-3 font-semibold">
                    {t.modules.legendsBattlegroundsGamepasses.headers.name}
                  </th>
                  <th className="p-3 font-semibold">
                    {t.modules.legendsBattlegroundsGamepasses.headers.category}
                  </th>
                  <th className="p-3 font-semibold">
                    {t.modules.legendsBattlegroundsGamepasses.headers.effect}
                  </th>
                  <th className="p-3 font-semibold">
                    {t.modules.legendsBattlegroundsGamepasses.headers.impact}
                  </th>
                  <th className="p-3 font-semibold">
                    {
                      t.modules.legendsBattlegroundsGamepasses.headers
                        .classification
                    }
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.legendsBattlegroundsGamepasses.items.map(
                  (it: any, ii: number) => (
                    <tr
                      key={ii}
                      className={`border-b border-border align-top ${
                        it.boost ? "bg-[hsl(var(--nav-theme)/0.05)]" : ""
                      }`}
                    >
                      <td className="p-3 font-semibold whitespace-nowrap">
                        {it.boost && (
                          <BadgeCheck className="inline w-4 h-4 mr-1 text-[hsl(var(--nav-theme-light))]" />
                        )}
                        {it.name}
                      </td>
                      <td className="p-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                          {it.category}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{it.effect}</td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">
                        {it.impact}
                      </td>
                      <td className="p-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border text-muted-foreground">
                          {it.classification}
                        </span>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 广告位 7 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 8: Updates and Sneak Peeks */}
      <section
        id="updates-sneak-peeks"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Bell}
            eyebrow={t.modules.legendsBattlegroundsUpdates.eyebrow}
            title={t.modules.legendsBattlegroundsUpdates.title}
            subtitle={t.modules.legendsBattlegroundsUpdates.subtitle}
            intro={t.modules.legendsBattlegroundsUpdates.intro}
          />

          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.legendsBattlegroundsUpdates.entries.map(
              (entry: any, ei: number) => (
                <div key={ei} className="relative">
                  <div className="absolute -left-[1.65rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                  <div className="p-5 bg-white/5 border border-border rounded-xl">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))] font-medium">
                        {entry.status}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground">
                        {entry.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /> {entry.date}
                      </span>
                    </div>
                    <h3 className="font-bold mb-1">{entry.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {entry.summary}
                    </p>
                    <ul className="space-y-1">
                      {entry.changes.map((ch: string, chi: number) => (
                        <li
                          key={chi}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <ChevronRight className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span>{ch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner final */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/communities/33327115/Arts-of-Vermillion"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/Zalekoth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@Zalekoth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/15269951959/Legends-Battlegrounds"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
