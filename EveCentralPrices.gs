/*

Takes a bunch of typeids from a list (duplicates are fine. multidimensional is fine) and returns a bunch of rows 
with relevant price data.

TypeID,Buy Volume,Buy average,Buy max,Buy min,Buy Std deviation,Buy median,Buy Percentile,
Sell Volume,Sell Average,Sell Max,Sell Min,Sell std Deviation,Sell Median,sell Percentile



I'd suggest loading price data into a new sheet, then using vlookup to get the bits you care about in your main sheet.

loadRegionPrices defaults to the Forge
loadSystemPrices defaults to Jita


=loadRegionPrices(A1:A28)
=loadRegionPrices(A1:A28,10000002)
=loadRegionPrices(A1:A28,10000002,47)

=loadSystemPrices(A1:A28)






An example below:

https://docs.google.com/spreadsheets/d/1f9-4cb4Tx64Do-xmHhELSwZGahZ2mTTkV7mKDBRPrrY/edit?usp=sharing

*/
/**
 * Loads prices for a given set of typeIDs for a specific region using Eve-Central's data.
 * @param {number[]} priceIDs - An array of item typeIDs.
 * @param {number} [regionID=10000002] - The region to query.
 * @param {number} [cachebuster=1] - Increment this variable to refresh the data.
 * @returns {Promise<Array<Array<number>>>} - The price data in multiple arrays.
 */
async function loadRegionPrices(priceIDs, regionID = 10000002, cachebuster = 1) {
  const prices = [];
  const dirtyTypeIds = [...new Set(priceIDs.filter(cell => typeof cell === 'number'))];
  const url = `http://api.eve-central.com/api/marketstat?cachebuster=${cachebuster}&regionlimit=${regionID}&typeid=`;

  for (let o = 0; o < dirtyTypeIds.length; o += 100) {
    const temparray = dirtyTypeIds.slice(o, o + 100);
    await new Promise(resolve => setTimeout(resolve, 100)); // Rate limit the requests.
    const typeIdsString = temparray.join("&typeid=");
    const response = await fetch(url + typeIdsString);
    const data = await response.json();

    if (data) {
      data.marketstat.type.forEach(row => {
        const price = [
          +(row["@attributes"].id),
          +(row.buy.volume),
          +(row.buy.avg),
          +(row.buy.max),
          +(row.buy.min),
          +(row.buy.stddev),
          +(row.buy.median),
          +(row.buy.percentile),
          +(row.sell.volume),
          +(row.sell.avg),
          +(row.sell.max),
          +(row.sell.min),
          +(row.sell.stddev),
          +(row.sell.median),
          +(row.sell.percentile)
        ];
        prices.push(price);
      });
    }
  }

  return prices;
}

/**
 * Loads prices for a given set of typeIDs for a specific system using Eve-Central's data.
 * @param {number[]} priceIDs - An array of item typeIDs.
 * @param {number} [systemID=30000142] - The system to query.
 * @param {number} [cachebuster=1] - Increment this variable to refresh the data.
 * @returns {Promise<Array<Array<number>>>} - The price data in multiple arrays.
 */
async function loadSystemPrices(priceIDs, systemID = 30000142, cachebuster = 1) {
  const prices = [];
  const dirtyTypeIds = [...new Set(priceIDs.filter(cell => typeof cell === 'number'))];
  const url = `http://api.eve-central.com/api/marketstat?cachebuster=${cachebuster}&usesystem=${systemID}&typeid=`;

  for (let o = 0; o < dirtyTypeIds.length; o += 100) {
    const temparray = dirtyTypeIds.slice(o, o + 100);
    const typeIdsString = temparray.join("&typeid=");
    const response = await fetch(url + typeIdsString);
    const data = await response.json();

    if (data) {
      data.marketstat.type.forEach(row => {
        const price = [
          +(row["@attributes"].id),
          +(row.buy.volume),
          +(row.buy.avg),
          +(row.buy.max),
          +(row.buy.min),
          +(row.buy.stddev),
          +(row.buy.median),
          +(row.buy.percentile),
          +(row.sell.volume),
          +(row.sell.avg),
          +(row.sell.max),
          +(row.sell.min),
          +(row.sell.stddev),
          +(row.sell.median),
          +(row.sell.percentile)
        ];
        prices.push(price);
      });
    }
  }

  return prices;
}

  }
  return prices;
}
