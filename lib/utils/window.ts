export const openProjectorWindow = async (url: string) => {
  // Config for the window
  const features = "menubar=no,toolbar=no,location=no,status=no,titlebar=no,scrollbars=no,fullscreen=yes,width=800,height=600";
  let targetLeft = 0;
  let targetTop = 0;
  let targetWidth = 800;
  let targetHeight = 600;

  try {
    // Check for Window Management API support
    if ('getScreenDetails' in window) {
      // @ts-ignore - TS might not know about this API yet
      const screenDetails = await window.getScreenDetails();
      
      // Find the first screen that is not the current screen (likely the external one)
      // @ts-ignore
      const currentScreen = screenDetails.currentScreen;
      // @ts-ignore
      const otherScreen = screenDetails.screens.find(s => s !== currentScreen);

      if (otherScreen) {
        targetLeft = otherScreen.left;
        targetTop = otherScreen.top;
        targetWidth = otherScreen.width; // Optional: Fullscreen?
        targetHeight = otherScreen.height;
        
        console.log("Found secondary screen:", otherScreen);
        
        // Open with coordinates
        window.open(
            url, 
            "ProjectorWindow", 
            `${features},left=${targetLeft},top=${targetTop},width=${targetWidth},height=${targetHeight}`
        );
        return;
      }
    } else {
        console.warn("Window Management API not supported.");
    }
  } catch (err) {
    console.error("Error accessing screen details:", err);
  }

  // Fallback: Try a generic "screen width" offset strategy if API fails
  // But user said this failed. It might be safer to just open it and let them move it if API fails.
  // Or we can try the naive approach again as a fallback.
  // We'll stick to the previous naive fallback but maybe larger offset?
  const naiveLeft = globalThis.screen.availWidth; 
  window.open(url, "ProjectorWindow", `${features},left=${naiveLeft},top=0`);
};
