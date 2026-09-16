const { google } = require('googleapis');
const path = require('path');

const keyPath = 'C:\\Users\\DELL\\Downloads\\sylvan-journey-508308-j5-cc50a831722a.json';
const propertyId = '553742301';

async function main() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    const client = await auth.getClient();
    const analyticsdata = google.analyticsdata({ version: 'v1beta', auth: client });

    const response = await analyticsdata.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [
          {
            startDate: '30daysAgo',
            endDate: 'today',
          },
        ],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'engagementRate' },
          { name: 'averageSessionDuration' }
        ],
      },
    });

    console.log("=== GA4 DATA (Last 30 Days) ===");
    console.log(JSON.stringify(response.data.rows, null, 2));
    console.log("=== GA4 METRIC HEADERS ===");
    console.log(JSON.stringify(response.data.metricHeaders, null, 2));
  } catch (error) {
    console.error("Error fetching GA data:", error.message);
  }
}

main();
