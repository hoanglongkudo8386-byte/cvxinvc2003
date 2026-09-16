const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const keyPath = 'C:\\Users\\DELL\\Downloads\\sylvan-journey-508308-j5-cc50a831722a.json';

async function main() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: [
        'https://www.googleapis.com/auth/webmasters.readonly',
        'https://www.googleapis.com/auth/analytics.readonly'
      ],
    });

    const client = await auth.getClient();

    // 1. Google Search Console
    console.log("=== GOOGLE SEARCH CONSOLE ===");
    try {
      const searchconsole = google.searchconsole({ version: 'v1', auth: client });
      const siteList = await searchconsole.sites.list();
      const sites = siteList.data.siteEntry || [];
      if (sites.length === 0) {
        console.log("Không tìm thấy trang web nào trong Search Console.");
      } else {
        sites.forEach(site => {
          console.log(`- Site URL: ${site.siteUrl} (Quyền: ${site.permissionLevel})`);
        });
      }
    } catch (e) {
      console.log("Lỗi khi kết nối Search Console:", e.message);
    }

    console.log("\n=== GOOGLE ANALYTICS ===");
    try {
      const analyticsadmin = google.analyticsadmin({ version: 'v1beta', auth: client });
      const accounts = await analyticsadmin.accounts.list();
      
      if (!accounts.data.accounts || accounts.data.accounts.length === 0) {
        console.log("Không tìm thấy tài khoản Analytics nào.");
      } else {
        for (const account of accounts.data.accounts) {
          console.log(`- Account: ${account.displayName} (${account.name})`);
          
          const properties = await analyticsadmin.properties.list({ filter: `parent:${account.name}` });
          if (properties.data.properties) {
            properties.data.properties.forEach(prop => {
              console.log(`  + Property: ${prop.displayName} (ID: ${prop.name})`);
            });
          } else {
            console.log(`  + (Không có property nào)`);
          }
        }
      }
    } catch (e) {
      console.log("Lỗi khi kết nối Analytics:", e.message);
    }
  } catch (error) {
    console.error("Lỗi xác thực:", error.message);
  }
}

main();
