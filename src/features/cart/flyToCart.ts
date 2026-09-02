export const CART_FLY_TARGET_ID = "site-cart";

export function flyToCart(origin: EventTarget | null) {
  if (typeof window === "undefined") return;

  const cart = document.getElementById(CART_FLY_TARGET_ID);
  if (!cart) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    bumpCart(cart);
    return;
  }

  const source = resolveSource(origin);
  if (!source) {
    bumpCart(cart);
    return;
  }

  const from = source.getBoundingClientRect();
  const to = cart.getBoundingClientRect();
  if (from.width < 8 || from.height < 8 || to.width < 4) {
    bumpCart(cart);
    return;
  }

  const flyer = source.cloneNode(true) as HTMLElement;
  flyer.removeAttribute("id");
  flyer.setAttribute("aria-hidden", "true");
  flyer.style.cssText = [
    `position:fixed`,
    `left:${from.left}px`,
    `top:${from.top}px`,
    `width:${from.width}px`,
    `height:${from.height}px`,
    `margin:0`,
    `z-index:80`,
    `pointer-events:none`,
    `transform-origin:center center`,
    `overflow:hidden`,
    `border-radius:1rem`,
    `border:3px solid #0a0a0a`,
    `box-shadow:4px 4px 0 #0a0a0a`,
    `background:#fff`,
    `will-change:transform,opacity`,
  ].join(";");
  document.body.appendChild(flyer);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const lift = Math.min(72, Math.abs(dy) * 0.28 + 28);

  const anim = flyer.animate(
    [
      { transform: "translate(0,0) scale(1) rotate(-6deg)", opacity: 1 },
      {
        transform: `translate(${dx * 0.55}px,${dy * 0.38 - lift}px) scale(0.55) rotate(8deg)`,
        opacity: 1,
      },
      {
        transform: `translate(${dx}px,${dy}px) scale(0.12) rotate(18deg)`,
        opacity: 0.25,
      },
    ],
    {
      duration: 420,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards",
    },
  );

  anim.finished.then(() => {
    flyer.remove();
    bumpCart(cart);
  }).catch(() => {
    flyer.remove();
  });
}

function resolveSource(origin: EventTarget | null): HTMLElement | null {
  if (!(origin instanceof Element)) return null;
  const root = origin.closest("[data-cart-source]");
  const scope = root ?? origin;
  const marked = scope.querySelector("[data-cart-fly]");
  if (marked instanceof HTMLElement) return marked;
  const img = scope.querySelector("img");
  return img instanceof HTMLElement ? img : null;
}

function bumpCart(cart: HTMLElement) {
  cart.classList.remove("animate-cart-bump");
  void cart.offsetWidth;
  cart.classList.add("animate-cart-bump");
}
