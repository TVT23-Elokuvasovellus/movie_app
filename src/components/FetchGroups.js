const FetchGroups = async () => {
    try {
        const response = await fetch(`http://localhost:3001/myGroups`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        const data = await response.json();
        return data.myGroups || [];
      } catch (err) {
        console.error('Error fetching groups:', err.message);
        return [];
      }
};

export default FetchGroups;
