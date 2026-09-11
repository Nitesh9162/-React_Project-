/**
 * Helper to group OpenWeather 3-hour forecast list into daily summaries
 */
export function aggregateForecastData(forecastList) {
  if (!forecastList || !Array.isArray(forecastList)) return [];

  const daysMap = {};

  forecastList.forEach((item) => {
    // date text format: "YYYY-MM-DD HH:mm:ss"
    const dateObj = new Date(item.dt * 1000);
    const dateKey = dateObj.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (!daysMap[dateKey]) {
      daysMap[dateKey] = {
        dateKey,
        dayName,
        formattedDate,
        temps: [],
        humidities: [],
        winds: [],
        weatherMainList: [],
        weatherDescList: [],
        popList: [], // probability of precipitation
        rainVolume: 0,
        icons: [],
      };
    }

    daysMap[dateKey].temps.push(item.main.temp);
    daysMap[dateKey].humidities.push(item.main.humidity);
    daysMap[dateKey].winds.push(item.wind.speed);
    daysMap[dateKey].weatherMainList.push(item.weather[0]?.main || '');
    daysMap[dateKey].weatherDescList.push(item.weather[0]?.description || '');
    daysMap[dateKey].popList.push(item.pop || 0);
    if (item.rain && item.rain['3h']) {
      daysMap[dateKey].rainVolume += item.rain['3h'];
    }
    if (item.weather[0]?.icon) {
      daysMap[dateKey].icons.push(item.weather[0].icon);
    }
  });

  const dailySummaries = Object.values(daysMap).slice(0, 5).map((d) => {
    const minTemp = Math.round(Math.min(...d.temps));
    const maxTemp = Math.round(Math.max(...d.temps));
    const avgHumidity = Math.round(d.humidities.reduce((a, b) => a + b, 0) / d.humidities.length);
    const maxWind = Math.round(Math.max(...d.winds) * 3.6); // m/s to km/h
    const maxPop = Math.round(Math.max(...d.popList) * 100);

    // Most common weather main
    const modeWeatherMain = getMode(d.weatherMainList) || 'Clear';
    const modeWeatherDesc = getMode(d.weatherDescList) || 'clear sky';
    const icon = getMode(d.icons) || '01d';

    return {
      dateKey: d.dateKey,
      dayName: d.dayName,
      formattedDate: d.formattedDate,
      minTemp,
      maxTemp,
      humidity: avgHumidity,
      windSpeed: maxWind,
      pop: maxPop,
      rainVolume: Math.round(d.rainVolume * 10) / 10,
      weatherMain: modeWeatherMain,
      weatherDesc: modeWeatherDesc,
      icon,
    };
  });

  return dailySummaries;
}

function getMode(arr) {
  if (!arr.length) return null;
  const counts = {};
  let maxCount = 0;
  let mode = arr[0];
  for (const val of arr) {
    counts[val] = (counts[val] || 0) + 1;
    if (counts[val] > maxCount) {
      maxCount = counts[val];
      mode = val;
    }
  }
  return mode;
}

/**
 * Generate AI Advisory using Google Gemini API or Smart Fallback Engine
 */
export async function generateAiAdvisory(cityName, currentWeather, dailySummaries, apiKey = null) {
  if (apiKey && apiKey.trim()) {
    try {
      const geminiResult = await callGeminiApi(cityName, currentWeather, dailySummaries, apiKey);
      if (geminiResult) return geminiResult;
    } catch (err) {
      console.warn('Gemini API call failed, falling back to Smart Rule Engine:', err);
    }
  }

  // Fallback to Smart Algorithmic AI Advisory Engine
  return generateFallbackAdvisory(cityName, currentWeather, dailySummaries);
}

/**
 * Direct call to Google Gemini REST API
 */
