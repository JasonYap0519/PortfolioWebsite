"use strict";

const hamburgerIcon = document.getElementById("hamburger-icon");
const mobileMenu = document.getElementById("mobile-menu");

function setMenuOpen(isOpen) {
  if (!hamburgerIcon) {
    return;
  }

  hamburgerIcon.classList.toggle("open", isOpen);
  hamburgerIcon.setAttribute("aria-expanded", String(isOpen));
}

if (hamburgerIcon && mobileMenu) {
  hamburgerIcon.addEventListener("click", (e) => {
    if (mobileMenu.contains(e.target)) {
      return;
    }
    setMenuOpen(!hamburgerIcon.classList.contains("open"));
  });

  hamburgerIcon.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setMenuOpen(!hamburgerIcon.classList.contains("open"));
    }
  });

  document.addEventListener("click", (e) => {
    if (!hamburgerIcon.contains(e.target)) {
      setMenuOpen(false);
    }
  });
}

const copyEmailBtn = document.getElementById("copy-email-btn");
if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    const email = copyEmailBtn.getAttribute("data-email");
    if (!email) {
      return;
    }

    const originalText = copyEmailBtn.textContent;
    let copied = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch (error) {
        copied = false;
      }
    }

    if (!copied) {
      const helper = document.createElement("textarea");
      helper.value = email;
      helper.setAttribute("readonly", "");
      helper.style.position = "absolute";
      helper.style.left = "-9999px";
      document.body.appendChild(helper);
      helper.select();
      copied = document.execCommand("copy");
      document.body.removeChild(helper);
    }

    copyEmailBtn.textContent = copied ? "Copied!" : "Copy failed";
    window.setTimeout(() => {
      copyEmailBtn.textContent = originalText;
    }, 1400);
  });
}

const sectionIds = [
  "home",
  "featured",
  "work",
  "skills",
  "about",
  "highlights",
  "additional",
];
const navLinks = document.querySelectorAll('a.link[href^="#"]');
const sectionArrow = document.getElementById("section-arrow");
const sectionArrowIcon = document.getElementById("section-arrow-icon");
let currentSectionId = "home";
let pendingSectionId = null;

function scrollToSection(id) {
  const targetSection = document.getElementById(id);
  if (!targetSection) {
    return;
  }

  pendingSectionId = id;
  targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setActiveSection(id) {
  currentSectionId = id;

  navLinks.forEach((link) => {
    const hrefId = link.getAttribute("href").replace("#", "");
    const isActive = hrefId === id;
    link.classList.toggle("active-link", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (sectionArrow && sectionArrowIcon) {
    const isLast = sectionIds[sectionIds.length - 1] === id;
    sectionArrowIcon.textContent = isLast
      ? "keyboard_arrow_up"
      : "keyboard_arrow_down";
    sectionArrow.setAttribute(
      "aria-label",
      isLast ? "Go to top section" : "Go to next section"
    );
  }
}

setActiveSection("home");

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) {
      return;
    }

    e.preventDefault();
    scrollToSection(href.slice(1));
    setMenuOpen(false);
  });
});

const visibleSections = new Map();
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visibleSections.set(entry.target.id, entry.intersectionRatio);
      } else {
        visibleSections.delete(entry.target.id);
      }
    });

    if (visibleSections.size > 0) {
      const sortedVisible = [...visibleSections.entries()].sort(
        (a, b) => b[1] - a[1]
      );
      const activeId = sortedVisible[0][0];

      if (pendingSectionId) {
        const pendingRatio = visibleSections.get(pendingSectionId) || 0;
        if (pendingRatio >= 0.55) {
          setActiveSection(pendingSectionId);
          pendingSectionId = null;
        }
        return;
      }

      setActiveSection(activeId);
    }
  },
  {
    threshold: [0.35, 0.6, 0.85],
    rootMargin: "-72px 0px -20% 0px",
  }
);

sectionIds.forEach((id) => {
  const sectionEl = document.getElementById(id);
  if (sectionEl) {
    sectionObserver.observe(sectionEl);
  }
});

if (sectionArrow) {
  sectionArrow.addEventListener("click", function () {
    const currentIndex = sectionIds.indexOf(currentSectionId);
    const isLast = currentIndex === sectionIds.length - 1;
    const targetId = isLast ? sectionIds[0] : sectionIds[currentIndex + 1];
    scrollToSection(targetId);
  });
}

const workGrid = document.getElementById("work-grid");
const workPrev = document.getElementById("work-prev");
const workNext = document.getElementById("work-next");
const workPrevMobile = document.getElementById("work-prev-mobile");
const workNextMobile = document.getElementById("work-next-mobile");
const workCounter = document.getElementById("work-counter");

if (workGrid && workPrev && workNext) {
  const workCards = workGrid.querySelectorAll(".work-card");
  let workIndex = 0;

  function renderWorkSlide() {
    workGrid.style.transform = `translateX(-${workIndex * 100}%)`;
    if (workCounter) {
      workCounter.textContent = `${workIndex + 1} / ${workCards.length}`;
    }
  }

  function moveWorkSlide(step) {
    const total = workCards.length;
    workIndex = (workIndex + step + total) % total;
    renderWorkSlide();
  }

  workPrev.addEventListener("click", () => moveWorkSlide(-1));
  workNext.addEventListener("click", () => moveWorkSlide(1));
  if (workPrevMobile && workNextMobile) {
    workPrevMobile.addEventListener("click", () => moveWorkSlide(-1));
    workNextMobile.addEventListener("click", () => moveWorkSlide(1));
  }

  let touchStartX = 0;
  let touchEndX = 0;
  workGrid.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  workGrid.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;
      if (Math.abs(deltaX) > 40) {
        moveWorkSlide(deltaX > 0 ? -1 : 1);
      }
    },
    { passive: true }
  );

  renderWorkSlide();
}
