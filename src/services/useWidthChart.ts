

export const useWidthChart = () => {
  
  if (window.matchMedia('(min-width: 1280px)').matches) {
    return { width: 450, height: 100 }
  }

  if (window.matchMedia('(min-width: 575px)').matches) {
    return { width: 250, height: 60 }
  }
      return { width: 250, height: 60 }
}