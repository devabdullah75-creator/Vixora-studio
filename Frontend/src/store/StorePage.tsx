import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import { siteConfig } from '../config/site';
import type { DigitalProduct } from './products';

gsap.registerPlugin(ScrollTrigger);

interface StorePageProps {
  pathname: string;
  navigate: (destination: string) => void;
}

const currentYear = new Date().getFullYear();

const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fetchStoreProducts = async (): Promise<DigitalProduct[]> => {
  const response = await fetch('/api/products');
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? 'Unable to load the store right now.');
  return payload.products as DigitalProduct[];
};

const StoreArtwork: React.FC<{ product: DigitalProduct }> = ({ product }) => {
  const artwork = product.artwork ?? 'orbit';
  return (
  <div className={`store-artwork store-artwork--${artwork}`} aria-label={`${product.title} artwork`} role="img">
    {product.thumbnail ? (
      <img src={product.thumbnail} alt="" loading="lazy" />
    ) : (
      <div className="store-artwork__composition" aria-hidden="true">
        <span className="store-artwork__shape store-artwork__shape--one" />
        <span className="store-artwork__shape store-artwork__shape--two" />
        <span className="store-artwork__shape store-artwork__shape--three" />
        <span className="store-artwork__index">VIXORA / {product.id.slice(0, 2).toUpperCase()}</span>
        <span className="store-artwork__word">{artwork === 'type' ? 'TYPE' : artwork === 'grid' ? 'GRID' : 'MOTION'}</span>
      </div>
    )}
  </div>
  );
};

interface ProductCardProps {
  product: DigitalProduct;
  navigate: (destination: string) => void;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, navigate, index = 0 }) => {
  const cardRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePointerEnter = () => {
    if (isReducedMotion()) return;
    if (cardRef.current) {
      gsap.to(cardRef.current, { y: -7, duration: 0.42, ease: 'back.out(1.7)', overwrite: true });
    }
    if (mediaRef.current) {
      gsap.to(mediaRef.current, { scale: 1.035, duration: 0.65, ease: 'power3.out', overwrite: true });
    }
    if (videoRef.current) {
      void videoRef.current.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'NotAllowedError') return;
        console.error('Unable to play the product preview video.', error);
      });
    }
  };

  const handlePointerLeave = () => {
    if (cardRef.current) gsap.to(cardRef.current, { y: 0, duration: 0.4, ease: 'power3.out', overwrite: true });
    if (mediaRef.current) gsap.to(mediaRef.current, { scale: 1, duration: 0.55, ease: 'power3.out', overwrite: true });
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const openProduct = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate(`/store/product/${product.slug}`);
  };

  return (
    <article
      ref={cardRef}
      className="store-product-card store-reveal"
      style={{ '--store-card-index': index } as React.CSSProperties}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
    >
      <a className="store-product-card__media-link" href={`/store/product/${product.slug}`} onClick={openProduct} aria-label={`View ${product.title}`}>
        <div ref={mediaRef} className="store-product-card__media">
          {product.previewVideo ? (
            <video
              ref={videoRef}
              src={product.previewVideo}
              poster={product.thumbnail ?? undefined}
              muted
              loop
              playsInline
              preload="none"
              aria-label={`${product.title} video preview`}
            />
          ) : <StoreArtwork product={product} />}
          <span className="store-product-card__open" aria-hidden="true"><ArrowUpRight size={17} /></span>
        </div>
      </a>
      <div className="store-product-card__info">
        <div className="store-product-card__heading">
          <div>
            <span className="store-eyebrow">{product.category}</span>
            <h3><a href={`/store/product/${product.slug}`} onClick={openProduct}>{product.title}</a></h3>
          </div>
          <span className="store-product-card__price">
            {product.discountPrice !== null && <s>${product.price.toFixed(2)}</s>}
            ${product.discountPrice?.toFixed(2) ?? product.price.toFixed(2)}
          </span>
        </div>
        <p>{product.description}</p>
        <a className="store-text-link" href={`/store/product/${product.slug}`} onClick={openProduct}>
          Explore product <ArrowRight size={15} />
        </a>
      </div>
    </article>
  );
};

const StoreNavbar: React.FC<{ navigate: (destination: string) => void }> = ({ navigate }) => (
  <header className="store-nav">
    <a className="store-brand" href="/store" onClick={(event) => {
      event.preventDefault();
      navigate('/store');
    }} aria-label="Vixora Studio Store home">
      <img className="store-brand__mark" src={siteConfig.about.portraitImage} alt="" />
      <span className="store-brand__name">VIXORA STUDIO<small>DIGITAL GOODS</small></span>
    </a>
    <span className="store-nav__note">INDEPENDENT TOOLS FOR VISUAL THINKERS</span>
    <button className="store-back-link" onClick={() => navigate('/')} type="button">
      <ArrowLeft size={15} />
      <span>Back to portfolio</span>
    </button>
  </header>
);

