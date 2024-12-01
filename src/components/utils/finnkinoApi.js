export const fetchSchedule = async (area, date) => {
  const url = `https://www.finnkino.fi/xml/Schedule/?area=${area}&dt=${date}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/xml'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");

    // Parse XML to JSON
    const shows = Array.from(xmlDoc.getElementsByTagName("Show")).map(show => ({
      ID: show.getElementsByTagName("ID")[0].textContent,
      dttmShowStart: show.getElementsByTagName("dttmShowStart")[0].textContent,
      dttmShowEnd: show.getElementsByTagName("dttmShowEnd")[0].textContent,
      Title: show.getElementsByTagName("Title")[0].textContent,
      LengthInMinutes: show.getElementsByTagName("LengthInMinutes")[0].textContent,
      TheatreAndAuditorium: show.getElementsByTagName("TheatreAndAuditorium")[0].textContent,
      Genres: show.getElementsByTagName("Genres")[0].textContent,
      RatingImageUrl: show.getElementsByTagName("RatingImageUrl")[0].textContent,
      ShowURL: show.getElementsByTagName("ShowURL")[0].textContent,
      SpokenLanguage: {
        Name: show.getElementsByTagName("SpokenLanguage")[0]?.getElementsByTagName("Name")[0]?.textContent ?? ''
      },
      SubtitleLanguage1: {
        Name: show.getElementsByTagName("SubtitleLanguage1")[0]?.getElementsByTagName("Name")[0]?.textContent ?? ''
      },
      SubtitleLanguage2: {
        Name: show.getElementsByTagName("SubtitleLanguage2")[0]?.getElementsByTagName("Name")[0]?.textContent ?? ''
      },
      Images: {
        EventSmallImagePortrait: show.getElementsByTagName("EventSmallImagePortrait")[0]?.textContent ?? ''
      },
      ContentDescriptors: Array.from(show.getElementsByTagName("ContentDescriptor")).map(descriptor => ({
        Name: descriptor.getElementsByTagName("Name")[0].textContent,
        ImageURL: descriptor.getElementsByTagName("ImageURL")[0].textContent
      }))
    }));

    return shows;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
  