(function () {
    if (!window.SLIDES) return;
  
    const current = location.pathname.split("/").pop();
    const index = SLIDES.indexOf(current);
    if (index === -1) return;
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" && index < SLIDES.length - 1) {
        location.href = SLIDES[index + 1];
      }
  
      if (e.key === "ArrowLeft" && index > 0) {
        location.href = SLIDES[index - 1];
      }
    });
  })();
  