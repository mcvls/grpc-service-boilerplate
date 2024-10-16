//https://stackoverflow.com/questions/4187146/truncate-number-to-two-decimal-places-without-rounding
function toFixedPlace(num: any, fixed = 2) {
  if (!num || fixed == undefined || fixed < 0 || isNaN(num)) return num;
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
  const cleaned = Number(num).toFixed(fixed).match(re);
  return cleaned?.length ? Number(cleaned[0]) : 0;
}

function toFixedPlaceDisplay(num: any, fixed = 2) {
  const display = Number(toFixedPlace(num, fixed));
  return display.toLocaleString(undefined, {
    minimumFractionDigits: fixed,
    maximumFractionDigits: fixed,
  });
}

export { toFixedPlace, toFixedPlaceDisplay };
