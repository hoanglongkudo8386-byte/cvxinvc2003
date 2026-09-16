const { google } = require('googleapis');

const keyPath = 'C:\\Users\\DELL\\Downloads\\sylvan-journey-508308-j5-cc50a831722a.json';
const SITE_URL = 'https://hoangthelong.io.vn/';
const GA4_PROPERTY_ID = 'properties/553742301';

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/analytics.readonly'
    ],
  });
  const client = await auth.getClient();
  
  // Date range: last 7 days
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  const startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  console.log(`Report for ${startDate} to ${endDate}`);

  // 1. Fetch Search Console Data (Top 5 Queries)
  try {
    const searchconsole = google.searchconsole({ version: 'v1', auth: client });
    const gscResponse = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: startDate,
        endDate: endDate,
        dimensions: ['query'],
        rowLimit: 5
      }
    });
    console.log("\n--- GSC: Top Queries ---");
    if (gscResponse.data.rows) {
      gscResponse.data.rows.forEach(r => {
        console.log(`Query: "${r.keys[0]}" | Clicks: ${r.clicks} | Impr: ${r.impressions} | Pos: ${r.position.toFixed(1)}`);
      });
    } else {
      console.log("No GSC data found.");
    }
    
    const gscResponseTotals = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: startDate,
        endDate: endDate,
        dimensions: ['date']
      }
    });
    console.log("\n--- GSC: Totals ---");
    let totalClicks = 0, totalImpr = 0;
    if (gscResponseTotals.data.rows) {
      gscResponseTotals.data.rows.forEach(r => {
        totalClicks += r.clicks;
        totalImpr += r.impressions;
      });
    }
    console.log(`Total Clicks: ${totalClicks} | Total Impressions: ${totalImpr}`);
    
  } catch (e) {
    console.log("GSC Error:", e.message);
  }

  // 2. Fetch GA4 Data (Users, Sessions, Views)
  try {
    const analyticsdata = google.analyticsdata({ version: 'v1beta', auth: client });
    const gaResponse = await analyticsdata.properties.runReport({
      property: GA4_PROPERTY_ID,
      requestBody: {
        dateRanges: [{ startDate: startDate, endDate: 'today' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' }
        ]
      }
    });
    console.log("\n--- GA4: Totals ---");
    if (gaResponse.data.rows) {
      gaResponse.data.rows.forEach(row => {
        console.log(`Active Users: ${row.metricValues[0].value}`);
        console.log(`Sessions: ${row.metricValues[1].value}`);
        console.log(`Page Views: ${row.metricValues[2].value}`);
      });
    } else {
      console.log("No GA4 data found.");
    }
  } catch (e) {
    console.log("GA4 Error:", e.message);
  }
}

main();
