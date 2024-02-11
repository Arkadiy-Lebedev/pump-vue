

export const useWidthChart = () => {
  if (window.matchMedia('(min-width: 1920px)')) {
    return { width: 450, height: 100 }
  }

  if (window.matchMedia('(min-width: 575px)')) {
    return { width: 250, height: 70 }
  }
      return { width: 250, height: 70 }
}