const initMobileMenu = () => {
  const menuToggle =
    document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const menuClose =
    document.querySelector<HTMLButtonElement>("[data-menu-close]");
  const mobileMenu = document.querySelector<HTMLElement>("[data-mobile-menu]");
  const mobileMenuLinks = document.querySelectorAll<HTMLAnchorElement>(
    "[data-mobile-menu-link]",
  );

  if (!menuToggle || !menuClose || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    mobileMenu.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  menuToggle.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  mobileMenuLinks.forEach((link) => link.addEventListener("click", closeMenu));
};

const initTabs = () => {
  const tabsRoot = document.querySelector<HTMLElement>("[data-tabs]");
  if (!tabsRoot) return;

  const tabButtons = Array.from(
    tabsRoot.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  );
  if (!tabButtons.length) return;

  const activateTab = (button: HTMLButtonElement) => {
    const controlsId = button.getAttribute("aria-controls");
    if (!controlsId) return;

    tabButtons.forEach((tabButton) => {
      const isCurrent = tabButton === button;
      tabButton.classList.toggle("is-active", isCurrent);
      tabButton.setAttribute("aria-selected", String(isCurrent));

      const panelId = tabButton.getAttribute("aria-controls");
      if (!panelId) return;

      const panel = document.getElementById(panelId);
      if (!panel) return;
      panel.hidden = !isCurrent;
    });
  };

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => activateTab(button));

    button.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();

      const currentIndex = tabButtons.indexOf(button);
      const offset = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex =
        (currentIndex + offset + tabButtons.length) % tabButtons.length;
      const nextButton = tabButtons[nextIndex];
      nextButton.focus();
      activateTab(nextButton);
    });
  });
};

const initFaq = () => {
  const faqList = document.querySelector<HTMLElement>("[data-faq-list]");
  if (!faqList) return;

  const faqTriggers =
    faqList.querySelectorAll<HTMLButtonElement>("[data-faq-trigger]");

  faqTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const answerId = trigger.getAttribute("aria-controls");
      if (!answerId) return;

      const answer = document.getElementById(answerId);
      if (!answer) return;

      const nextState = !expanded;
      trigger.setAttribute("aria-expanded", String(nextState));
      trigger.classList.toggle("is-open", nextState);
      answer.hidden = !nextState;
    });
  });
};

const initFormValidation = () => {
  const form = document.querySelector<HTMLFormElement>(
    "[data-newsletter-form]",
  );
  const emailField = form?.querySelector<HTMLInputElement>("#email");
  const fieldWrap = form?.querySelector<HTMLElement>("[data-email-field-wrap]");

  if (!form || !emailField || !fieldWrap) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailField.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!email || !isValid) {
      fieldWrap.classList.add("is-error");
      emailField.setAttribute("aria-invalid", "true");
      return;
    }

    fieldWrap.classList.remove("is-error");
    emailField.removeAttribute("aria-invalid");
    form.reset();
  });

  emailField.addEventListener("input", () => {
    fieldWrap.classList.remove("is-error");
    emailField.removeAttribute("aria-invalid");
  });
};

const initLandingPage = () => {
  initMobileMenu();
  initTabs();
  initFaq();
  initFormValidation();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLandingPage, {
    once: true,
  });
} else {
  initLandingPage();
}
