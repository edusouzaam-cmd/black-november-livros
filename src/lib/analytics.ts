// Keep the original async GTM behavior and campaign triggers. Low fetch priority
// lets first-screen images and fonts win the network without postponing all tags
// into a single post-load burst. Repeated bootstrap execution stays idempotent.
export const analyticsBootstrap = `(function(w,d){if(w.__engetelesGtmScheduled)return;w.__engetelesGtmScheduled=true;w.dataLayer=w.dataLayer||[];w.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});var script=d.createElement('script');script.async=true;script.fetchPriority='low';script.src='https://www.googletagmanager.com/gtm.js?id=GTM-W327944';d.head.appendChild(script)})(window,document);`;
