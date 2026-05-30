import * as cheerio from 'cheerio';

export interface AuditResult {
  url: string;
  score: number;
  performance: {
    score: number;
    loadTime: string;
    pageSize: string;
    issues: string[];
  };
  seo: {
    score: number;
    metaTags: boolean;
    headings: boolean;
    schemaMarkup: boolean;
    issues: string[];
  };
  mobile: {
    score: number;
    responsive: boolean;
    viewport: boolean;
    issues: string[];
  };
  conversion: {
    score: number;
    hasCart: boolean;
    hasReviews: boolean;
    hasTrustBadges: boolean;
    issues: string[];
  };
  security: {
    score: number;
    https: boolean;
    issues: string[];
  };
}

export async function auditWebsite(url: string): Promise<AuditResult> {
  const startTime = Date.now();
  
  try {
    // Fetch the website
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const loadTime = ((Date.now() - startTime) / 1000).toFixed(1);
    const $ = cheerio.load(html);
    
    // Calculate page size
    const pageSize = (html.length / 1024).toFixed(0);
    
    // SEO Analysis
    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content');
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const hasSchema = html.includes('schema.org') || html.includes('application/ld+json');
    
    // Mobile Analysis
    const viewport = $('meta[name="viewport"]').attr('content');
    const hasViewport = !!viewport;
    
    // Check for mobile-specific issues
    const imagesWithoutAlt = $('img:not([alt])').length;
    const smallButtons = $('button, .btn, .button').filter((_, el) => {
      const style = $(el).attr('style') || '';
      return style.includes('font-size') && parseInt(style.match(/font-size:\s*(\d+)/)?.[1] || '0') < 14;
    }).length;
    
    // Conversion Analysis
    const hasCart = html.toLowerCase().includes('cart') || html.toLowerCase().includes('checkout');
    const hasReviews = html.toLowerCase().includes('review') || html.toLowerCase().includes('rating');
    const hasTrustBadges = html.toLowerCase().includes('secure') || 
                           html.toLowerCase().includes('guarantee') ||
                           html.includes('SSL') ||
                           html.includes('money-back');
    
    // Performance Analysis
    const scripts = $('script').length;
    const stylesheets = $('link[rel="stylesheet"]').length;
    const images = $('img').length;
    const lazyLoaded = $('img[loading="lazy"]').length;
    
    // Security
    const isHttps = url.startsWith('https://');
    
    // Calculate scores
    let seoScore = 70;
    const seoIssues: string[] = [];
    
    if (!title || title.length < 10) {
      seoScore -= 15;
      seoIssues.push('Title tag missing or too short');
    }
    if (!metaDescription) {
      seoScore -= 15;
      seoIssues.push('Meta description missing');
    }
    if (h1Count === 0) {
      seoScore -= 10;
      seoIssues.push('No H1 heading found');
    } else if (h1Count > 1) {
      seoScore -= 5;
      seoIssues.push(`Multiple H1 tags (${h1Count}) - should only have one`);
    }
    if (!hasSchema) {
      seoScore -= 5;
      seoIssues.push('Schema markup not detected');
    }
    if (imagesWithoutAlt > 0) {
      seoScore -= 5;
      seoIssues.push(`${imagesWithoutAlt} images missing alt text`);
    }
    
    let mobileScore = 80;
    const mobileIssues: string[] = [];
    
    if (!hasViewport) {
      mobileScore -= 30;
      mobileIssues.push('Viewport meta tag missing - not mobile responsive');
    }
    if (imagesWithoutAlt > 5) {
      mobileScore -= 5;
      mobileIssues.push('Many images lack alt text');
    }
    if (smallButtons > 0) {
      mobileScore -= 5;
      mobileIssues.push('Small buttons detected - may be hard to tap on mobile');
    }
    
    let performanceScore = 75;
    const performanceIssues: string[] = [];
    
    const loadTimeNum = parseFloat(loadTime);
    if (loadTimeNum > 3) {
      performanceScore -= 20;
      performanceIssues.push(`Slow load time (${loadTime}s) - aim for under 3s`);
    } else if (loadTimeNum > 2) {
      performanceScore -= 10;
      performanceIssues.push(`Load time could be improved (${loadTime}s)`);
    }
    
    if (scripts > 15) {
      performanceScore -= 10;
      performanceIssues.push(`Too many scripts (${scripts}) - consider deferring non-critical ones`);
    }
    if (stylesheets > 5) {
      performanceScore -= 5;
      performanceIssues.push('Multiple stylesheets - consider combining');
    }
    if (images > lazyLoaded + 3) {
      performanceScore -= 10;
      performanceIssues.push(`Images not lazy-loaded (${images - lazyLoaded} of ${images})`);
    }
    if (parseInt(pageSize) > 2000) {
      performanceScore -= 10;
      performanceIssues.push(`Page size is large (${pageSize}KB) - optimize images and code`);
    }
    
    let conversionScore = 60;
    const conversionIssues: string[] = [];
    
    if (!hasCart) {
      conversionScore -= 20;
      conversionIssues.push('Cart/checkout elements not clearly visible');
    }
    if (!hasReviews) {
      conversionScore -= 10;
      conversionIssues.push('No social proof (reviews/ratings) detected');
    }
    if (!hasTrustBadges) {
      conversionScore -= 10;
      conversionIssues.push('Trust badges not detected - add security/guarantee badges');
    }
    
    let securityScore = isHttps ? 90 : 40;
    const securityIssues: string[] = [];
    
    if (!isHttps) {
      securityIssues.push('Site not using HTTPS - critical security issue');
    }
    
    // Ensure scores don't go below 0
    seoScore = Math.max(0, seoScore);
    mobileScore = Math.max(0, mobileScore);
    performanceScore = Math.max(0, performanceScore);
    conversionScore = Math.max(0, conversionScore);
    
    // Calculate overall score
    const overallScore = Math.round(
      (seoScore + mobileScore + performanceScore + conversionScore + securityScore) / 5
    );
    
    return {
      url,
      score: overallScore,
      performance: {
        score: performanceScore,
        loadTime: `${loadTime}s`,
        pageSize: `${pageSize}KB`,
        issues: performanceIssues.length > 0 ? performanceIssues : ['Performance looks good!']
      },
      seo: {
        score: seoScore,
        metaTags: !!(title && metaDescription),
        headings: h1Count > 0,
        schemaMarkup: hasSchema,
        issues: seoIssues.length > 0 ? seoIssues : ['SEO basics are covered!']
      },
      mobile: {
        score: mobileScore,
        responsive: hasViewport,
        viewport: hasViewport,
        issues: mobileIssues.length > 0 ? mobileIssues : ['Mobile optimization looks good!']
      },
      conversion: {
        score: conversionScore,
        hasCart,
        hasReviews,
        hasTrustBadges,
        issues: conversionIssues.length > 0 ? conversionIssues : ['Conversion elements detected!']
      },
      security: {
        score: securityScore,
        https: isHttps,
        issues: securityIssues.length > 0 ? securityIssues : ['Security looks good!']
      }
    };
    
  } catch (error) {
    console.error('Audit error:', error);
    throw error;
  }
}
