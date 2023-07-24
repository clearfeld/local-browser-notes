import { ReportHandler } from "web-vitals";

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
	if (onPerfEntry && onPerfEntry instanceof Function) {
		// eslint-disable-next-line
		import("web-vitals").then(({ getCLS, getFID, getFCP, getINP, getLCP, getTTFB }) => {
			getCLS(onPerfEntry);
			getFCP(onPerfEntry);
			getFID(onPerfEntry);
			getINP(onPerfEntry);
			getLCP(onPerfEntry);
			getTTFB(onPerfEntry);
		});
	}
};

export default reportWebVitals;
