export const pingServer = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/ping', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Client connected' }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log('Ping sent successfully');
  } catch (error) {
    console.error('Error sending ping:', error);
  }
};
