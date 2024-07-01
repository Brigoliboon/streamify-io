const url = 'https://api3.adsterratools.com/publisher/stats.json?start_date=2022-03-06&finish_date=2022-03-06&group_by=date';
const options = {method: 'GET', headers: {Accept: 'application/json', 'X-API-Key': 'a98019bc19987d2160801800e786f5fc'}};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}