async function callGeminiApi(cityName, currentWeather, dailySummaries, apiKey) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;

  const promptText = `
You are an expert AI Agrometeorologist and Travel Safety Advisor.
City: ${cityName}
Current Temperature: ${currentWeather.temp}°C, Weather: ${currentWeather.weather}, Humidity: ${currentWeather.humidity}%

5-Day Forecast Data:
${JSON.stringify(dailySummaries, null, 2)}

Analyze this 5-day weather forecast and generate a JSON response strictly following this JSON schema (do not wrap in markdown or backticks):
{
  "dynamicHeadline": "A single compelling executive statement summarizing upcoming weather risks and actionable advice for ${cityName}. Example: 'It's going to rain heavily in ${cityName} on Sunday. Avoid driving out, and if you are a farmer, delay adding fertilizer to your crops today.'",
  "alertLevel": "High" | "Moderate" | "Low",
  "travelSummary": "Detailed travel & driving safety advice based on wind, rain, fog, or heat over the 5 days.",
  "travelTips": ["Tip 1", "Tip 2", "Tip 3"],
  "cropSummary": "Detailed agricultural advice for farmers (irrigation, fertilizer schedule, pest prevention, crop harvesting) based on the forecast.",
  "cropTips": ["Crop Tip 1", "Crop Tip 2", "Crop Tip 3"],
  "bestTravelDay": "Name of best day for outdoor travel",
  "worstTravelDay": "Name of highest risk day"
}
`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API HTTP Error: ${response.status}`);
  }

  const data = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResponse) throw new Error('Empty response from Gemini API');

  const parsed = JSON.parse(textResponse);
  return {
    ...parsed,
    source: 'Gemini AI (Live API)',
  };
}

/**
 * Fallback Smart Advisory Engine using agronomy & meteorological rules
 */
export function generateFallbackAdvisory(cityName, currentWeather, dailySummaries) {
  // Find key weather conditions across 5 days
  const rainDays = dailySummaries.filter(
    (d) => d.pop >= 40 || d.weatherMain.toLowerCase().includes('rain') || d.weatherMain.toLowerCase().includes('thunderstorm')
  );
  const heavyRainDays = dailySummaries.filter(
    (d) => d.pop >= 70 || d.rainVolume > 5 || d.weatherMain.toLowerCase().includes('thunderstorm')
  );
  const hotDays = dailySummaries.filter((d) => d.maxTemp >= 35);
  const coldDays = dailySummaries.filter((d) => d.minTemp <= 10);
  const windyDays = dailySummaries.filter((d) => d.windSpeed > 30);

  let dynamicHeadline = '';
  let alertLevel = 'Low';

  if (heavyRainDays.length > 0) {
    const targetDay = heavyRainDays[0].dayName;
    alertLevel = 'High';
    dynamicHeadline = `It's going to rain heavily in ${cityName} on ${targetDay}. Avoid driving out during downpours, and if you are a farmer, delay adding fertilizer to your crops today to prevent runoff.`;
  } else if (rainDays.length > 0) {
    const targetDay = rainDays[0].dayName;
    alertLevel = 'Moderate';
    dynamicHeadline = `Light to moderate rainfall expected in ${cityName} around ${targetDay}. Ensure proper field drainage and keep umbrellas ready for commute.`;
  } else if (hotDays.length > 0) {
    const targetDay = hotDays[0].dayName;
    alertLevel = 'Moderate';
    dynamicHeadline = `Heatwave advisory for ${cityName} on ${targetDay} (reaching ${hotDays[0].maxTemp}°C). Increase crop irrigation frequency and stay hydrated while traveling.`;
  } else if (coldDays.length > 0) {
    const targetDay = coldDays[0].dayName;
    alertLevel = 'Moderate';
    dynamicHeadline = `Temperatures dropping down to ${coldDays[0].minTemp}°C in ${cityName} on ${targetDay}. Protect delicate crops from frost and drive carefully during morning fog.`;
  } else {
    dynamicHeadline = `Favorable weather conditions expected in ${cityName} over the next 5 days. Ideal for field work and outdoor travel.`;
  }

  // Travel Safety Analysis
  let travelSummary = '';
  const travelTips = [];

  if (heavyRainDays.length > 0 || rainDays.length > 0) {
    travelSummary = `Precipitation risk is elevated over the next 5 days in ${cityName}. Wet road conditions can increase braking distances by up to 40%.`;
    travelTips.push(`Avoid non-essential highway travel on ${rainDays.map((d) => d.dayName).join(', ')}.`);
    travelTips.push('Inspect vehicle wiper blades and check tire tread depth before long drives.');
    travelTips.push('Carry waterproof rain gear and expect potential municipal traffic delays.');
  } else if (windyDays.length > 0) {
    travelSummary = `High wind speeds peaking at ${windyDays[0].windSpeed} km/h detected. Drive cautiously on open bridges and high-altitude routes.`;
    travelTips.push('Keep both hands on the steering wheel when passing high-profile vehicles.');
    travelTips.push('Secure loose exterior luggage or rooftop cargo items.');
  } else {
    travelSummary = `Clear driving conditions forecasted for ${cityName}. Low road hazard risks and pleasant travel weather throughout the week.`;
    travelTips.push('Great window for road trips, outdoor sports, and sight-seeing.');
    travelTips.push('Keep UV protection handy during midday sunshine.');
  }

  // Smart Crop / Agriculture Analysis
  let cropSummary = '';
  const cropTips = [];

  if (heavyRainDays.length > 0) {
    cropSummary = `Heavy rain alert! Applying nitrogen or soluble fertilizers right before heavy rainfall causes nutrient leaching and fertilizer loss.`;
    cropTips.push(`Delay fertilizer application scheduled for ${heavyRainDays[0].dayName} until fields dry.`);
    cropTips.push('Inspect field drainage channels to prevent waterlogging around crop roots.');
    cropTips.push('Postpone chemical pesticide spraying as rainwater will wash away protective coatings.');
  } else if (rainDays.length > 0) {
    cropSummary = `Moderate precipitation will provide natural soil moisture replenishment for crops in ${cityName}.`;
    cropTips.push('Pause automated drip or sprinkler irrigation systems to conserve water.');
    cropTips.push('Monitor high-humidity vulnerable crops for fungal or blight infections.');
  } else if (hotDays.length > 0) {
    cropSummary = `High evapotranspiration rates predicted due to temperatures reaching ${hotDays[0].maxTemp}°C.`;
    cropTips.push('Schedule irrigation early in the morning or late evening to minimize evaporation loss.');
    cropTips.push('Apply organic mulch to retain soil moisture and protect root zones from heat stress.');
  } else {
    cropSummary = `Stable weather window for agricultural operations in ${cityName}. Soil moisture levels remain balanced.`;
    cropTips.push('Optimal conditions for fertilizer application, weeding, and crop harvesting.');
    cropTips.push('Conduct routine field scouting and soil nutrient testing.');
  }

  // Find best and worst travel days
  const sortedByWeather = [...dailySummaries].sort((a, b) => a.pop - b.pop);
  const bestTravelDay = sortedByWeather[0]?.dayName || 'Everyday';
  const worstTravelDay = sortedByWeather[sortedByWeather.length - 1]?.dayName || 'None';

  return {
    dynamicHeadline,
    alertLevel,
    travelSummary,
    travelTips,
    cropSummary,
    cropTips,
    bestTravelDay,
    worstTravelDay,
    source: 'AI Rule Engine (Built-in)',
  };
}
