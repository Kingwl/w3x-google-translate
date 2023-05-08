export function createReporter(
  reportStep: number,
  report: (sum: number) => void
) {
  let sum = 0;
  let nextReportSum = reportStep;

  function incr(num: number) {
    sum += num;

    if (sum >= nextReportSum) {
      nextReportSum += reportStep;

      report(sum);
    }
  }

  return {
    incr,
  };
}
