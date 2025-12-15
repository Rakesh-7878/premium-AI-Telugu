document.addEventListener("DOMContentLoaded", () => {
  // --- 0. Subscription Modal Logic ---
  const subscriptionModal = document.getElementById("subscription-modal");
  const subscribeBtn = document.getElementById("subscribeBtn");
  const alreadySubscribedBtn = document.getElementById("alreadySubscribedBtn");
  const body = document.body;

  // Check subscription status with session-based verification
  const checkSubscriptionStatus = () => {
    const sessionSubscribed = sessionStorage.getItem("premiumAI_session_subscribed");
    const lastCheck = sessionStorage.getItem("premiumAI_last_check");
    const currentTime = Date.now();

    // If no session subscription or last check was more than 30 minutes ago
    if (!sessionSubscribed || !lastCheck || (currentTime - parseInt(lastCheck)) > (30 * 60 * 1000)) {
      return false; // Require verification
    }
    return true; // Session still valid
  };

  if (!checkSubscriptionStatus()) {
    // Show subscription modal
    setTimeout(() => {
      subscriptionModal.classList.add("show");
      body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    }, 1000); // Show after 1 second for better UX
  } else {
    // User verified in current session, show content
    body.classList.add("content-visible");
  }

  // Handle subscribe button click
  subscribeBtn.addEventListener("click", () => {
    // Open YouTube channel in new tab
    window.open("https://www.youtube.com/@PremiumAI.telugu?sub_confirmation=1", "_blank");

    // After 3 seconds, show a reminder to click "I'm Already Subscribed"
    setTimeout(() => {
      if (!sessionStorage.getItem("premiumAI_session_subscribed")) {
        alert("After subscribing on YouTube, please return to this page and click 'I'm Already Subscribed' to access the website.");
      }
    }, 3000);
  });

  // Handle "I'm Already Subscribed" button click
  alreadySubscribedBtn.addEventListener("click", () => {
    // Store subscription status in sessionStorage with timestamp
    const currentTime = Date.now();
    sessionStorage.setItem("premiumAI_session_subscribed", "true");
    sessionStorage.setItem("premiumAI_last_check", currentTime.toString());

    // Hide modal and show content
    subscriptionModal.classList.remove("show");
    body.style.overflow = "auto"; // Re-enable scrolling
    body.classList.add("content-visible");

    // Show a thank you message
    setTimeout(() => {
      alert("Thank you for subscribing! Welcome to Premium AI Telugu.\n\nNote: You'll need to verify your subscription again after 30 minutes or when you restart your browser.");
    }, 500);
  });


  // Periodic verification check (every 5 minutes when page is visible)
  const periodicVerification = () => {
    const lastCheck = sessionStorage.getItem("premiumAI_last_check");
    const currentTime = Date.now();

    if (lastCheck && (currentTime - parseInt(lastCheck)) > (30 * 60 * 1000)) {
      // More than 30 minutes have passed, require re-verification
      sessionStorage.removeItem("premiumAI_session_subscribed");
      sessionStorage.removeItem("premiumAI_last_check");

      if (!body.classList.contains("content-visible")) {
        // Modal is already showing, just update timestamp check
        return;
      }

      // Hide content and show modal
      body.classList.remove("content-visible");
      subscriptionModal.classList.add("show");
      body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    }
  };

  // Check every 5 minutes when page is visible
  setInterval(() => {
    if (!document.hidden) {
      periodicVerification();
    }
  }, 5 * 60 * 1000); // 5 minutes

  // Also check when page becomes visible again
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      periodicVerification();
    }
  });

  // --- 1. Hamburger Menu Logic ---
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");

  hamburgerBtn.addEventListener("click", () => {
    dropdownMenu.classList.toggle("active");
  });

  // Close menu if clicked outside
  document.addEventListener("click", (e) => {
    if (!hamburgerBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove("active");
    }
  });


  // --- 2. Scroll Animations (Intersection Observer) ---

  // Options for the observer
  const observerOptions = {
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: "0px 0px -50px 0px", // Trigger slightly before bottom
  };

  // Observer Callback
  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add specific class based on element type
        if (entry.target.tagName === "ARTICLE") {
          entry.target.classList.add("show-article");
          entry.target.classList.remove("hidden");
        } else if (entry.target.tagName === "FOOTER") {
          entry.target.classList.add("show-footer");
        }

        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  };

  // Initialize Observer
  const scrollObserver = new IntersectionObserver(
    observerCallback,
    observerOptions
  );

  // Target Elements: Articles and Footer
  const articles = document.querySelectorAll("article");
  const footer = document.querySelector("footer");

  articles.forEach((article) => scrollObserver.observe(article));
  scrollObserver.observe(footer);

  // --- 3. Smooth Page Transitions ---
  const handleSmoothNavigation = (e) => {
    const link = e.target.closest('.more-btn-link');
    if (link) {
      e.preventDefault();
      const href = link.getAttribute('href');

      // Add transition class to body
      document.body.classList.add('page-transition');

      // Smooth fade out
      document.body.style.transition = 'opacity 0.3s ease';
      document.body.style.opacity = '0';

      // Navigate after animation
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    }
  };

  // Add event listener to main content for smooth navigation
  document.addEventListener('click', handleSmoothNavigation);
});
