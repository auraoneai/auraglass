//#region src/charts/Chart.tsx
import { Chart as ChartJS, LineElement } from 'chart.js';
ChartJS.register(LineElement);
export function Chart(canvas, config) {
	return new ChartJS(canvas, config);
}
//#endregion