const StoreFooter: React.FC<{ navigate: (destination: string) => void }> = ({ navigate }) => (
  <footer className="store-footer">
    <a className="store-footer__brand" href="/store" onClick={(event) => {
      event.preventDefault();
      navigate('/store');
    }}>VIXORA STUDIO</a>
    <p>Original digital tools, made by Abdullah.</p>
    <button type="button" onClick={() => navigate('/')}>Back to portfolio <ArrowUpRight size={14} /></button>
    <small>© {currentYear} VIXORA STUDIO.</small>
  </footer>
);

const StoreHome: React.FC<{ navigate: (destination: string) => void; products: DigitalProduct[] }> = ({ navigate, products }) => {
  const [activeCategory, setActiveCategory] = useState('All products');
  const [query, setQuery] = useState('');
  const pageRef = useRef<HTMLElement>(null);
  const categories = ['All products', ...new Set(products.map((product) => product.category))];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'All products' || product.category === activeCategory;
    const matchesQuery = !normalizedQuery || `${product.title} ${product.description} ${product.category}`.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
  const featuredProducts = products.filter((product) => product.featured);
  const spotlightProduct = featuredProducts[0] ?? products[0];

  useEffect(() => {
    const root = pageRef.current;
    if (!root || isReducedMotion()) return;
    const context = gsap.context(() => {
      gsap.from('.store-hero__eyebrow, .store-hero__title, .store-hero__copy, .store-hero__actions, .store-hero__spotlight', {
        y: 28,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: 'power3.out',
        delay: 0.12,
      });
      if (products.length > 0) {
        gsap.from('.store-featured .store-product-card', {
          y: 34,
          autoAlpha: 0,
          duration: 0.72,
          stagger: 0.075,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.store-featured', start: 'top 82%', once: true },
        });
        gsap.from('.store-latest .store-product-card', {
          y: 30,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.store-latest', start: 'top 82%', once: true },
        });
        gsap.from('.store-shop__grid .store-product-card', {
          y: 30,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.store-shop__grid', start: 'top 85%', once: true },
        });
      }
    }, root);
    return () => context.revert();
  }, [products.length]);

  return (
    <main ref={pageRef} className="store-page page-motion">
      <StoreNavbar navigate={navigate} />
      <section className="store-hero">
        {!isReducedMotion() && (
          <video
            className="store-hero__background-video"
            src="/assets/Videos/Comp%201_1.mp4"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
        <div className="store-hero__texture" aria-hidden="true" />
        <div className="store-hero__content">
          <p className="store-hero__eyebrow"><span /> THE VIXORA STUDIO STORE <span>— INDEPENDENT DIGITAL GOODS</span></p>
          <h1 className="store-hero__title">Make your<br /><em>next move.</em></h1>
          <p className="store-hero__copy">Thoughtful motion assets and creative tools, built from the same studio practice behind the work.</p>
          <div className="store-hero__actions">
            <a href="#shop" className="store-primary-button">Explore the collection <ArrowDown size={16} /></a>
            <span>01 — CREATIVE TOOLS<br />MADE BY VIXORA STUDIO</span>
          </div>
        </div>
        {spotlightProduct && (
          <a
            className="store-hero__spotlight"
            href={`/store/product/${spotlightProduct.slug}`}
            onClick={(event) => {
              event.preventDefault();
              navigate(`/store/product/${spotlightProduct.slug}`);
            }}
            aria-label={`Explore ${spotlightProduct.title}`}
          >
            <div className="store-hero__spotlight-media">
              {spotlightProduct.previewVideo && !isReducedMotion() ? (
                <video
                  src={spotlightProduct.previewVideo}
                  poster={spotlightProduct.thumbnail ?? undefined}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  aria-label={`${spotlightProduct.title} preview`}
                />
              ) : <StoreArtwork product={spotlightProduct} />}
              <span className="store-hero__spotlight-tag">
                {spotlightProduct.featured ? 'STUDIO PICK' : 'EXPLORE THE COLLECTION'}
              </span>
            </div>
            <div className="store-hero__spotlight-info">
              <span className="store-hero__spotlight-category">{spotlightProduct.category}</span>
              <h2>{spotlightProduct.title}</h2>
              <div className="store-hero__spotlight-bottom">
                <span className="store-hero__spotlight-price">
                  ${spotlightProduct.discountPrice?.toFixed(2) ?? spotlightProduct.price.toFixed(2)}
                </span>
                <span className="store-hero__spotlight-cta">Explore asset <ArrowUpRight size={15} /></span>
              </div>
            </div>
          </a>
        )}
        <span className="store-hero__side-label">SCROLL TO EXPLORE</span>
      </section>

      {products.length > 0 && (
        <>
          <section className="store-featured store-section">
            <div className="store-section-heading store-reveal">
              <div><p className="store-eyebrow">01 / THE EDIT</p><h2>Selected for <em>the process.</em></h2></div>
              <p>A few studio favorites to give your next frame a little more feeling.</p>
            </div>
            <div className="store-product-grid store-product-grid--featured">
              {featuredProducts.map((product, index) => <ProductCard key={product.id} product={product} navigate={navigate} index={index} />)}
            </div>
          </section>

          <section className="store-latest store-section">
            <div className="store-section-heading store-reveal">
              <div><p className="store-eyebrow">02 / FRESH FROM THE STUDIO</p><h2>Latest <em>releases.</em></h2></div>
              <a className="store-text-link" href="#shop">Browse all products <ArrowRight size={15} /></a>
            </div>
            <div className="store-product-grid">
              {products.slice(0, 3).map((product, index) => <ProductCard key={product.id} product={product} navigate={navigate} index={index} />)}
            </div>
          </section>
        </>
      )}

      <section id="shop" className="store-shop store-section">
        <div className="store-section-heading store-shop__heading">
          <div><p className="store-eyebrow">03 / THE FULL COLLECTION</p><h2>Find your <em>flow.</em></h2></div>
        </div>
        {products.length > 0 ? (
          <div className="store-products-content">
            <label className="store-search">
              <Search size={17} aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" />
              {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
            </label>
            <div className="store-shop__filters" role="group" aria-label="Filter products by category">
              {categories.map((category) => (
                <button key={category} className={activeCategory === category ? 'is-active' : ''} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>
                  {category}<span>{category === 'All products' ? products.length : products.filter((product) => product.category === category).length}</span>
                </button>
              ))}
            </div>
            {filteredProducts.length ? (
              <div className="store-product-grid store-shop__grid">
                {filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} navigate={navigate} index={index} />)}
              </div>
            ) : (
              <div className="store-empty-state">
                <span>NO MATCHES FOUND</span>
                <p>Try a different search or category.</p>
                <button type="button" onClick={() => { setQuery(''); setActiveCategory('All products'); }}>Clear filters</button>
              </div>
            )}
          </div>
        ) : (
          <div className="store-empty-state">
            <span>THE COLLECTION IS IN PROGRESS</span>
            <p>There are no products in the store right now. Check back soon.</p>
          </div>
        )}
      </section>
      <StoreFooter navigate={navigate} />
    </main>
  );
};

const StoreDetail: React.FC<{ product: DigitalProduct; products: DigitalProduct[]; navigate: (destination: string) => void }> = ({ product, products, navigate }) => {
  const pageRef = useRef<HTMLElement>(null);
  const relatedProducts = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);

  useEffect(() => {
    const root = pageRef.current;
    if (!root || isReducedMotion()) return;
    const context = gsap.context(() => {
      gsap.from('.store-detail__visual, .store-detail__intro > *', {
        y: 26,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: 'power3.out',
      });
      gsap.from('.store-detail__section', {
        y: 25,
        autoAlpha: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.store-detail__included', start: 'top 85%', once: true },
      });
    }, root);
    return () => context.revert();
  }, [product]);

  return (
    <main ref={pageRef} className="store-page page-motion">
      <StoreNavbar navigate={navigate} />
      <div className="store-detail">
        <button className="store-detail__back" onClick={() => navigate('/store')} type="button"><ArrowLeft size={16} /> Back to all products</button>
        <div className="store-detail__layout">
          <div className="store-detail__visual">
            {product.previewVideo ? (
              <video src={product.previewVideo} poster={product.thumbnail ?? undefined} controls muted playsInline />
            ) : <StoreArtwork product={product} />}
          </div>
          <div className="store-detail__intro">
            <p className="store-eyebrow">{product.category}</p>
            <h1>{product.title}</h1>
            <p className="store-detail__description">{product.fullDescription || product.description}</p>
            <div className="store-detail__price">
              {product.discountPrice !== null && <s>${product.price.toFixed(2)}</s>}
              ${product.discountPrice?.toFixed(2) ?? product.price.toFixed(2)}<span> USD</span>
            </div>
            <button className="store-primary-button store-primary-button--disabled" type="button" disabled>
              Purchase unavailable <ArrowUpRight size={16} />
            </button>
            <p className="store-detail__notice">Checkout and downloads are not connected.</p>
            <div className="store-detail__facts">
              <span>MADE BY VIXORA STUDIO</span><span>VERSION {product.version}</span>
            </div>
          </div>
        </div>
        {product.gallery.length > 0 && (
          <div className="store-detail__gallery">
            {product.gallery.map((image, index) => (
              <img key={image} src={image} alt={`${product.title} gallery image ${index + 1}`} loading="lazy" />
            ))}
          </div>
        )}

        {(product.features.length > 0 || product.compatibility.length > 0) && (
        <section className="store-detail__included store-detail__section">
          <div className="store-detail__section-title"><p className="store-eyebrow">01 / THE DETAILS</p><h2>Built for <em>the work.</em></h2></div>
          <div className="store-detail__columns">
            {product.features.length > 0 && <div><h3>What's included</h3><ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>}
            {product.compatibility.length > 0 && <div><h3>Compatibility</h3><ul>{product.compatibility.map((item) => <li key={item}>{item}</li>)}</ul></div>}
          </div>
        </section>
        )}
        {relatedProducts.length > 0 && (
          <section className="store-detail__related store-detail__section">
            <div className="store-section-heading"><div><p className="store-eyebrow">02 / KEEP EXPLORING</p><h2>More in <em>{product.category}.</em></h2></div></div>
            <div className="store-product-grid">{relatedProducts.map((item, index) => <ProductCard key={item.id} product={item} navigate={navigate} index={index} />)}</div>
          </section>
        )}
      </div>
      <StoreFooter navigate={navigate} />
    </main>
  );
};

export const StorePage: React.FC<StorePageProps> = ({ pathname, navigate }) => {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    fetchStoreProducts()
      .then((loadedProducts) => {
        if (!active) return;
        setProducts(loadedProducts);
        setLoadState('ready');
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : 'Unable to load the store right now.');
        setLoadState('error');
      });
    return () => { active = false; };
  }, []);

  const retryLoadingProducts = () => {
    setLoadError('');
    setLoadState('loading');
    fetchStoreProducts()
      .then((loadedProducts) => {
        setProducts(loadedProducts);
        setLoadState('ready');
      })
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : 'Unable to load the store right now.');
        setLoadState('error');
      });
  };

  const productSlug = pathname.match(/^\/store\/product\/([^/]+)\/?$/)?.[1];
  const product = products.find((item) => item.slug === productSlug);

  useEffect(() => {
    document.title = product
      ? `${product.title} — Vixora Studio Store`
      : pathname.startsWith('/store/product/')
        ? 'Product not found — Vixora Studio Store'
        : 'Vixora Studio Store — Digital Products';
    return () => {
      document.title = 'Vixora Studio — Abdullah | Custom Motion Design & Visual Art';
    };
  }, [pathname, product]);

  if (loadState === 'loading') {
    return (
      <main className="store-page page-motion">
        <StoreNavbar navigate={navigate} />
        <div className="store-loading-state"><span className="store-eyebrow">VIXORA STUDIO STORE</span><p>Loading the collection…</p></div>
        <StoreFooter navigate={navigate} />
      </main>
    );
  }

  if (loadState === 'error') {
    return (
      <main className="store-page page-motion">
        <StoreNavbar navigate={navigate} />
        <div className="store-empty-state store-load-error">
          <span>THE COLLECTION IS TEMPORARILY UNAVAILABLE</span>
          <p>{loadError}</p>
          <button type="button" onClick={retryLoadingProducts}>Try again</button>
        </div>
        <StoreFooter navigate={navigate} />
      </main>
    );
  }

  if (pathname.startsWith('/store/product/') && product) {
    return <StoreDetail key={product.id} product={product} products={products} navigate={navigate} />;
  }

  if (pathname.startsWith('/store/product/')) {
    return (
      <main className="store-page store-not-found page-motion">
        <StoreNavbar navigate={navigate} />
        <div><p className="store-eyebrow">404 / PRODUCT NOT FOUND</p><h1>This one's not in the collection.</h1><button className="store-primary-button" onClick={() => navigate('/store')} type="button">Return to the store <ArrowRight size={16} /></button></div>
        <StoreFooter navigate={navigate} />
      </main>
    );
  }

  return <StoreHome navigate={navigate} products={products} />;
};
