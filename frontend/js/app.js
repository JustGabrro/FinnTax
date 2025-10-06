// Newsletter Form
document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Please enter a valid email address");
    return;
  }
  console.log("Newsletter signup:", email);
  alert("Thank you for subscribing!");
  e.target.reset();
});

// Contact Form
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const { name, email, message } = Object.fromEntries(new FormData(e.target))
  if (!name || !email || !message) {
    alert("All fields are required");
    return;
  }
  console.log("Contact form:", { name, email, message });
  alert("Your message has been sent!");
  e.target.reset();
});
