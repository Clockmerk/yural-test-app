/**
 * Прокручивает к элементу, только если он целиком ниже экрана.
 * На десктопе колонки помещаются в окно, поэтому прокрутка срабатывает только в мобильной раскладке.
 * @param {HTMLElement | null} element
 */
export function revealIfBelowFold(element) {
  if (element && element.getBoundingClientRect().top >= window.innerHeight) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
