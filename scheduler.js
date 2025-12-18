const cron = require('node-cron');
const { getDB } = require('./db');
const { trackItems } = require('./thaiPostApi');


async function checkAllParcels() {
const db = await getDB();
const parcels = await db.all('SELECT * FROM parcels WHERE delivered = 0');
if (!parcels.length) return;


const codes = parcels.map(p => p.track_code);
const results = await trackItems(codes);


for (const code of codes) {
const logs = results[code];
if (!logs || !logs.length) continue;


const latest = logs[0];
const delivered = latest.status_description.includes('นำจ่ายสำเร็จ');


await db.run(
`UPDATE parcels SET last_status=?, last_update=?, delivered=? WHERE track_code=?`,
[latest.status_description, latest.status_date, delivered ? 1 : 0, code]
);
}
}


cron.schedule('0 13 * * *', checkAllParcels);
cron.schedule('0 18 * * *', checkAllParcels);


module.exports = { checkAllParcels };